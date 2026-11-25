"use server"
import { db } from "@/server/db";
import { clubsTable, gamesTable, guessesTable } from "@/server/db/schema";
import { sql, eq, or, desc, and } from "drizzle-orm";
import { cookies } from 'next/headers'
import { getDistance } from "geolib";
import { revalidatePath } from "next/cache";
import { validate } from "uuid";

export type gameState = "active" | "gameOver" | "noActiveGame";

export type guessType = {
  distance : number,
  name : string | null,
  league : string | null,
  country : string | null
  latitude : number | null,
  longitude : number | null,
  stadium : string | null,
  answer : boolean | null
}

export async function getGuesses(gameState : gameState) : Promise<Array<guessType | []>> {

  if (gameState === "noActiveGame") {
    return [];
  }

  const cookieStore = await cookies();
  const checkid : string = cookieStore.get("game_id")?.value ?? "";
  if (!validate(checkid)) {
    return [];
  }

  try {
    const guesses = await db
      .select({ 
        distance: guessesTable.distance, name: clubsTable.name, league: clubsTable.league, country: clubsTable.country,
        latitude: clubsTable.latitude, longitude: clubsTable.longitude, stadium : clubsTable.stadiumName, answer : guessesTable.answer
      })
      .from(guessesTable)
      .leftJoin(clubsTable, eq(clubsTable.id, guessesTable.guess))
      .where(eq(guessesTable.gameId, checkid))
      .orderBy(desc(guessesTable.guessNumber));
    
    return guesses;
  } catch (e) {
    return [];
  }

}

export async function actionHandler(input : string, _: unknown, formData: FormData) : Promise<{
  error : string | null;
}> 
{
    if (input === "guess") return await submitGuess(_, formData);
    else if (input === "start-game") {
      await startGame();
    }
    return {
      error : null,
    }
}

export async function submitGuess(_: unknown, formData: FormData) : Promise<{
  error : string | null;
}> 
{
  try {
    const guess = String(formData.get("guess") ?? "").trim();
    const guessButton = String(formData.get("guess-button") ?? "").trim();
    const result = await db
      .select({id: clubsTable.id})
      .from(clubsTable)
      .where(or(eq(clubsTable.name, guessButton), eq(clubsTable.name, guess)))
      .limit(1);
    
    if (result.length === 0) {
      return {
        error : "That's not a club!",
      }
    }

    const { id } = result[0]
    
    const cookieStore = await cookies();
    let gameId : string = cookieStore.get("game_id")?.value ?? "";
    if (validate(gameId)) {
      const active = await db
      .select({ game_over: gamesTable.gameOver })
      .from(gamesTable)
      .where(eq(gamesTable.id, gameId));
      
      if (active[0].game_over) {
        await startGame();
        gameId = cookieStore.get("game_id")?.value ?? "";
      }
    } else {
      await startGame();
      gameId = cookieStore.get("game_id")?.value ?? "";
    }

    const duplicate = await db
      .select({id: guessesTable.id})
      .from(guessesTable)
      .where(and(eq(guessesTable.gameId, gameId), eq(guessesTable.guess, id)))

    if (duplicate.length > 0) {
      return {
        error : "Already Guessed!",
      }
    }

    await db.transaction(async (db) => {

      const check = await db
        .select({answer: gamesTable.answer, guesses: gamesTable.guesses})
        .from(gamesTable)
        .where(eq(gamesTable.id, gameId));
      

      const { answer, guesses } = check[0];
      const correct = id == answer;

      try {
        await db
          .update(gamesTable)
          .set({gameOver: correct, guesses : sql`${gamesTable.guesses}+1`})
          .where(eq(gamesTable.id, gameId));
        

        let distance : number;
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
      } catch (e) {
        db.rollback();
        return {
          error : "database error"
        }
      }
    });
    
    revalidatePath("/");

    return {
      error : null
    }

  } catch (e) {
    return {
      error : "database error, please email this guy to fix it: jaydenidsp@gmail.com",
    }
  }

}

export async function startGame() : Promise<{
  error : string | null;
}> 
{
  try {
    const cookieStore = await cookies();
    const checkid : string = cookieStore.get("game_id")?.value ?? "";
    if (validate(checkid)) {
      const active = await db
      .select({ game_over: gamesTable.gameOver })
      .from(gamesTable)
      .where(eq(gamesTable.id, checkid));
      
      if (!active[0]?.game_over) {
        return {
          error : "game active",
        }
      } else {
        cookieStore.delete("game_id");
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
    revalidatePath("/");
    
    return {
      error : null,
    };

  } catch (e) {
    return {
      error : "database error, please email this guy to fix it: jaydenidsp@gmail.com",
    }
  }
}

export async function active() : Promise<gameState> {
  const cookieStore = await cookies();
  const gameId : string = cookieStore.get("game_id")?.value ?? "";
  if (validate(gameId)) {
      const active = await db
      .select({ game_over: gamesTable.gameOver })
      .from(gamesTable)
      .where(eq(gamesTable.id, gameId));
      if (active[0]?.game_over !== null || active[0]?.game_over !== undefined) {
        if (!active[0].game_over) {
          return "active";
        } else {
          return "gameOver";
        }
      } else {
        return "noActiveGame";
      }
  } else {
    return "noActiveGame";
  }

}