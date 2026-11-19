
import { NextResponse } from "next/server";
import { verificarSessao } from "@/lib/session";

export function proxy(request) {
    const token = request.cookies.get("session")?.value;

    // Utiliza a mesma validação do login
    const usuario = verificarSessao(token);

    if (!usuario) {
        const loginUrl = new URL("/login", request.url);

        loginUrl.searchParams.set(
            "redirect",
            request.nextUrl.pathname
        );

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/manobras/:path*",
        "/montagem/:path*",
        "/pistas/:path*",
        "/equipamentos/:path*",
        "/roupas/:path*",
        "/videos/:path*"
    ]
};
