"use client";

import { useEffect, useState } from "react";
import Home from "../components/Home";

export default function Page() {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function verificarLogin() {
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
                console.error("Erro ao verificar login:", error);
                setUsuario(null);
            } finally {
                setCarregando(false);
            }
        }

        verificarLogin();
    }, []);

    if (carregando) {
        return null;
    }

    return <Home
    usuario={usuario}
    onLogout={sairDaConta} />;

    async function sairDaConta() {
    try {
        const resposta = await fetch("/api/auth/logout", {
            method: "POST",
            cache: "no-store"
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível encerrar a sessão.");
        }

        // Atualiza a tela para o estado deslogado
        setUsuario(null);

    } catch (erro) {
        console.error("Erro ao sair da conta:", erro);
        alert("Não foi possível sair da conta. Tente novamente.");
    }
}
}