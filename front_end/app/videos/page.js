"use client";

import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import AvisoDireitosAutorais from "../../components/AvisoDireitosAutorais";

// ==========================================
// VÍDEOS DE DICAS
// ==========================================

const videosDicas = [
    {
        titulo: "5 Dicas para evoluir mais rápido no skate",
    },
    {
        titulo: "Como Dropar na Rampa",
    },
    {
        titulo: "Como melhorar seu equilíbrio em cima do skate",
    },
    {
        titulo: "10 Dicas para não se machucar no Skate",
    },
    {
        titulo: "Domine seu medo no Skate",
    },
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
// CARTÃO DE VÍDEO BLOQUEADO
// ==========================================

function VideoCard({ video, categoria }) {

    return (

        <article className="dl-video-card">

            {/* ESPAÇO DO VÍDEO */}

            <div
                className="dl-video-frame"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "12px",
                    background: "#171717"
                }}
            >

                <span style={{ fontSize: "38px" }}>
                    🔒
                </span>

                <span
                    style={{
                        color: "#999",
                        fontSize: "12px"
                    }}
                >
                    Conteúdo não disponível
                </span>

            </div>

            {/* INFORMAÇÕES */}

            <div className="dl-video-info">

                <span className="dl-video-category">
                    {categoria}
                </span>

                <h3>
                    {video.titulo}
                </h3>

                <AvisoDireitosAutorais />

            </div>

        </article>

    );

}

// ==========================================
// PÁGINA DICAS E LIFESTYLE
// ==========================================

export default function VideosPage() {

    const [videosLifestyle, setVideosLifestyle] = useState([]);

    const [carregando, setCarregando] = useState(true);

    const [erro, setErro] = useState("");

    // ======================================
    // CARREGAR VÍDEOS E PROGRESSO
    // ======================================

    useEffect(() => {

        let ativo = true;

        async function carregarVideos() {

            try {

                const [
                    respostaVideos,
                    respostaProgresso
                ] = await Promise.all([

                    fetch("/api/videos-lifestyle", {
                        cache: "no-store"
                    }),

                    fetch("/api/progresso", {
                        cache: "no-store"
                    })

                ]);

                if (!respostaVideos.ok) {

                    throw new Error(
                        "Não foi possível carregar os conteúdos de Lifestyle."
                    );

                }

                const videos = await respostaVideos.json();

                const progresso = respostaProgresso.ok
                    ? await respostaProgresso.json()
                    : null;

                if (!Array.isArray(videos)) {

                    throw new Error(
                        "Formato de conteúdos inválido."
                    );

                }

                // Somente informações necessárias para os cartões.
                // URLs de vídeos não são utilizadas na interface.

                const videosSemLinks = videos.map(video => ({
                    id: video.id,
                    titulo: video.titulo,
                    categoria: video.categoria,
                    descricao: video.descricao
                }));

                let videosExibidos = videosSemLinks;

                // Mantém a seleção de conteúdos do usuário intermediário.

                const nivel = normalizarTexto(
                    progresso?.nivelAtual
                );

                if (nivel === "intermediario") {

                    const selecionados =
                        progresso?.videosLifestyle || [];

                    const idsSelecionados = new Set(
                        selecionados.map(video =>
                            Number(video.id)
                        )
                    );

                    videosExibidos = videosSemLinks.filter(video =>
                        idsSelecionados.has(Number(video.id))
                    );

                }

                if (!ativo) return;

                setVideosLifestyle(videosExibidos);

                setErro("");

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

    // ======================================
    // RENDERIZAÇÃO
    // ======================================

    return (

        <>

            <PageHeader
                icon="🛹"
                titulo="Dicas e Lifestyle"
                descricao="Vivências do skate, sessões de rua e dicas para evoluir nas manobras."
            />

            <main className="dl-content">

                {/* LIFESTYLE */}

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

                        <p>
                            Carregando conteúdos...
                        </p>

                    ) : erro ? (

                        <p>
                            {erro}
                        </p>

                    ) : videosLifestyle.length > 0 ? (

                        <div className="dl-video-grid">

                            {videosLifestyle.map(video => (

                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    categoria="Lifestyle"
                                />

                            ))}

                        </div>

                    ) : (

                        <p>
                            Nenhum conteúdo de Lifestyle encontrado.
                        </p>

                    )}

                </section>

                {/* DICAS DE SKATE */}

                <section className="dl-section">

                    <div className="dl-section-intro">

                        <span className="dl-kicker">
                            EVOLUA NO SKATE
                        </span>

                        <h2>
                            Dicas para <em>mandar bem</em>
                        </h2>

                        <p>
                            Conteúdos sobre técnicas, equilíbrio,
                            treinamento e evolução no skate.
                        </p>

                    </div>

                    <div className="dl-video-grid">

                        {videosDicas.map((video, index) => (

                            <VideoCard
                                key={index}
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