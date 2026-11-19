
import { NextResponse } from "next/server";
import { verificarSessao } from "@/lib/session";

const BACKEND_URL =
    process.env.BACKEND_URL || "http://127.0.0.1:3001";

async function obterUsuarioId() {
    const sessao = await verificarSessao();

    const usuario =
        sessao?.usuario ||
        sessao?.user ||
        sessao?.data?.usuario ||
        sessao;

    const id = Number(
        usuario?.id ??
        usuario?.usuario_id ??
        usuario?.userId
    );

    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

function obterCabecalhos() {
    return {
        "Content-Type": "application/json",
        "x-progresso-token": process.env.PROGRESSO_API_TOKEN
    };
}

// CONSULTAR PROGRESSO
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
                headers: obterCabecalhos(),
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
            { erro: "Erro ao consultar progresso." },
            { status: 500 }
        );
    }
}

// REGISTRAR CONTEÚDO ACESSADO
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
        console.error(erro);

        return NextResponse.json(
            { erro: "Erro ao registrar progresso." },
            { status: 500 }
        );
    }
}
