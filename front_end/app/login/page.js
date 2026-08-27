"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function fazerLogin(event) {
        event.preventDefault();

        setErro("");
        setCarregando(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    senha
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setErro(data.erro || "Credenciais inválidas");
                return;
            }

            const redirect =
                searchParams.get("redirect") || "/";

            window.dispatchEvent(
    new Event("usuarioLogou")
);

router.push(redirect);
router.refresh();

        } catch (error) {
            setErro("Erro de conexão com o servidor.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="form-container">

            <h2>🛹 Entrar</h2>

            <p className="form-subtitle">
                Acesse sua conta
            </p>

            {erro && (
                <p style={{
                    color: "var(--red)",
                    marginBottom: "1rem"
                }}>
                    ❌ {erro}
                </p>
            )}

            <form onSubmit={fazerLogin}>

                <div className="form-group">
                    <label>E-mail</label>

                    <input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Senha</label>

                    <input
                        type="password"
                        placeholder="••••••••"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn"
                    disabled={carregando}
                >
                    {carregando ? "Entrando..." : "Entrar"}
                </button>

            </form>

            <div className="link-text">
                Não tem conta?{" "}
                <Link href="/cadastro">
                    Criar conta grátis
                </Link>
            </div>

            <Link
                href="/"
                className="btn btn-voltar"
            >
                ← Voltar
            </Link>

        </div>
    );
}