import Game from "@/components/Game";
import { Suspense } from "react";

export default async function Home() {

  return (
    <main className="flex h-dvh max-h-dvh flex-col overflow-hidden p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<p>Loading Game</p>}>
        <Game/>
      </Suspense>
    </main>
  );
}
