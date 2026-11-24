
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verificarSessao } from "@/lib/session";

export async function GET() {

    try {

        // ======================================
        // VERIFICAR SESSÃO DO USUÁRIO
        // ======================================

        const cookieStore = await cookies();

        const token = cookieStore.get("session")?.value;

        const sessao = verificarSessao(token);

        if (!sessao) {

            return NextResponse.json(
                { erro: "Usuário não autenticado." },
                { status: 401 }
            );

        }

        // ======================================
        // CONEXÃO COM O BACKEND
        // ======================================

        const backend = (
            process.env.BACKEND_URL ||
            "http://127.0.0.1:3001"
        ).replace(/\/+$/, "");

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

        if (!response.ok) {

            console.error(
                "Erro retornado pelo backend:",
                response.status
            );

            return NextResponse.json(
                {
                    erro: "Não foi possível carregar os conteúdos."
                },
                {
                    status: response.status
                }
            );

        }

        // ======================================
        // RECEBER OS DADOS
        // ======================================

        const data = await response.json();

        if (!Array.isArray(data)) {

            throw new Error(
                "Formato de conteúdos inválido."
            );

        }

        // ======================================
        // REMOVER TODOS OS LINKS DE VÍDEOS
        // ======================================

        const videosSemLinks = data.map(video => ({

            id: video.id,

            titulo: video.titulo,

            categoria: video.categoria ?? "Lifestyle",

            descricao: video.descricao ?? ""

        }));

        // ======================================
        // RETORNAR SOMENTE INFORMAÇÕES SEGURAS
        // ======================================

        return NextResponse.json(
            videosSemLinks,
            {
                status: 200
            }
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar Lifestyle:",
            erro
        );

        return NextResponse.json(
            {
                erro: "Não foi possível carregar os conteúdos."
            },
            {
                status: 500
            }
        );

    }

}
