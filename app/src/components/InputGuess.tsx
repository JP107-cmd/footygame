"use client"
import { actionHandler, gameState } from "@/server/lib/actions"
import { useEffect, useState, useActionState, useRef} from "react"
import { clubs, clubType } from "@/server/lib/clubs";

export default function InputGuess({ gameState } : { gameState : gameState }) {
    const [input, setInput] = useState("");
    const [filteredClubs, setFilteredClubs] = useState<Array<clubType>>([]);
    const [focused, setFocus] = useState<boolean>(false);
    const intentRef = useRef<string>("");
    const [serverState, formAction] = useActionState(
        async(_: unknown, formData: FormData) => {
            const boundedAction = actionHandler.bind(null, intentRef.current);
            return await boundedAction(null, formData);
        }, null);
 

    useEffect(() => {
        if (input === "") { 
            setFilteredClubs([]);
        } else {
            setFilteredClubs(clubs.filter((club) => club.name.toLowerCase().includes(input.toLowerCase())));
        }
    }, [input])

    function handleClick() {
        setInput("");
    }

    return (
         <div className="border-b border-black/30 px-3 py-4 sm:px-5">
            <div className="grid w-full grid-cols-1 gap-3">
                <p className="text-sm font-bold text-cream">Your guess</p>
                <form 
                    onSubmit={() => intentRef.current = 'guess'} action={formAction} 
                    className="relative flex w-full min-w-0 items-stretch gap-2"
                >
                    <input
                        name="guess" type="text" className="min-w-0 flex-1 rounded-sm border-2 border-brass bg-paper px-3 py-2 text-ink placeholder:text-ink-soft/70 focus:outline-none" onChange={(e) => setInput(e.target.value)} autoComplete="off"
                        disabled={gameState === "gameOver" ? true : false} placeholder="Type a club..." onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                    />
                    <input
                        className={`${gameState !== "gameOver" ? "bg-oxblood hover:bg-oxblood/85" : "bg-oxblood/50"} shrink-0 rounded-sm border-2 border-brass px-3 py-2 font-display font-bold text-cream sm:px-6`}
                        type="submit"
                        value="Guess"
                        disabled={gameState === "gameOver" ? true : false}
                    />
                    <div className="absolute top-full z-10 mt-1 grid w-full grid-cols-1 max-h-64 overflow-y-auto rounded-md border border-frame bg-paper shadow-lg">
                        { filteredClubs &&
                            filteredClubs.map((club, key) => (
                                <button type="submit" name="guess-button" key={key} value={club.name} 
                                className="border-b border-frame/30 bg-paper px-3 py-2 text-left text-ink hover:bg-cream"
                                onClick={handleClick}>{club.name}</button>
                            ))
                        }
                    </div>
                </form>
                { gameState === "gameOver" &&
                    <section className="rounded-m bg-frame p-2 shadow-[0_6px_12px_rgb(0_0_0/0.3)]">
                        <div className="flex min-h-24 flex-col items-start justify-center gap-4 bg-slate px-4 py-5 sm:px-6">
                            <p className="font-chalk text-3xl font-bold leading-none text-chalk sm:text-4xl mx-auto">You found it!</p>
                            <form
                              onSubmit={() => intentRef.current = 'start-game'} action={formAction}
                              className="self-center"
                            >
                                <input
                                  type="submit" value="Play again" className="rounded-sm border-2 border-brass bg-oxblood px-5 py-3 font-display text-xl font-bold text-cream hover:bg-oxblood/85"
                                />
                            </form>
                        </div>
                    </section>
                }
            </div>
            { serverState?.error &&
            <p className="mt-2 text-sm text-hot">{serverState.error}</p>
            }
        </div>
    )
}
