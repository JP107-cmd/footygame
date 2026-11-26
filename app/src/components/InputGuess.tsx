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
         <div className="rounded-md border border-frame bg-wood px-5 py-4 shadow-lg">
            <div className="grid grid-cols-1 gap-4 w-7/12">
                <form 
                    onSubmit={() => intentRef.current = 'guess'} action={formAction} 
                    className="flex flex-col gap-4"
                >
                    <div className={`border-2 rounded-md flex flex-row gap-12 p-1 w-fit ${gameState !== "gameOver" ? "border-brass" : "border-brass/30"}`}>
                        <input 
                            name="guess" type="text" className="bg-paper px-2 py-1 text-ink placeholder:text-ink-soft/70 focus:outline-none" onChange={(e) => setInput(e.target.value)} autoComplete="off"
                            disabled={gameState === "gameOver" ? true : false} placeholder="Enter your guess here" onFocus={() => setFocus(true)}
                            onBlur={() => setFocus(false)}
                        />
                        <input 
                            className={`${gameState !== "gameOver" ? "bg-oxblood hover:bg-oxblood/85" : "bg-oxblood/50"} font-display text-cream font-bold px-3 py-1 rounded-sm`}
                            type="submit"
                            disabled={gameState === "gameOver" ? true : false}
                        />
                    </div>
                    <div className="grid grid-cols-1 absolute z-10 mt-12 max-h-64 overflow-y-auto rounded-md border border-frame bg-paper shadow-lg">
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
                    <div className="flex gap-4 bg-bottle p-4 rounded-md w-full">
                        <p className="font-chalk text-chalk font-bold">You Won!</p>
                        <form 
                        onSubmit={() => intentRef.current = 'start-game'} action={formAction} 
                        className="flex flex-col items-center justify-center gap-4"
                        >
                            <input 
                            type="submit" value="Play Again" className="bg-oxblood hover:bg-oxblood/85
                            font-display text-cream font-bold py-2 px-4 rounded-sm"
                            />
                        </form>
                    </div>
                }
            </div>
            { serverState?.error &&
            <p className="mt-2 text-sm text-hot">{serverState.error}</p>
            }
        </div>
    )
}
