import { Suspense } from "react";
import InputGuess from "./InputGuess";
import Guesses from "./Guesses";
import { active, gameState } from "@/server/lib/actions";

export default async function Game() {

    const gameState : gameState = await active();

    return (
        <section className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-xl font-bold">GUESS HERE</h1>
            <InputGuess gameState={gameState}/>
            <Suspense fallback={<p>Loading...</p>}>
                <Guesses gameState={gameState}/>
            </Suspense>
        </section>
    );
}