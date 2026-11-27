"use client";

import { useState, useSyncExternalStore } from "react";

const storageKey = "footy-finder:how-to-play:v1";

function getStorageSnapshot() {
  try {
    return localStorage.getItem(storageKey) !== "seen";
  } catch {
    return true;
  }
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

const guide = [
  { colour: "text-hot", dot: "bg-hot", title: "Red · under 200 km", detail: "Nearly there" },
  { colour: "text-warm", dot: "bg-warm", title: "Amber · 200–499 km", detail: "Getting warmer" },
  { colour: "text-cool", dot: "bg-cool", title: "Light blue · 500–999 km", detail: "Further away" },
  { colour: "text-cold", dot: "bg-cold", title: "Navy · 1,000 km+", detail: "Try another area" },
  { colour: "text-bottle", dot: "bg-bottle", title: "Green · correct", detail: "You found it" },
];

export default function HowToPlay() {
  const [dismissed, setDismissed] = useState(false);
  const shouldOpen = useSyncExternalStore(subscribeToStorage, getStorageSnapshot, () => false);

  function dismiss() {
    try {
      localStorage.setItem(storageKey, "seen");
    } catch {
      // Storage can be unavailable in privacy-restricted browser sessions. (boo we want your data)
    }
    setDismissed(true);
  }

  if (!shouldOpen || dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate/75 p-4 backdrop-blur-sm">
      <section className="grid min-h-full place-items-center py-4" aria-labelledby="how-to-play-title">
        <div className="w-full max-w-xl bg-frame p-3 shadow-[0_12px_28px_rgb(0_0_0/0.45)]">
          <div className="relative bg-slate px-6 py-7 sm:px-10 sm:py-8" role="dialog" aria-modal="true">
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-3 font-sans text-3xl font-light leading-none text-chalk/75 hover:text-chalk"
              aria-label="Close how to play"
            >
              ×
            </button>

            <h2 id="how-to-play-title" className="font-chalk text-5xl font-bold leading-none text-chalk sm:text-6xl">
              How to play
            </h2>
            <div className="my-5 h-px bg-chalk/40" />

            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-brass font-sans text-sm text-gilt">1</span>
                <p className="font-chalk text-2xl font-bold leading-tight text-chalk">Guess any club playing in Europe&apos;s top five leagues: the Premier League, La Liga, Serie A, Ligue 1 or the Bundesliga.</p>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-brass font-sans text-sm text-gilt">2</span>
                <p className="font-chalk text-2xl font-bold leading-tight text-chalk">A dart lands on the map at the stadium of the club you guessed.</p>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-brass font-sans text-sm text-gilt">3</span>
                <p className="font-chalk text-2xl font-bold leading-tight text-chalk">A beer mat shows how far that stadium is from the mystery club.</p>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-brass font-sans text-sm text-gilt">4</span>
                <p className="font-chalk text-2xl font-bold leading-tight text-chalk">The closer you get, the redder your darts and mats. Find the mystery club to win. Enjoy!</p>
              </li>
            </ol>

            <div className="mt-6 border border-dashed border-chalk/40 p-4 sm:p-5">
              <h3 className="font-chalk text-3xl font-bold leading-none text-chalk">Colour guide</h3>
              <ul className="mt-3 space-y-2">
                {guide.map((item) => (
                  <li className="flex items-center gap-3" key={item.title}>
                    <span aria-hidden="true" className={`size-3 shrink-0 rounded-full border border-ink ${item.dot}`} />
                    <p className="font-chalk text-lg font-bold leading-none">
                      <span className={item.colour}>{item.title}</span>
                      <span className="ml-2 text-base text-chalk/80">{item.detail}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={dismiss}
              className="ml-auto mt-5 block rounded-sm border-2 border-brass bg-oxblood px-6 py-2 font-display text-lg font-bold text-cream hover:bg-oxblood/85"
            >
              Let&apos;s play
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
