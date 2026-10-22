"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [saindo, setSaindo] = useState(false);

    const router = useRouter();

    async function carregarUsuario() {
        try {
            const response = await fetch("/api/auth/me", {
                cache: "no-store"
            });

            if (response.ok) {
                const data = await response.json();
                setUsuario(data.usuario ?? null);
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

        function handleLogin() {
            carregarUsuario();
        }

        window.addEventListener("usuarioLogou", handleLogin);

        return () => {
            window.removeEventListener(
                "usuarioLogou",
                handleLogin
            );
        };
    }, []);

    async function logout() {
        if (saindo) return;

        setSaindo(true);

        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Não foi possível encerrar a sessão.");
            }

            // Atualiza a interface após o logout
            setUsuario(null);

            // Avisa outras partes da aplicação
            window.dispatchEvent(new Event("usuarioDeslogou"));

            // Retorna à página inicial
            router.replace("/");
            router.refresh();

        } catch (error) {
            console.error("Erro ao sair da conta:", error);

            alert(
                "Não foi possível sair da conta. Tente novamente."
            );
        } finally {
            setSaindo(false);
        }
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

                    {!carregando && (
                        usuario ? (
                            <>
                                <span className="user-name">
                                    BEM-VINDO, {usuario.nome}
                                </span>

                                <button
                                    type="button"
                                    className="btn-sair"
                                    onClick={logout}
                                    disabled={saindo}
                                >
                                    {saindo ? "Saindo..." : "Sair"}
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="btn-entrar"
                            >
                                Entrar
                            </Link>
                        )
                    )}

                </div>

            </nav>
        </header>
    );
}