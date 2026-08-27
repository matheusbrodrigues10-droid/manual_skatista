import { NextResponse } from "next/server";

const crypto = require("crypto");

const SECRET = process.env.AUTH_SECRET;

function assinar(valor) {
    return crypto
        .createHmac("sha256", SECRET)
        .update(valor)
        .digest("base64url");
}

function verificarSessao(token) {
    try {
        if (!token) {
            return false;
        }

        const partes = token.split(".");

        if (partes.length !== 2) {
            return false;
        }

        const [payload, assinatura] = partes;

        const assinaturaEsperada = assinar(payload);

        if (
            assinatura.length !==
            assinaturaEsperada.length
        ) {
            return false;
        }

        const valido = crypto.timingSafeEqual(
            Buffer.from(assinatura),
            Buffer.from(assinaturaEsperada)
        );

        if (!valido) {
            return false;
        }

        const dados = JSON.parse(
            Buffer.from(payload, "base64url").toString("utf8")
        );

        return Date.now() < dados.exp;

    } catch {
        return false;
    }
}

export function proxy(request) {
    const token = request.cookies.get("session")?.value;

    const logado = verificarSessao(token);

    if (!logado) {
        const loginUrl = new URL(
            "/login",
            request.url
        );

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