import { getGuesses } from "@/server/lib/actions"

export default async function Guesses() {
    const guesses = await getGuesses();
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-xl font-bold">PAST GUESSES</h1>
            { guesses.map((guess : any) => (
              <div className="flex flex-col items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4" key={guess.name}>
                <h1 className="text-lg font-semibold">{guess.name}</h1>
                <h2 className="text-md">{guess.distance} km away</h2>
              </div>
            ))
            }
          </div>
    )
}