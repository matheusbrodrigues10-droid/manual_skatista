import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verificarSessao } from "@/lib/session";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;
        const usuario = verificarSessao(token);

        if (!usuario) {
            return NextResponse.json(
                {
                    erro: "Faça login para acessar as roupas."
                },
                { status: 401 }
            );
        }

        const baseUrl = process.env.BACKEND_URL;

        if (!baseUrl) {
            return NextResponse.json(
                {
                    erro: "BACKEND_URL não está configurado."
                },
                { status: 500 }
            );
        }

        const response = await fetch(
            `${baseUrl.replace(/\/$/, "")}/roupas`,
            { cache: "no-store" }
        );

        const texto = await response.text();

        let dados;

        try {
            dados = JSON.parse(texto);
        } catch {
            throw new Error(
                "O backend não retornou JSON válido."
            );
        }

        return NextResponse.json(
            dados,
            { status: response.status }
        );

    } catch (error) {
        console.error(
            "Erro na API de roupas:",
            error
        );

        return NextResponse.json(
            {
                erro: error.message ||
                    "Não foi possível carregar as roupas."
            },
            { status: 502 }
        );
    }
}