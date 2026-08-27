import crypto from "crypto";

const SECRET =
    process.env.AUTH_SECRET ||
    "manual_skatista_chave_secreta";

function assinar(valor) {
    return crypto
        .createHmac("sha256", SECRET)
        .update(valor)
        .digest("base64url");
}

export function criarSessao(usuario) {
    const dados = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        exp:
            Date.now() +
            1000 * 60 * 60 * 24 * 7
    };

    const payload =
        Buffer
            .from(
                JSON.stringify(dados)
            )
            .toString("base64url");

    const assinatura =
        assinar(payload);

    return `${payload}.${assinatura}`;
}

export function verificarSessao(token) {
    try {
        if (!token) {
            return null;
        }

        const partes =
            token.split(".");

        if (partes.length !== 2) {
            return null;
        }

        const [
            payload,
            assinatura
        ] = partes;

        const assinaturaEsperada =
            assinar(payload);

        if (
            assinatura.length !==
            assinaturaEsperada.length
        ) {
            return null;
        }

        const valido =
            crypto.timingSafeEqual(
                Buffer.from(
                    assinatura
                ),
                Buffer.from(
                    assinaturaEsperada
                )
            );

        if (!valido) {
            return null;
        }

        const dados =
            JSON.parse(
                Buffer
                    .from(
                        payload,
                        "base64url"
                    )
                    .toString("utf8")
            );

        if (Date.now() > dados.exp) {
            return null;
        }

        return dados;

    } catch (error) {
        console.error(
            "Erro ao validar sessão:",
            error
        );

        return null;
    }
}