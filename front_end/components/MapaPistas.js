"use client";

import { useEffect, useRef } from "react";

export default function MapaPistas({
    origem,
    pista,
    rota
}) {
    const mapaRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        let cancelado = false;

        async function criarMapa() {
            if (
                !containerRef.current ||
                mapaRef.current
            ) {
                return;
            }

            const L = await import("leaflet");
            await import("leaflet/dist/leaflet.css");

            if (cancelado) {
                return;
            }

            // Evita inicializar o mesmo container duas vezes
            if (
                containerRef.current._leaflet_id
            ) {
                containerRef.current._leaflet_id = null;
            }

            if (mapaRef.current) {
                return;
            }

            const mapa = L.map(
                containerRef.current
            ).setView(
                [
                    origem?.latitude ?? -22.11,
                    origem?.longitude ?? -51.40
                ],
                13
            );

            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution:
                        "&copy; OpenStreetMap contributors"
                }
            ).addTo(mapa);

            mapaRef.current = mapa;
        }

        criarMapa();

        return () => {
            cancelado = true;

            if (mapaRef.current) {
                mapaRef.current.remove();
                mapaRef.current = null;
            }

            if (
                containerRef.current
            ) {
                containerRef.current._leaflet_id = null;
            }
        };
    }, []);

    useEffect(() => {
        if (
            !mapaRef.current ||
            !origem
        ) {
            return;
        }

        atualizarMapa();

    }, [origem, pista, rota]);

    async function atualizarMapa() {

        const mapa =
            mapaRef.current;

        if (!mapa) {
            return;
        }

        const L =
            await import("leaflet");

        // Remove marcadores e rotas anteriores
        mapa.eachLayer((layer) => {

            if (
                !layer._url
            ) {
                mapa.removeLayer(layer);
            }

        });

        // Recoloca o mapa base
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(mapa);

        // ----------------------------------
        // ORIGEM
        // ----------------------------------

        const origemPoint = [
            Number(origem.latitude),
            Number(origem.longitude)
        ];

        L.marker(origemPoint)
            .addTo(mapa)
            .bindPopup(
                "📍 Sua localização"
            );

        // ----------------------------------
        // DESTINO
        // ----------------------------------

        if (!pista) {
            mapa.setView(
                origemPoint,
                13
            );

            return;
        }

        const pistaPoint = [
            Number(pista.latitude),
            Number(pista.longitude)
        ];

        L.marker(pistaPoint)
            .addTo(mapa)
            .bindPopup(
                `🛹 ${pista.nome}`
            );

        // ----------------------------------
        // ROTA
        // ----------------------------------

        if (
            rota &&
            rota.geometry &&
            rota.geometry.coordinates
        ) {

            const pontos =
                rota.geometry.coordinates.map(
                    ([lng, lat]) => [
                        Number(lat),
                        Number(lng)
                    ]
                );

            const linha =
                L.polyline(
                    pontos,
                    {
                        weight: 5
                    }
                ).addTo(mapa);

            mapa.fitBounds(
                linha.getBounds(),
                {
                    padding: [
                        40,
                        40
                    ]
                }
            );

        } else {

            mapa.fitBounds(
                [
                    origemPoint,
                    pistaPoint
                ],
                {
                    padding: [
                        40,
                        40
                    ]
                }
            );
        }
    }

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "420px",
                borderRadius:
                    "var(--radius-md)",
                overflow: "hidden"
            }}
        />
    );
}