import Game from "@/components/Game";
import { Suspense } from "react";

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<p>Loading Game</p>}>
        <Game/>
      </Suspense>
    </main>
  );
}
