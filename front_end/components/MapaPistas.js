"use client";

import { useEffect, useRef } from "react";

export default function MapaPistas({
    origem,
    pista,
    rota
}) {
    const mapaRef =
        useRef(null);

    const mapaContainerRef =
        useRef(null);

    useEffect(() => {

        let mapa;

        async function iniciar() {

            if (
                !mapaContainerRef.current ||
                mapaRef.current
            ) {
                return;
            }

            const L =
                await import("leaflet");

            await import(
                "leaflet/dist/leaflet.css"
            );

            mapa =
                L.map(
                    mapaContainerRef.current
                ).setView(
                    [
                        origem?.latitude ||
                            -22.11,

                        origem?.longitude ||
                            -51.40
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

            mapaRef.current =
                mapa;
        }

        iniciar();

        return () => {

            if (mapa) {
                mapa.remove();
            }

            mapaRef.current =
                null;
        };

    }, []);

    useEffect(() => {

        if (
            !mapaRef.current ||
            !origem
        ) {
            return;
        }

        desenharMapa();

    }, [
        origem,
        pista,
        rota
    ]);

    async function desenharMapa() {

        const L =
            await import("leaflet");

        const mapa =
            mapaRef.current;

        mapa.eachLayer(
            (layer) => {

                if (
                    !layer._url
                ) {
                    mapa.removeLayer(
                        layer
                    );
                }

            }
        );

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(mapa);


        // -------------------------------------
        // MARCADOR DA ORIGEM
        // -------------------------------------

        const origemPoint = [
            origem.latitude,
            origem.longitude
        ];

        L.marker(
            origemPoint
        )
            .addTo(mapa)
            .bindPopup(
                "📍 Sua localização"
            );


        // -------------------------------------
        // MARCADOR DA PISTA
        // -------------------------------------

        if (pista) {

            const pistaPoint = [
                pista.latitude,
                pista.longitude
            ];

            L.marker(
                pistaPoint
            )
                .addTo(mapa)
                .bindPopup(
                    `🛹 ${pista.nome}`
                );


            // ---------------------------------
            // LINHA DA ROTA
            // ---------------------------------

            if (
                rota?.geometry?.coordinates
            ) {

                const pontos =
                    rota.geometry.coordinates.map(
                        (coordenada) => [

                            coordenada[1],
                            coordenada[0]

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

        } else {

            mapa.setView(
                origemPoint,
                13
            );
        }
    }

    return (
        <div
            ref={mapaContainerRef}
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