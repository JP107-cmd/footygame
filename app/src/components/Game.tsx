import { Suspense } from "react";
import InputGuess from "./InputGuess";
import Guesses from "./Guesses";
import { active, gameState, getGuesses } from "@/server/lib/actions";
import Map from "./Map";

export default async function Game() {

    const gameState : gameState = await active();
    const guesses = await getGuesses(gameState);

    return (
        <section
        className="mx-auto grid w-full max-w-6xl flex-1 grid-rows-[auto_auto_auto] gap-8 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)] lg:grid-rows-[auto_minmax(0,1fr)]"
        >
            <header className="flex flex-row items-center gap-3 lg:col-span-2 lg:justify-between">
                <div className="min-w-0 flex-1 rounded-md border-2 border-brass bg-sign px-3 py-2 text-center shadow-[0_0_0_3px_#5A3420,0_8px_18px_rgb(0_0_0_/_0.3)] sm:px-6 sm:py-3 lg:max-w-xl lg:flex-none">
                    <p className="font-chalk text-base font-bold leading-none text-cream sm:text-lg">The</p>
                    <h1 className="font-display text-xl font-extrabold leading-none tracking-wide text-gilt sm:text-4xl">Footy Finder</h1>
                    <p className="mt-1 text-[8px] font-bold tracking-[0.15em] text-gilt sm:text-[10px] sm:tracking-[0.24em]">GUESS THE MYSTERY CLUB</p>
                </div>
                <div className="shrink-0 rounded-md border-4 border-frame bg-slate px-3 py-2 text-center shadow-[0_5px_12px_rgb(0_0_0_/_0.28)] sm:px-8 sm:py-3">
                    <p className="font-chalk text-base font-bold leading-none text-chalk sm:text-xl">Throws</p>
                    <p className="font-chalk text-3xl font-bold leading-none text-chalk sm:text-4xl">{guesses?.length ?? 0}</p>
                </div>
            </header>
            <div className="h-56 sm:h-80 lg:col-start-2 lg:row-start-2 lg:h-full lg:min-h-0">
                <Suspense fallback={<p>Loading...</p>}>
                    <Map guesses={guesses}/>
                </Suspense>
            </div>
            <div className="table-surface flex flex-col overflow-hidden rounded-md border border-frame shadow-lg lg:col-start-1 lg:row-start-2 lg:min-h-0 lg:max-h-full">
                <InputGuess gameState={gameState}/>
                <Suspense fallback={<p>Loading...</p>}>
                    <Guesses guesses={guesses}/>
                </Suspense>
            </div>
        </section>
    );
}
