import { NextResponse } from "next/server";

export async function GET(request) {
    try {

        const { searchParams } =
            new URL(request.url);

        const origemLat =
            searchParams.get("origemLat");

        const origemLng =
            searchParams.get("origemLng");

        const destinoLat =
            searchParams.get("destinoLat");

        const destinoLng =
            searchParams.get("destinoLng");

        if (
            !origemLat ||
            !origemLng ||
            !destinoLat ||
            !destinoLng
        ) {
            return NextResponse.json(
                {
                    erro:
                        "Coordenadas incompletas."
                },
                {
                    status: 400
                }
            );
        }

        const url =
            `${process.env.BACKEND_URL}/pistas/rota?` +
            new URLSearchParams({
                origemLat,
                origemLng,
                destinoLat,
                destinoLng
            });

        console.log(
            "Chamando backend:",
            url
        );

        const response =
            await fetch(
                url,
                {
                    cache: "no-store"
                }
            );

        const data =
            await response.json();

        console.log(
            "Resposta da rota:",
            data
        );

        return NextResponse.json(
            data,
            {
                status: response.status
            }
        );

    } catch (error) {

        console.error(
            "ERRO API ROTA:",
            error
        );

        return NextResponse.json(
            {
                erro:
                    "Erro ao calcular a rota.",
                detalhe:
                    error.message
            },
            {
                status: 500
            }
        );
    }
}