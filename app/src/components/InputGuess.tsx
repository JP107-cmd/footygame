"use client"
import { actionHandler, gameState } from "@/server/lib/actions"
import { useEffect, useState, useActionState, useRef} from "react"
import { clubs, clubType } from "@/server/lib/clubs";

export default function InputGuess({ gameState } : { gameState : gameState }) {
    const [input, setInput] = useState("");
    const [filteredClubs, setFilteredClubs] = useState<Array<clubType>>([]);
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
         <div>
            <div>
                <form 
                    onSubmit={() => intentRef.current = 'guess'} action={formAction} 
                    className="flex flex-row items-center justify-center gap-4"
                >
                    <input 
                        name="guess" type="text" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" onChange={(e) => setInput(e.target.value)} autoComplete="off"
                        disabled={gameState === "gameOver" ? true : false}
                    />
                    <input 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-blue-300"
                        disabled={gameState === "gameOver" ? true : false}
                    />
                    <div className="grid grid-cols-1">
                        { filteredClubs &&
                            filteredClubs.map((club, key) => (
                                <button type="submit" name="guess-button" key={key} value={club.name} className="z-10 bg-amber-200" onClick={handleClick}>{club.name}</button>
                            ))
                        }
                    </div>
                </form>
                { gameState === "gameOver" &&
                    <div>
                        <p>You Won!</p>
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