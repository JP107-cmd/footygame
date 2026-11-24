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
            ? "#22c55e"
            : distance < 25 ? '#ef533c' : distance < 100 ? '#ff8440' : distance < 250 ? '#ffbd3e' : distance < 500 ? '#a8dc4d' : distance < 900 ? '#38b9eb' : '#2459c8';

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
        <div className="h-full">
            <MapContainer center={defaultPosition} zoom={5} className="h-full">
                <TileLayer
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                url='https://basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png?key=cb1_5fd8_1_08377ff2c882362f6d884456'
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
