import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch(
            `${process.env.BACKEND_URL}/opcoes-cadastro`,
            {
                cache: "no-store"
            }
        );

        const data = await response.json();

        return NextResponse.json(
            data,
            {
                status: response.status
            }
        );

    } catch {
        return NextResponse.json(
            {
                erro: "Erro ao acessar o backend."
            },
            {
                status: 500
            }
        );
    }
}