import { guessType } from "@/server/lib/actions"

export default async function Guesses({ guesses } : { guesses : Array<guessType | []>}) {

  const colour = (answer: boolean | null, distance: number) => {
    return answer
      ? "#1F4D36"
      : distance < 100 ? "#E4572E"
      : distance < 500 ? "#F2A541"
      : distance < 900 ? "#5DA9E9"
      : "#1F4E8C";
  };

  const rotation = (seed: string) => {
    const value = [...seed].reduce((total, character) => (
      (total * 31 + character.charCodeAt(0)) % 1000
    ), 0);

    if (value > 750) return '6deg';
    else if (value > 500) return '3deg';
    else if (value > 250) return '-3deg';
    else return '-6deg';
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3 px-3 pb-4 sm:px-5">
      <header className="flex items-baseline justify-between gap-3 border-t border-black/30 pt-3">
        <h2 className="font-display text-2xl font-bold text-cream">
          Past Guesses
        </h2>
      </header>

      <div className="guess-scroll grid grid-cols-2 content-start gap-3 pb-2 sm:gap-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-2">
        {guesses?.map((guess: any) => {
          const distanceColour = colour(guess.answer, guess.distance);

          return (
            <article
              className="coaster aspect-square min-w-0 rounded-full bg-cream p-[3%] text-center text-ink shadow-[0_6px_12px_rgb(0_0_0/0.3)]"
              key={guess.name}
              style={{ transform: `rotate(${rotation(guess.name ?? "")})` }}
            >
              <div className="h-full rounded-full p-[7%]" style={{ backgroundColor: distanceColour }}>
                <div className="flex h-full flex-col items-center justify-center rounded-full border-2 border-dashed border-[#B59661] bg-paper px-[9%] py-[8%]">
                  <h3 className="coaster-name font-display font-bold leading-[1.05]">
                    {guess.name}
                  </h3>
                  <p className="coaster-meta mt-[3cqi] leading-tight text-ink-soft">
                    {guess.league}{guess.country ? ` · ${guess.country}` : ""}
                  </p>
                  <p className="coaster-distance mt-[8cqi] font-display font-extrabold leading-none">
                    {guess.distance}<span className="coaster-unit ml-[1cqi]">km</span>
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
