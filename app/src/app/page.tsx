import Game from "@/components/Game";
import { Suspense } from "react";

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl font-bold">Footy Finder</h1>
        <p className="text-lg">Find Mystery Club From Europe&apos;s Top 5 Leagues</p>
      </div>
      <Suspense fallback={<p>Loading Game</p>}>
        <Game/>
      </Suspense>
    </main>
  );
}
