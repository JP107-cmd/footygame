import Game from "@/components/Game";
import { Suspense } from "react";

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col gap-10 p-24">
      <div className="z-10 w-full max-w-5xl text-sm">
        <h1 className="text-4xl font-bold">Footy Finder</h1>
        <p className="text-lg">Find Mystery Club From Europe&apos;s Top 5 Leagues</p>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <Suspense fallback={<p>Loading Game</p>}>
          <Game/>
        </Suspense>
        <div className="bg-black"/>
      </section>
    </main>
  );
}
