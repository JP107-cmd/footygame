import { Suspense } from "react";
import InputGuess from "./InputGuess";
import Guesses from "./Guesses";
import { active, gameState } from "@/server/lib/actions";

export default async function Game() {

    const gameState : gameState = await active();

    return (
        <section className="flex flex-col gap-10">
            <InputGuess gameState={gameState}/>
            <Suspense fallback={<p>Loading...</p>}>
                <Guesses gameState={gameState}/>
            </Suspense>
        </section>
    );
}