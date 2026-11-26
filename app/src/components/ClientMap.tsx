"use client"
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { guessType } from "@/server/lib/actions";
import L from "leaflet";

export default function ClientMap({ guesses } : { guesses : Array<guessType | []>}) {
    const defaultPosition : [number, number] = [46.858806, 3.185694]; // Center of France (Can see most of Western Europe with this)
    // starting position

    const icon = (distance: number, answer: boolean | null) => {
        // I used AI for this don't be mad
        // The max distance (most blue icon) is set at 2264km as
        // That is the farthest distance between 2 top 5 league clubs
        // (Real Betis and Union Berlin)
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
        <div className="h-full min-h-80 overflow-hidden rounded-md border-4 border-frame bg-paper p-2 shadow-[0_6px_16px_rgb(0_0_0/0.3)]">
            <MapContainer center={defaultPosition} zoom={4} className="h-full">
                <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url='https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg'
                minZoom={4}
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
        </div>
    );
}
