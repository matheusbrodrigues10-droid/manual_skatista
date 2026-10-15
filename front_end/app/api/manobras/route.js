import { NextResponse } from "next/server";

export async function GET() {
    try {
        const baseUrl = process.env.BACKEND_URL;

        if (!baseUrl) {
            return NextResponse.json(
                {
                    erro: "BACKEND_URL não está configurado."
                },
                {
                    status: 500
                }
            );
        }

        const response = await fetch(
            `${baseUrl.replace(/\/$/, "")}/manobras`,
            {
                cache: "no-store"
            }
        );

        const texto = await response.text();

        let dados;

        try {
            dados = JSON.parse(texto);
        } catch {
            throw new Error(
                "O backend não retornou uma resposta JSON válida."
            );
        }

        return NextResponse.json(
            dados,
            {
                status: response.status
            }
        );

    } catch (error) {
        console.error(
            "Erro na API do Next para manobras:",
            error
        );

        return NextResponse.json(
            {
                erro: error.message ||
                    "Não foi possível carregar as manobras."
            },
            {
                status: 502
            }
        );
    }
}