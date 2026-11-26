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
        className="mx-auto grid w-full max-w-6xl flex-1 grid-rows-[auto_auto_auto] gap-8 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-8"
        >
            <div className="h-fit space-y-3 rounded-md border-2 border-brass bg-sign px-6 py-4 shadow-[0_0_0_3px_#5A3420,0_8px_18px_rgb(0_0_0/0.3)]">
                <h1 className="font-display text-4xl font-extrabold tracking-wide text-gilt">Footy Finder</h1>
                <p className="text-sm text-cream/80">Find the mystery club</p>
            </div>
            <div className="h-56 sm:h-80 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[min(70dvh,42rem)]">
                <Suspense fallback={<p>Loading...</p>}>
                    <Map guesses={guesses}/>
                </Suspense>
            </div>
            <div className="table-surface flex flex-col overflow-hidden rounded-md border border-frame shadow-lg lg:min-h-0 lg:max-h-full">
                <InputGuess gameState={gameState}/>
                <Suspense fallback={<p>Loading...</p>}>
                    <Guesses guesses={guesses}/>
                </Suspense>
            </div>
        </section>
    );
}
