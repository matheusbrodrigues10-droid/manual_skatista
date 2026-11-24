
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function AvisoDireitosAutorais() {

    const [aberto, setAberto] = useState(false);

    // ======================================
    // CONTROLAR TECLA ESC E ROLAGEM
    // ======================================

    useEffect(() => {

        if (!aberto) return;

        function fecharComEsc(event) {
            if (event.key === "Escape") {
                setAberto(false);
            }
        }

        const scrollAnterior = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        window.addEventListener("keydown", fecharComEsc);

        return () => {

            document.body.style.overflow = scrollAnterior;

            window.removeEventListener(
                "keydown",
                fecharComEsc
            );

        };

    }, [aberto]);

    return (
        <>

            {/* BOTÃO ACESSAR VÍDEO */}

            <button
                type="button"
                className="dl-video-link"
                onClick={() => setAberto(true)}
                style={{
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit"
                }}
            >
                Acessar vídeo
            </button>

            {/* MODAL DE DIREITOS AUTORAIS */}

            {aberto && typeof document !== "undefined" &&

                createPortal(

                    <div
                        onClick={(event) => {

                            // Fecha somente quando clicar no fundo.
                            // Movimentar o mouse não fecha o aviso.

                            if (
                                event.target === event.currentTarget
                            ) {
                                setAberto(false);
                            }

                        }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0, 0, 0, 0.85)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px",
                            zIndex: 999999
                        }}
                    >

                        {/* CAIXA DO AVISO */}

                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="aviso-direitos-titulo"
                            style={{
                                width: "100%",
                                maxWidth: "430px",
                                background: "#191919",
                                border: "1px solid #D72638",
                                borderRadius: "10px",
                                padding: "30px",
                                textAlign: "center",
                                color: "#fff",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
                                position: "relative",
                                zIndex: 1000000
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "35px",
                                    marginBottom: "15px"
                                }}
                            >
                                🔒
                            </div>

                            <h2
                                id="aviso-direitos-titulo"
                                style={{
                                    fontSize: "19px",
                                    marginBottom: "22px",
                                    lineHeight: 1.5
                                }}
                            >
                                Você não tem acesso aos direitos autorais desse vídeo
                            </h2>

                            {/* BOTÃO FECHAR */}

                            <button
                                type="button"
                                onClick={() => setAberto(false)}
                                style={{
                                    background: "#D72638",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    padding: "11px 30px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    fontSize: "14px"
                                }}
                            >
                                Fechar
                            </button>

                        </div>

                    </div>,

                    document.body

                )

            }

        </>
    );

}
