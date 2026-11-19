
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verificarSessao } from "@/lib/session";

export async function GET() {
    try {
        const cookieStore = await cookies();

        const token = cookieStore.get("session")?.value;

        const sessao = verificarSessao(token);

        if (!sessao) {
            return NextResponse.json(
                { erro: "Usuário não autenticado." },
                { status: 401 }
            );
        }

        const backend =
            process.env.BACKEND_URL ||
            "http://127.0.0.1:3001";

        const apiToken =
            process.env.PROGRESSO_API_TOKEN;

        if (!apiToken) {
            throw new Error(
                "PROGRESSO_API_TOKEN não configurado."
            );
        }

        const response = await fetch(
            `${backend}/videos-lifestyle`,
            {
                headers: {
                    "x-progresso-token": apiToken
                },
                cache: "no-store"
            }
        );

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status
        });

    } catch (erro) {
        console.error(
            "Erro ao carregar Lifestyle:",
            erro
        );

        return NextResponse.json(
            { erro: "Não foi possível carregar os vídeos." },
            { status: 500 }
        );
    }
}
