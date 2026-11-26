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
        className="mx-auto grid h-full min-h-0 w-full max-w-6xl flex-1 grid-rows-[auto_minmax(14rem,0.9fr)_minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)] lg:grid-rows-[auto_minmax(0,1fr)] mt-10"
        >
            <div className="h-fit space-y-3">
                <h1 className="text-4xl">Footy Finder</h1>
                <p>Description here sadsaojidj o <br /> asdasadawdaw <br/> sadasdo</p>
            </div>
            <div className="min-h-56 max-h-180 sm:min-h-80 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[min(70dvh,42rem)] lg:min-h-0">
                <Suspense fallback={<p>Loading...</p>}>
                    <Map guesses={guesses}/>
                </Suspense>
            </div>
            <div className="flex min-h-0 max-h-full flex-col gap-6 overflow-hidden">
                <InputGuess gameState={gameState}/>
                <Suspense fallback={<p>Loading...</p>}>
                    <Guesses gameState={gameState} guesses={guesses}/>
                </Suspense>
            </div>
        </section>
    );
}
