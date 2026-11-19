
import { NextResponse } from "next/server";
import { verificarSessao } from "@/lib/session";

export async function GET() {
    try {
        const sessao = await verificarSessao();

        if (!sessao) {
            return NextResponse.json(
                { erro: "Usuário não autenticado." },
                { status: 401 }
            );
        }

        const backend =
            process.env.BACKEND_URL || "http://127.0.0.1:3001";

        const response = await fetch(
            `${backend}/videos-lifestyle`,
            {
                headers: {
                    "x-progresso-token":
                        process.env.PROGRESSO_API_TOKEN
                },
                cache: "no-store"
            }
        );

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status
        });

    } catch (erro) {
        console.error(erro);

        return NextResponse.json(
            { erro: "Erro ao carregar vídeos." },
            { status: 500 }
        );
    }
}
