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

    return <Home usuario={usuario} />;
}