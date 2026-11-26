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
            <header className="flex flex-col gap-4 lg:col-span-2 lg:flex-row lg:items-center lg:justify-between">
                <div className="w-full rounded-md border-2 border-brass bg-sign px-6 py-3 text-center shadow-[0_0_0_3px_#5A3420,0_8px_18px_rgb(0_0_0_/_0.3)] lg:max-w-xl">
                    <p className="font-chalk text-lg font-bold leading-none text-cream">The</p>
                    <h1 className="font-display text-3xl font-extrabold leading-none tracking-wide text-gilt sm:text-4xl">Footy Finder</h1>
                    <p className="mt-1 text-[10px] font-bold tracking-[0.24em] text-gilt">GUESS THE MYSTERY CLUB</p>
                </div>
                <div className="self-center rounded-md border-4 border-frame bg-slate px-8 py-3 text-center shadow-[0_5px_12px_rgb(0_0_0_/_0.28)] lg:self-auto">
                    <p className="font-chalk text-xl font-bold leading-none text-chalk">Throws</p>
                    <p className="font-chalk text-4xl font-bold leading-none text-chalk">{guesses?.length ?? 0}</p>
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
