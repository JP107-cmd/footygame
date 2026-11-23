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
         <div className="flex flex-col gap-4 ">
            <div>
                <form 
                    onSubmit={() => intentRef.current = 'guess'} action={formAction} 
                    className="flex flex-col gap-4 w-7/12"
                >
                    <div className={`border-green-800 border-2 rounded-md flex flex-row gap-12 p-1 w-fit ${focused == true ? "ring-emerald-700/20 ring-4" : ""}`}>
                        <input 
                            name="guess" type="text" className="focus:outline-none" onChange={(e) => setInput(e.target.value)} autoComplete="off"
                            disabled={gameState === "gameOver" ? true : false} placeholder="Enter your guess here" onFocus={() => setFocus(true)}
                            onBlur={() => setFocus(false)}
                        />
                        <input 
                            className="bg-emerald-800 text-white font-bold px-1 py-1 rounded-md"
                            type="submit"
                            disabled={gameState === "gameOver" ? true : false}
                        />
                    </div>
                    <div className="grid grid-cols-1 absolute z-10 mt-12 max-h-64 overflow-y-auto rounded-xl border-gray-500 border">
                        { filteredClubs &&
                            filteredClubs.map((club, key) => (
                                <button type="submit" name="guess-button" key={key} value={club.name} 
                                className="bg-white border-gray-500 border" 
                                onClick={handleClick}>{club.name}</button>
                            ))
                        }
                    </div>
                </form>
                { gameState === "gameOver" &&
                    <div className="flex gap-4 bg-green-400 p-4 rounded-md">
                        <p className="text-white font-bold">You Won!</p>
                        <form 
                        onSubmit={() => intentRef.current = 'start-game'} action={formAction} 
                        className="flex flex-col items-center justify-center gap-4"
                        >
                            <input 
                            type="submit" value="Play Again" className="bg-green-500 hover:bg-green-700 
                            text-white font-bold py-2 px-4 rounded-md"
                            />
                        </form>
                    </div>
                }
            </div>
            { serverState?.error &&
            <p>{serverState.error}</p>
            }
        </div>
    )
}