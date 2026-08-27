"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const router = useRouter();

    async function carregarUsuario() {
        try {
            const response = await fetch("/api/auth/me", {
                cache: "no-store"
            });

            if (response.ok) {
                const data = await response.json();
                setUsuario(data.usuario);
            } else {
                setUsuario(null);
            }
        } catch (error) {
            console.error("Erro ao verificar usuário:", error);
            setUsuario(null);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarUsuario();

        const handleLogin = () => {
            carregarUsuario();
        };

        window.addEventListener("usuarioLogou", handleLogin);

        return () => {
            window.removeEventListener(
                "usuarioLogou",
                handleLogin
            );
        };
    }, []);

    async function logout() {
        try {
            await fetch("/api/auth/logout", {
                method: "POST"
            });

            setUsuario(null);

            router.push("/");
            router.refresh();

        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    }

    if (carregando) {
        return (
            <header className="header">
                <nav className="nav-container">

                    <Link href="/" className="logo">
                        🛹 Manual do Skatista
                    </Link>

                    <div className="nav-menu">
                        <Link href="/">
                            Início
                        </Link>

                        <Link href="/sobre">
                            Sobre
                        </Link>
                    </div>

                </nav>
            </header>
        );
    }

    return (
        <header className="header">
            <nav className="nav-container">

                <Link href="/" className="logo">
                    🛹 Manual do Skatista
                </Link>

                <div className="nav-menu">

                    <Link href="/">
                        Início
                    </Link>

                    <Link href="/sobre">
                        Sobre
                    </Link>

                    {usuario ? (
                        <>
                            <span className="user-name">
                                👤 {usuario.nome}
                            </span>

                            <button
                                className="btn-sair"
                                onClick={logout}
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="btn-entrar"
                        >
                            Entrar
                        </Link>
                    )}

                </div>

            </nav>
        </header>
    );
}