import { getGuesses } from "@/server/lib/actions"
import { gameState } from "@/server/lib/actions";

export default async function Guesses({ gameState } : { gameState : gameState}) {

    const guesses = await getGuesses(gameState);
    return (
        <div className="flex flex-col gap-4 w-2xl">
            <span className="text-xl font-bold flex flex-row"><p>Past Guesses <i className="font-light">{guesses.length}</i></p></span>
            { guesses.map((guess : any) => (
              <div className="justify-between gap-2 border border-gray-300 rounded-md py-2 px-4 shadow-md" key={guess.name}>
                <div className="">
                  <p className="text-md">{guess.name}</p>
                  <p className="text-md">{guess.distance} km away</p>
                </div>
                <div className="flex flex-row gap-x-2">
                  <p className="font-sans">{guess.league}</p>
                  <p>{guess.country}</p>
                </div>
              </div>
            ))
            }
          </div>
    )
}