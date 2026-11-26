"use client"
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { guessType } from "@/server/lib/actions";
import L from "leaflet";

export default function ClientMap({ guesses } : { guesses : Array<guessType | []>}) {
    const defaultPosition : [number, number] = [46.858806, 3.185694]; // Center of France (Can see most of Western Europe with this)
    // starting position

    const icon = (distance: number, answer: boolean | null) => {
        const closeness = Math.max(0, 1 - distance / 2264);
        const colour = answer
            ? "#1F4D36"
            : distance < 25 ? '#E4572E' : distance < 100 ? '#E4572E' : distance < 250 ? '#F2A541' : distance < 500 ? '#F2A541' : distance < 900 ? '#5DA9E9' : '#1F4E8C';

        return L.divIcon({
            className: "custom-pin",
            iconSize: [28, 40],
            iconAnchor: [14, 40],
            popupAnchor: [0, -40],
            html: `<svg viewBox="0 0 28 40" width="28" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 1C6.82 1 1 6.82 1 14c0 9.75 13 25 13 25s13-15.25 13-25C27 6.82 21.18 1 14 1Z" fill="${colour}" stroke="white" stroke-width="2"/>
                <circle cx="14" cy="14" r="5" fill="white"/>
            </svg>`
        });
    };

    return (
        <div className="relative h-full min-h-0 rotate-[-0.75deg] overflow-visible rounded-md border-4 bg-paper p shadow-[0_6px_16px_rgb(0_0_0/0.3)]">
            <MapContainer center={defaultPosition} zoom={4} className="relative z-0 h-full border-2 border-[#B59661]">
                <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url='https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg'
                minZoom={3}
                maxZoom={10}
                />
                { guesses?.map((guess : any) =>
                    <Marker 
                    position={[guess.latitude, guess.longitude]} key={guess.name} icon={icon(guess.distance, guess.answer)}
                    >
                        <Popup>
                            <div className="flex flex-col gap-2">
                                <p className="font-bold">{guess.stadium}</p>
                                <p>{guess.name}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
            <span aria-hidden="true" className="pointer-events-none absolute -left-2 -top-2 z-10 size-4 rounded-full border border-[#9D7732] bg-brass shadow-[inset_2px_2px_2px_rgb(255_255_255/0.55),1px_2px_3px_rgb(0_0_0/0.35)]" />
            <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-2 z-10 size-4 rounded-full border border-[#9D7732] bg-brass shadow-[inset_2px_2px_2px_rgb(255_255_255/0.55),1px_2px_3px_rgb(0_0_0/0.35)]" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-2 -left-2 z-10 size-4 rounded-full border border-[#9D7732] bg-brass shadow-[inset_2px_2px_2px_rgb(255_255_255/0.55),1px_2px_3px_rgb(0_0_0/0.35)]" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-2 -right-2 z-10 size-4 rounded-full border border-[#9D7732] bg-brass shadow-[inset_2px_2px_2px_rgb(255_255_255/0.55),1px_2px_3px_rgb(0_0_0/0.35)]" />
        </div>
    );
}
