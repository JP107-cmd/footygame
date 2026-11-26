import Game from "@/components/Game";
import { Suspense } from "react";

export default async function Home() {

  return (
    <main className="flex min-h-dvh flex-col p-4 sm:p-6 lg:h-dvh lg:max-h-dvh lg:overflow-hidden lg:p-8">
      <Suspense fallback={<p>Loading Game</p>}>
        <Game/>
      </Suspense>
    </main>
  );
}
