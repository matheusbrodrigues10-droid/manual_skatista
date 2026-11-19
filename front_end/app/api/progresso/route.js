
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verificarSessao } from "@/lib/session";

const BACKEND_URL =
    process.env.BACKEND_URL || "http://127.0.0.1:3001";

async function obterUsuarioId() {
    const cookieStore = await cookies();

    const token = cookieStore.get("session")?.value;

    const sessao = verificarSessao(token);

    if (!sessao) {
        return null;
    }

    const id = Number(sessao.id);

    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

function obterCabecalhos() {
    const token = process.env.PROGRESSO_API_TOKEN;

    if (!token) {
        throw new Error(
            "PROGRESSO_API_TOKEN não está configurado."
        );
    }

    return {
        "Content-Type": "application/json",
        "x-progresso-token": token
    };
}

// =====================================================
// CONSULTAR PROGRESSO
// =====================================================

export async function GET() {
    try {
        const usuarioId = await obterUsuarioId();

        if (!usuarioId) {
            return NextResponse.json(
                { erro: "Usuário não autenticado." },
                { status: 401 }
            );
        }

        const response = await fetch(
            `${BACKEND_URL}/progresso/${usuarioId}`,
            {
                method: "GET",
                headers: obterCabecalhos(),
                cache: "no-store"
            }
        );

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status
        });

    } catch (erro) {
        console.error(
            "Erro ao consultar progresso:",
            erro
        );

        return NextResponse.json(
            {
                erro: "Não foi possível consultar o progresso.",
                detalhe: erro.message
            },
            { status: 500 }
        );
    }
}

// =====================================================
// REGISTRAR VÍDEO ACESSADO
// =====================================================

export async function POST(request) {
    try {
        const usuarioId = await obterUsuarioId();

        if (!usuarioId) {
            return NextResponse.json(
                { erro: "Usuário não autenticado." },
                { status: 401 }
            );
        }

        const body = await request.json();

        const response = await fetch(
            `${BACKEND_URL}/progresso/${usuarioId}/concluir`,
            {
                method: "POST",
                headers: obterCabecalhos(),
                body: JSON.stringify(body),
                cache: "no-store"
            }
        );

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status
        });

    } catch (erro) {
        console.error(
            "Erro ao registrar progresso:",
            erro
        );

        return NextResponse.json(
            {
                erro: "Não foi possível registrar o progresso.",
                detalhe: erro.message
            },
            { status: 500 }
        );
    }
}
