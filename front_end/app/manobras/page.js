
"use client";

import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";

// ==========================================
// NÍVEIS DAS MANOBRAS
// ==========================================

const niveis = [
    {
        valor: "iniciante",
        titulo: "Iniciante",
        descricao: "Comece aprendendo os movimentos fundamentais do skate.",
        cor: "#36B76A",
        icone: "🟢"
    },
    {
        valor: "intermediario",
        titulo: "Intermediário",
        descricao: "Evolua sua técnica e aprenda novos movimentos.",
        cor: "#E5A52B",
        icone: "🟡"
    },
    {
        valor: "avancado",
        titulo: "Avançado",
        descricao: "Desafie suas habilidades com manobras mais complexas.",
        cor: "#D72638",
        icone: "🔴"
    }
];

// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizarTexto(texto) {

    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

}

// ==========================================
// EXTRAIR ID DO YOUTUBE
// ==========================================

function extrairYoutubeId(url) {

    const resultado = String(url || "").match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );

    return resultado ? resultado[1] : "";

}

// ==========================================
// CARTÃO DA MANOBRA
// ==========================================

function ManobraCard({ manobra, nivel }) {

    const youtubeId = extrairYoutubeId(
        manobra.video_url
    );

    const videoUrl = youtubeId
        ? `https://www.youtube.com/watch?v=${youtubeId}`
        : null;

    const thumbnailUrl = youtubeId
        ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
        : null;

    return (

        <article className="dl-video-card">

            {/* IMAGEM DE PRÉVIA DO VÍDEO */}

            <div
                className="dl-video-frame"
                style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    overflow: "hidden",
                    background: "#171717"
                }}
            >

                {youtubeId ? (

                    <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Assistir ${manobra.nome} no YouTube`}
                        style={{
                            position: "relative",
                            display: "block",
                            width: "100%",
                            height: "100%",
                            cursor: "pointer"
                        }}
                    >

                        <img
                            src={thumbnailUrl}
                            alt={`Prévia do vídeo da manobra ${manobra.nome}`}
                            referrerPolicy="strict-origin-when-cross-origin"
                            style={{
                                display: "block",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                        />

                        {/* BOTÃO DE REPRODUÇÃO */}

                        <span
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "58px",
                                height: "58px",
                                borderRadius: "50%",
                                background: "#D72638",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "23px",
                                paddingLeft: "4px",
                                boxShadow: "0 3px 15px rgba(0,0,0,0.5)"
                            }}
                        >
                            ▶
                        </span>

                    </a>

                ) : (

                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#999"
                        }}
                    >
                        Vídeo indisponível
                    </div>

                )}

            </div>

            {/* INFORMAÇÕES */}

            <div className="dl-video-info">

                <span
                    className="dl-video-category"
                    style={{
                        borderLeft: `3px solid ${nivel.cor}`
                    }}
                >
                    {nivel.titulo}
                </span>

                <h3>
                    {manobra.icone || "🛹"} {manobra.nome}
                </h3>

                <p>
                    {manobra.descricao}
                </p>

                {manobra.categoria && (

                    <small
                        style={{
                            display: "block",
                            marginTop: "10px",
                            color: "#999"
                        }}
                    >
                        Categoria: {manobra.categoria}
                    </small>

                )}

                {videoUrl && (

                    <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dl-video-link"
                    >
                        Assistir no YouTube ↗
                    </a>

                )}

            </div>

        </article>

    );

}

// ==========================================
// PÁGINA MANOBRAS
// ==========================================

export default function ManobrasPage() {

    const [manobras, setManobras] = useState([]);

    const [filtro, setFiltro] = useState("todos");

    const [carregando, setCarregando] = useState(true);

    const [erro, setErro] = useState("");

    // ======================================
    // CARREGAR MANOBRAS DO BANCO DE DADOS
    // ======================================

    useEffect(() => {

        let ativo = true;

        async function carregarManobras() {

            try {

                const resposta = await fetch(
                    "/api/manobras",
                    {
                        cache: "no-store"
                    }
                );

                const dados = await resposta.json();

                if (!resposta.ok) {

                    throw new Error(
                        dados.erro ||
                        "Não foi possível carregar as manobras."
                    );

                }

                if (!Array.isArray(dados)) {

                    throw new Error(
                        "Os dados recebidos estão em um formato inválido."
                    );

                }

                if (ativo) {

                    setManobras(dados);

                    setErro("");

                }

            } catch (error) {

                console.error(
                    "ERRO AO CARREGAR MANOBRAS:",
                    error
                );

                if (ativo) {

                    setErro(
                        error.message ||
                        "Erro ao carregar as manobras."
                    );

                }

            } finally {

                if (ativo) {
                    setCarregando(false);
                }

            }

        }

        carregarManobras();

        return () => {
            ativo = false;
        };

    }, []);

    // ======================================
    // FILTRAR POR NÍVEL
    // ======================================

    const manobrasFiltradas = filtro === "todos"

        ? manobras

        : manobras.filter(manobra => {

            return (
                normalizarTexto(manobra.nivel) === filtro
            );

        });

    // ======================================
    // EXIBIR A PÁGINA
    // ======================================

    return (

        <>

            <PageHeader
                icon="🛹"
                titulo="Manobras"
                descricao="Do iniciante ao avançado. Aprenda novas manobras e evolua no skate."
            />

            <main className="dl-content">

                <section className="dl-section">

                    {/* INTRODUÇÃO */}

                    <div className="dl-section-intro">

                        <span className="dl-kicker">
                            EVOLUA NO SKATE
                        </span>

                        <h2>
                            Aprenda novas <em>manobras</em>
                        </h2>

                        <p>
                            Escolha seu nível, assista aos tutoriais
                            e desenvolva suas habilidades em cima do skate.
                        </p>

                    </div>

                    {/* FILTROS */}

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginBottom: "30px"
                        }}
                    >

                        <button
                            type="button"
                            onClick={() => setFiltro("todos")}
                            style={{
                                background: filtro === "todos"
                                    ? "#D72638"
                                    : "#191919",
                                color: "#fff",
                                border: "1px solid #444",
                                padding: "10px 18px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            Todas
                        </button>

                        {niveis.map(nivel => (

                            <button
                                type="button"
                                key={nivel.valor}
                                onClick={() => setFiltro(nivel.valor)}
                                style={{
                                    background: filtro === nivel.valor
                                        ? nivel.cor
                                        : "#191919",
                                    color: "#fff",
                                    border: "1px solid #444",
                                    padding: "10px 18px",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                {nivel.icone} {nivel.titulo}
                            </button>

                        ))}

                    </div>

                    {/* CARREGAMENTO */}

                    {carregando && (

                        <p>
                            Carregando manobras...
                        </p>

                    )}

                    {/* ERRO */}

                    {!carregando && erro && (

                        <p
                            style={{
                                color: "#D72638",
                                padding: "20px 0"
                            }}
                        >
                            {erro}
                        </p>

                    )}

                    {/* MANOBRAS */}

                    {!carregando && !erro && (

                        <>

                            {manobrasFiltradas.length > 0 ? (

                                niveis.map(nivel => {

                                    const manobrasNivel =
                                        manobrasFiltradas.filter(
                                            manobra =>
                                                normalizarTexto(manobra.nivel) === nivel.valor
                                        );

                                    if (!manobrasNivel.length) {
                                        return null;
                                    }

                                    return (

                                        <section
                                            key={nivel.valor}
                                            style={{
                                                marginBottom: "45px"
                                            }}
                                        >

                                            <div className="dl-section-intro">

                                                <span className="dl-kicker">
                                                    {nivel.icone} NÍVEL {nivel.titulo.toUpperCase()}
                                                </span>

                                                <h2>
                                                    {nivel.titulo}
                                                </h2>

                                                <p>
                                                    {nivel.descricao}
                                                </p>

                                            </div>

                                            <div className="dl-video-grid">

                                                {manobrasNivel.map(manobra => (

                                                    <ManobraCard
                                                        key={manobra.id}
                                                        manobra={manobra}
                                                        nivel={nivel}
                                                    />

                                                ))}

                                            </div>

                                        </section>

                                    );

                                })

                            ) : (

                                <p>
                                    Nenhuma manobra encontrada para este nível.
                                </p>

                            )}

                        </>

                    )}

                </section>

            </main>

        </>

    );

}
