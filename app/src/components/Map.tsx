"use client"
import { guessType } from "@/server/lib/actions"
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import('./ClientMap'), {
    ssr : false,
})

export default function Map({ guesses } : { guesses : Array<guessType | []>}) {
    return (
        <DynamicMap guesses={guesses}/>
    )
}