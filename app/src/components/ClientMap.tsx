"use client"
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { guessType } from "@/server/lib/actions";
import L from "leaflet";

const dartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
  <ellipse cx="5" cy="59" rx="5" ry="2" fill="rgba(0,0,0,0.3)"/>
  <line x1="4" y1="60" x2="15" y2="49" stroke="#9AA0A6" stroke-width="2" stroke-linecap="round"/>
  <line x1="15" y1="49" x2="29" y2="35" stroke="#B98A2E" stroke-width="6" stroke-linecap="round"/>
  <line x1="17" y1="47" x2="27" y2="37" stroke="#E2BE62" stroke-width="1.5" stroke-dasharray="2 2"/>
  <line x1="29" y1="35" x2="44" y2="20" stroke="#2B1A10" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M42 22 L50 6 L58 4 L48 24 Z" fill="currentColor" stroke="#2B1A10" stroke-width="1"/>
  <path d="M42 22 L58 14 L60 6 L40 16 Z" fill="currentColor" stroke="#2B1A10" stroke-width="1" opacity="0.85"/>
</svg>`;

const abbreviation = (name: string | null) => {
    return (name ?? "Club")
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 3)
        .toUpperCase();
};

export default function ClientMap({ guesses } : { guesses : Array<guessType | []>}) {
    const defaultPosition : [number, number] = [46.858806, 3.185694]; // Center of France (Can see most of Western Europe with this)
    // starting position

    const dartColour = (distance: number, answer: boolean | null) => {
        return answer
            ? "#1F4D36"
            : distance < 200 ? "#E4572E"
            : distance < 500 ? "#F2A541"
            : distance < 1000 ? "#5DA9E9"
            : "#1F4E8C";
    };

    const icon = (distance: number, answer: boolean | null) => {
        const colour = dartColour(distance, answer);

        return L.divIcon({
            className: "custom-dart",
            iconSize: [64, 64],
            iconAnchor: [4, 60],
            popupAnchor: [28, -45],
            html: `<span class="dart-marker" style="color:${colour}">${dartSvg}</span>`
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
                            <div className="dart-popup">
                                <div className="dart-popup__summary">
                                    <span className="dart-popup__dot" style={{ backgroundColor: dartColour(guess.distance, guess.answer) }}/>
                                    <strong>{abbreviation(guess.name)}</strong>
                                    <span>{guess.distance.toLocaleString("en-CA")} km</span>
                                </div>
                                {guess.stadium && <p className="dart-popup__stadium">{guess.stadium}</p>}
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
