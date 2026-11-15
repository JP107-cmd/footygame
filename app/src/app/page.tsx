import { Suspense } from "react";
import Guesses from "@/components/Guesses";
import InputGuess from "@/components/InputGuess";

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl font-bold">Footy Finder</h1>
        <p className="text-lg">Find Mystery Club From Europe's Top 5 Leagues</p>
      </div>
      <section className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-xl font-bold">GUESS HERE</h1>
            <InputGuess/>
          <Suspense fallback={<p>Loading...</p>}>
            <Guesses/>
          </Suspense>
      </section>
    </main>
  );
}
