import { NextResponse } from "next/server";
import { criarSessao } from "@/lib/session";

export async function POST(request) {
    try {
        const body = await request.json();

        const response = await fetch(
            `${process.env.BACKEND_URL}/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
                cache: "no-store"
            }
        );

        const data = await response.json();

        console.log("Resposta do backend:", data);

        if (!response.ok) {
            return NextResponse.json(
                data,
                {
                    status: response.status
                }
            );
        }

        const token = criarSessao(data);

        console.log("Sessão criada:", token);

        const resposta = NextResponse.json({
            ok: true,
            usuario: data
        });

        resposta.cookies.set(
            "session",
            token,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7,
                path: "/"
            }
        );

        return resposta;

    } catch (error) {
        console.error(
            "Erro no login:",
            error
        );

        return NextResponse.json(
            {
                erro: "Erro ao realizar login.",
                detalhe: error.message
            },
            {
                status: 500
            }
        );
    }
}