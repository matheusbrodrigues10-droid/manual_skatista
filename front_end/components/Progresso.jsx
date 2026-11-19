
"use client";

import { useEffect, useState } from "react";

export default function ProgressoNivel() {
    const [progresso, setProgresso] = useState(null);
    const [aberto, setAberto] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [semSessao, setSemSessao] = useState(false);

    async function carregarProgresso() {
        try {
            const response = await fetch("/api/progresso", {
                cache: "no-store"
            });

            if (response.status === 401) {
                setSemSessao(true);
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro);
            }

            setProgresso(data);
            setSemSessao(false);
            setErro("");

        } catch (error) {
            setErro(error.message || "Erro ao carregar progresso.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarProgresso();

        function atualizar() {
            carregarProgresso();
        }

        window.addEventListener(
            "progressoAtualizado",
            atualizar
        );

        return () => {
            window.removeEventListener(
                "progressoAtualizado",
                atualizar
            );
        };
    }, []);

    if (semSessao) return null;

    const vermelho = "#D72638";
    const percentual = progresso?.percentual || 0;

    const botao = {
        background: vermelho,
        color: "#fff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "5px",
        fontWeight: "bold",
        cursor: "pointer",
        fontFamily: "inherit"
    };

    const barraFundo = {
        width: "100%",
        height: "8px",
        background: "#333",
        borderRadius: "20px",
        overflow: "hidden",
        marginTop: "9px"
    };

    const barra = (valor, cor = vermelho) => ({
        height: "100%",
        width: `${valor}%`,
        background: cor,
        borderRadius: "20px",
        transition: "width 0.3s ease"
    });

    return (
        <>
            {/* CARTÃO DA HOME */}

            <div
                style={{
                    margin: "20px auto 0",
                    width: "min(92%, 390px)",
                    padding: "15px 20px",
                    background: "#171717",
                    border: "1px solid #393939",
                    borderRadius: "9px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "15px"
                }}
            >
                <div>
                    <span
                        style={{
                            color: "#aaa",
                            fontSize: "10px",
                            letterSpacing: "1px"
                        }}
                    >
                        SEU NÍVEL ATUAL
                    </span>

                    <strong
                        style={{
                            display: "block",
                            fontSize: "19px",
                            textTransform: "uppercase"
                        }}
                    >
                        {carregando
                            ? "Carregando..."
                            : progresso?.nivelAtual}
                    </strong>

                    {progresso && (
                        <>
                            <div style={barraFundo}>
                                <div style={barra(percentual)} />
                            </div>

                            <small style={{ color: "#aaa" }}>
                                {percentual}% concluído
                            </small>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => {
                        carregarProgresso();
                        setAberto(true);
                    }}
                    style={botao}
                    disabled={carregando}
                >
                    Progresso
                </button>
            </div>

            {erro && (
                <p style={{ color: vermelho, textAlign: "center" }}>
                    {erro}
                </p>
            )}

            {/* JANELA DE PROGRESSO */}

            {aberto && (
                <div
                    onClick={() => setAberto(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.85)",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "15px"
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "#151515",
                            border: `1px solid ${vermelho}`,
                            borderRadius: "10px",
                            padding: "25px",
                            width: "min(100%, 550px)",
                            maxHeight: "85vh",
                            overflowY: "auto",
                            color: "#fff"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <h2>SEU PROGRESSO</h2>

                            <button
                                onClick={() => setAberto(false)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "25px",
                                    cursor: "pointer"
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {carregando ? (
                            <p>Carregando progresso...</p>
                        ) : progresso ? (
                            <>
                                <div
                                    style={{
                                        background: "#222",
                                        borderRadius: "8px",
                                        padding: "15px",
                                        marginTop: "15px"
                                    }}
                                >
                                    <small style={{ color: "#aaa" }}>
                                        SEU NÍVEL
                                    </small>

                                    <h2 style={{ color: vermelho }}>
                                        {progresso.nivelAtual}
                                    </h2>

                                    {!progresso.nivelMaximo && (
                                        <p>
                                            Próximo objetivo:{" "}
                                            <strong>
                                                {progresso.proximoNivel}
                                            </strong>
                                        </p>
                                    )}

                                    <div style={barraFundo}>
                                        <div style={barra(percentual)} />
                                    </div>

                                    <small style={{ color: "#aaa" }}>
                                        {percentual}% concluído
                                    </small>
                                </div>

                                {!progresso.nivelMaximo && (
                                    <div style={{ marginTop: "25px" }}>
                                        <h3>
                                            O QUE FALTA PARA SUBIR DE NÍVEL?
                                        </h3>

                                        {progresso.etapas.map(
                                            (etapa, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        background: "#222",
                                                        padding: "14px",
                                                        borderRadius: "7px",
                                                        marginBottom: "12px"
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            gap: "10px"
                                                        }}
                                                    >
                                                        <strong style={{ fontSize: "13px" }}>
                                                            {etapa.titulo}
                                                        </strong>

                                                        <span
                                                            style={{
                                                                color: etapa.completo
                                                                    ? "#45c46a"
                                                                    : vermelho
                                                            }}
                                                        >
                                                            {etapa.concluidos}/{etapa.total}
                                                        </span>
                                                    </div>

                                                    <div style={barraFundo}>
                                                        <div
                                                            style={barra(
                                                                etapa.percentual,
                                                                etapa.completo
                                                                    ? "#45c46a"
                                                                    : vermelho
                                                            )}
                                                        />
                                                    </div>

                                                    {!etapa.disponivel && (
                                                        <small style={{ color: "#ffb45e" }}>
                                                            Conteúdos desta etapa precisam
                                                            ser cadastrados ou conferidos.
                                                        </small>
                                                    )}

                                                    {etapa.completo && (
                                                        <small style={{ color: "#45c46a" }}>
                                                            Etapa concluída!
                                                        </small>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                {progresso.videosLifestyle?.length > 0 && (
                                    <div style={{ marginTop: "25px" }}>
                                        <h3>SEUS VÍDEOS DE LIFESTYLE</h3>

                                        {progresso.videosLifestyle.map(video => (
                                            <div
                                                key={video.id}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    gap: "10px",
                                                    padding: "9px",
                                                    borderBottom: "1px solid #333"
                                                }}
                                            >
                                                <span style={{ fontSize: "12px" }}>
                                                    {video.titulo}
                                                </span>

                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        color: video.concluido
                                                            ? "#45c46a"
                                                            : "#aaa"
                                                    }}
                                                >
                                                    {video.concluido
                                                        ? "Acessado"
                                                        : "Pendente"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <p
                                    style={{
                                        color: "#aaa",
                                        textAlign: "center",
                                        fontSize: "12px",
                                        marginTop: "20px"
                                    }}
                                >
                                    {progresso.mensagem}
                                </p>
                            </>
                        ) : (
                            <p>{erro || "Progresso indisponível."}</p>
                        )}

                        <button
                            type="button"
                            onClick={() => setAberto(false)}
                            style={{
                                ...botao,
                                width: "100%",
                                marginTop: "15px"
                            }}
                        >
                            FECHAR
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
