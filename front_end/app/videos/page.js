
"use client";

import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { registrarAcessoVideo } from "@/lib/progresso";

// =====================================================
// VÍDEOS DE DICAS
// =====================================================

const videosDicas = [
    {
        id: "y5ZsE3nmew4",
        titulo: "5 Dicas para evoluir mais rápido no skate",
    },
    {
        id: "nN7fDnIBPmc",
        titulo: "Como Dropar na Rampa",
    },
    {
        id: "vOoiKFP4Oow",
        titulo: "Como melhorar seu equilíbrio em cima do skate",
    },
    {
        id: "ZoLiDtmf454",
        titulo: "10 Dicas para não se machucar no Skate",
    },
    {
        id: "sIrLPzMtyl4",
        titulo: "Domine seu medo no Skate",
    },
];

// =====================================================
// EXTRAIR ID DO YOUTUBE
// =====================================================

function extrairYoutubeId(url) {
    const resultado = String(url || "").match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );

    return resultado ? resultado[1] : "";
}

// =====================================================
// NORMALIZAR TEXTO
// =====================================================

function normalizarTexto(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// =====================================================
// CARTÃO DE VÍDEO
// =====================================================

function VideoCard({ video, categoria, rastrear = false }) {

    const isLifestyle = categoria === "Lifestyle";

    const youtubeId = isLifestyle
        ? extrairYoutubeId(video.video_url)
        : video.id;

    const videoUrl = isLifestyle
        ? video.video_url
        : `https://www.youtube.com/watch?v=${video.id}`;

    function registrarVideo() {
        if (!rastrear) return;

        registrarAcessoVideo(
            "lifestyle",
            Number(video.id)
        ).catch(console.error);
    }

    return (
        <article className="dl-video-card">

            <div className="dl-video-frame">

                {youtubeId ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={video.titulo}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                ) : (
                    <div>
                        Vídeo indisponível
                    </div>
                )}

            </div>

            <div className="dl-video-info">

                <span className="dl-video-category">
                    {categoria}
                </span>

                <h3>{video.titulo}</h3>

                <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dl-video-link"
                    onClick={registrarVideo}
                >
                    Assistir no YouTube ↗
                </a>

            </div>

        </article>
    );
}

// =====================================================
// PÁGINA DICAS E LIFESTYLE
// =====================================================

export default function VideosPage() {

    const [videosLifestyle, setVideosLifestyle] = useState([]);

    const [carregando, setCarregando] = useState(true);

    const [erro, setErro] = useState("");

    const [rastrearLifestyle, setRastrearLifestyle] =
        useState(false);

    // =================================================
    // CARREGAR VÍDEOS DO BANCO DE DADOS
    // =================================================

    useEffect(() => {

        let ativo = true;

        async function carregarVideos() {

            try {

                const [respostaVideos, respostaProgresso] =
                    await Promise.all([
                        fetch("/api/videos-lifestyle", {
                            cache: "no-store"
                        }),

                        fetch("/api/progresso", {
                            cache: "no-store"
                        })
                    ]);

                if (!respostaVideos.ok) {
                    throw new Error(
                        "Não foi possível carregar os vídeos de Lifestyle."
                    );
                }

                const videos = await respostaVideos.json();

                const progresso = respostaProgresso.ok
                    ? await respostaProgresso.json()
                    : null;

                if (!Array.isArray(videos)) {
                    throw new Error(
                        "Formato de vídeos inválido."
                    );
                }

                let videosExibidos = videos;

                // -----------------------------------------
                // SE O USUÁRIO FOR INTERMEDIÁRIO
                // EXIBIR OS CINCO VÍDEOS SORTEADOS
                // -----------------------------------------

                const nivel = normalizarTexto(
                    progresso?.nivelAtual
                );

                let rastrear = false;

                if (nivel === "intermediario") {

                    const selecionados =
                        progresso?.videosLifestyle || [];

                    const idsSelecionados = new Set(
                        selecionados.map(video =>
                            Number(video.id)
                        )
                    );

                    videosExibidos = videos.filter(video =>
                        idsSelecionados.has(Number(video.id))
                    );

                    rastrear = true;
                }

                if (!ativo) return;

                setVideosLifestyle(videosExibidos);

                setRastrearLifestyle(rastrear);

            } catch (error) {

                console.error(error);

                if (ativo) {
                    setErro(error.message);
                }

            } finally {

                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarVideos();

        return () => {
            ativo = false;
        };

    }, []);

    // =================================================
    // RENDERIZAÇÃO
    // =================================================

    return (
        <>
            <PageHeader
                icon="🛹"
                titulo="Dicas e Lifestyle"
                descricao="Vivências do skate, sessões de rua e dicas para evoluir nas manobras."
            />

            <main className="dl-content">

                {/* =====================================
                    SEÇÃO LIFESTYLE
                ===================================== */}

                <section className="dl-section">

                    <div className="dl-section-intro">

                        <span className="dl-kicker">
                            CULTURA SKATE
                        </span>

                        <h2>
                            Lifestyle e <em>vivências</em>
                        </h2>

                        <p>
                            Competições, sessões, histórias e o
                            dia a dia de quem vive o skate.
                        </p>

                    </div>

                    {carregando ? (

                        <p>Carregando vídeos...</p>

                    ) : erro ? (

                        <p>{erro}</p>

                    ) : videosLifestyle.length > 0 ? (

                        <div className="dl-video-grid">

                            {videosLifestyle.map((video) => (

                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    categoria="Lifestyle"
                                    rastrear={rastrearLifestyle}
                                />

                            ))}

                        </div>

                    ) : (

                        <p>
                            Nenhum vídeo de Lifestyle encontrado.
                        </p>

                    )}

                </section>

                {/* =====================================
                    SEÇÃO DICAS
                ===================================== */}

                <section className="dl-section">

                    <div className="dl-section-intro">

                        <span className="dl-kicker">
                            EVOLUA NO SKATE
                        </span>

                        <h2>
                            Dicas para <em>mandar bem</em>
                        </h2>

                        <p>
                            Aprenda técnicas, melhore seu equilíbrio,
                            enfrente desafios e evolua com mais segurança.
                        </p>

                    </div>

                    <div className="dl-video-grid">

                        {videosDicas.map((video) => (

                            <VideoCard
                                key={video.id}
                                video={video}
                                categoria="Dicas de skate"
                            />

                        ))}

                    </div>

                </section>

            </main>
        </>
    );
}
