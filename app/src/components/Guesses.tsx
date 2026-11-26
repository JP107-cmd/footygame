import { guessType } from "@/server/lib/actions"

export default async function Guesses({ guesses } : { guesses : Array<guessType | []>}) {

   const colour = ((answer : boolean, distance : number) => {
    return (answer
      ? "#1F4D36"
      : distance < 25 ? '#E4572E' : distance < 100 ? '#E4572E' : distance < 250 ? '#F2A541' : distance < 500 ? '#F2A541' : distance < 900 ? '#5DA9E9' : '#1F4E8C');
   })

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
            <span className="flex flex-row font-display text-xl font-bold text-gilt"><p>Past Guesses <i className="font-sans font-normal text-sm text-cream/75">{guesses?.length}</i></p></span>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-2">
              { guesses?.map((guess : any) => (
                <div className="flex flex-col justify-between gap-3 rounded-md border border-brass/70 bg-paper px-4 py-3 text-ink shadow-md sm:flex-row sm:items-center" key={guess.name}>
                  <div className="">
                    <p className="font-display text-md font-bold">{guess.name}</p>
                    <p className="text-sm text-ink-soft">{guess.distance} km away</p>
                  </div>
                  <div className="flex flex-row flex-wrap gap-x-2 gap-y-1">
                    <p className="font-sans text-sm">{guess.league}</p>
                    <p className="text-sm">{guess.country}</p>
                    <div className="h-3 w-3 shrink-0 rounded-full ring-1 ring-ink/20" style={{ backgroundColor: colour(guess.answer, guess.distance) }}/>
                  </div>
                </div>
              ))
              }
            </div>
          </div>
    )
}
