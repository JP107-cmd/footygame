"use server"
import { db } from "@/server/db";
import { clubsTable, gamesTable, guessesTable } from "@/server/db/schema";
import { sql, eq, or, desc, and } from "drizzle-orm";
import { cookies } from 'next/headers'
import { getDistance } from "geolib";
import { revalidatePath } from "next/cache";

export async function getGuesses() {

  const cookieStore = await cookies();
  const checkid : string = cookieStore.get("game_id")?.value ?? "";
  if (checkid === "") {
    return [];
  }

  const active = await db
        .select({ game_over: gamesTable.gameOver })
        .from(gamesTable)
        .where(eq(gamesTable.id, checkid));

  if (active[0].game_over) {
    return [];
  }

  
  const guesses = await db
    .select({ distance: guessesTable.distance, name: clubsTable.name, league: clubsTable.league, country: clubsTable.country})
    .from(guessesTable)
    .leftJoin(clubsTable, eq(clubsTable.id, guessesTable.guess))
    .where(eq(guessesTable.gameId, checkid))
    .orderBy(desc(guessesTable.guessNumber));
  
  return guesses;

}

export async function actionHandler(input : string, _: unknown, formData: FormData) : Promise<{
  error : string | null;
  gameOver : boolean;
}> 
{
    if (input === "guess") return await submitGuess(_, formData);
    else if (input == "start-game") {
      revalidatePath("/");
    }
    return {
      error : null,
      gameOver : false
    }
}

export async function submitGuess(_: unknown, formData: FormData) : Promise<{
  error : string | null;
  gameOver : boolean;
}> 
{
  try {
    const guess = String(formData.get("guess") ?? "").trim();
    const guessButton = String(formData.get("guess-button") ?? "").trim();
    const result = await db
      .select({id: clubsTable.id})
      .from(clubsTable)
      .where(or(eq(clubsTable.name, guess), eq(clubsTable.name, guessButton)))
      .limit(1);
    
    if (result.length === 0) {
      return {
        error : "That's not a club!",
        gameOver : false
      }
    }

    const { id } = result[0]
    
    const cookieStore = await cookies();
    let gameId : string = cookieStore.get("game_id")?.value ?? "";
    if (gameId === "") {
      await startGame();
      gameId = cookieStore.get("game_id")?.value ?? "";
    }

    const duplicate = await db
      .select({id: guessesTable.id})
      .from(guessesTable)
      .where(and(eq(guessesTable.gameId, gameId), eq(guessesTable.guess, id)))

    if (duplicate.length > 0){
      return {
        error : "Already Guessed!",
        gameOver : false
      }
    }

    const check = await db
      .update(gamesTable)
      .set({guesses : sql`${gamesTable.guesses}+1`})
      .where(eq(gamesTable.id, gameId))
      .returning({answer: gamesTable.answer, guesses: gamesTable.guesses});

    const { answer, guesses } = check[0];
    let correct = id == answer;

    if (correct) {
      await db
      .update(gamesTable)
      .set({gameOver: correct})
      .where(eq(gamesTable.id, gameId));
    }

    let distance : number = 0
    if (correct) {
      distance = 0;
    } else {
      const cooridates = await db
      .select({latitude: clubsTable.latitude, longitude: clubsTable.longitude})
      .from(clubsTable)
      .where(or(eq(clubsTable.id, id), eq(clubsTable.id, answer)));
      const cooridnates1 = cooridates[0];
      const cooridates2 = cooridates[1];
      distance = Math.round(getDistance(cooridnates1, cooridates2)/1000);
    }

    await db
      .insert(guessesTable)
      .values({ guess: id, gameId: gameId, distance: distance, answer: correct, guessNumber: (guesses+1) });
    
    
    revalidatePath("/")

    return {
      error : null,
      gameOver : correct
    }
  } catch (e) {
    return {
      error : "database error, please email this guy to fix it: jaydenidsp@gmail.com",
      gameOver : false
    }
  }

}

export async function startGame() : Promise<{
  error : string | null;
  gameOver : boolean;
}> 
{
  try {
    const cookieStore = await cookies();
    const checkid : string = cookieStore.get("game_id")?.value ?? "";
    if (checkid !== "") {
      const active = await db
      .select({ game_over: gamesTable.gameOver })
      .from(gamesTable)
      .where(eq(gamesTable.id, checkid));
      if (!active[0].game_over) {
        return {
          error : "game active",
          gameOver : false
        }
      }
    }


    const result = await db
      .select({id: clubsTable.id})
      .from(clubsTable)
      .orderBy(sql`random()`)
      .limit(1);
    const { id } = result[0];

    const insert = await db
      .insert(gamesTable)
      .values({answer: id})
      .returning({id: gamesTable.id});

    const gameId = insert[0].id;

    cookieStore.set("game_id", String(gameId));
    return {
      error : null,
      gameOver : false
    };
  } catch (e) {
    return {
      error : "database error, please email this guy to fix it: jaydenidsp@gmail.com",
      gameOver : false
    }
  }
}