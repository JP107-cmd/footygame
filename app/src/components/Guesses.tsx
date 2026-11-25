import { getGuesses, guessType } from "@/server/lib/actions"
import { gameState } from "@/server/lib/actions";

export default async function Guesses({ gameState, guesses } : { gameState : gameState, guesses : Array<guessType | []>}) {

   const colour = ((answer : boolean, distance : number) => {
    return (answer
      ? "#22c55e"
      : distance < 25 ? '#ef533c' : distance < 100 ? '#ff8440' : distance < 250 ? '#ffbd3e' : distance < 500 ? '#a8dc4d' : distance < 900 ? '#38b9eb' : '#2459c8');
   })

    return (
        <div className="flex min-h-0 flex-col gap-4">
            <span className="flex flex-row text-xl font-bold"><p>Past Guesses <i className="font-light">{guesses?.length}</i></p></span>
            { guesses?.map((guess : any) => (
              <div className="flex flex-col justify-between gap-3 rounded-md border border-gray-300 px-4 py-3 shadow-md sm:flex-row sm:items-center" key={guess.name}>
                <div className="">
                  <p className="text-md">{guess.name}</p>
                  <p className="text-md">{guess.distance} km away</p>
                </div>
                <div className="flex flex-row flex-wrap gap-x-2 gap-y-1">
                  <p className="font-sans">{guess.league}</p>
                  <p>{guess.country}</p>
                  <div className={`bg-amber-200 bg-[${colour(guess.answer, guess.distance)}] h-10`}/>
                </div>
              </div>
            ))
            }
          </div>
    )
}
