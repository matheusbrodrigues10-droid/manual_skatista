import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } =
            new URL(request.url);

        const cep =
            searchParams.get("cep");

        if (!cep) {
            return NextResponse.json(
                {
                    erro: "Informe o CEP."
                },
                {
                    status: 400
                }
            );
        }

        const response =
            await fetch(
                `${process.env.BACKEND_URL}/pistas/proximas?cep=${encodeURIComponent(cep)}`,
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
            "Erro na API de pistas:",
            error
        );

        return NextResponse.json(
            {
                erro:
                    "Erro ao buscar pistas."
            },
            {
                status: 500
            }
        );
    }
}