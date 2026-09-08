import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } =
            new URL(request.url);

        const params =
            searchParams.toString();

        const response =
            await fetch(
                `${process.env.BACKEND_URL}/pistas/rota?${params}`,
                {
                    cache: "no-store"
                }
            );

        const data =
            await response.json();

        return NextResponse.json(
            data,
            {
                status: response.status
            }
        );

    } catch (error) {
        console.error(
            "Erro na API de rota:",
            error
        );

        return NextResponse.json(
            {
                erro:
                    "Erro ao calcular a rota."
            },
            {
                status: 500
            }
        );
    }
}