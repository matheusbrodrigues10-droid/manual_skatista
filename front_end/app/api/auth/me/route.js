import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verificarSessao } from "@/lib/session";

export async function GET() {
    try {
        const cookieStore = await cookies();

        const token =
            cookieStore.get("session")?.value;

        console.log("Cookie recebido:", token);

        if (!token) {
            return NextResponse.json(
                {
                    autenticado: false,
                    usuario: null
                },
                {
                    status: 401
                }
            );
        }

        const usuario =
            verificarSessao(token);

        console.log(
            "Usuário da sessão:",
            usuario
        );

        if (!usuario) {
            return NextResponse.json(
                {
                    autenticado: false,
                    usuario: null
                },
                {
                    status: 401
                }
            );
        }

        return NextResponse.json({
            autenticado: true,
            usuario
        });

    } catch (error) {
        console.error(
            "Erro ao verificar sessão:",
            error
        );

        return NextResponse.json(
            {
                autenticado: false,
                usuario: null
            },
            {
                status: 401
            }
        );
    }
}