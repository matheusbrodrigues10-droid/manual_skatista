"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";

const filtros = [
    { valor: "todos", texto: "Todos" },
    { valor: "iniciante", texto: "Iniciante" },
    { valor: "intermediario", texto: "Intermediário" },
    { valor: "avancado", texto: "Avançado" },
    { valor: "extra", texto: "Extra" }
];

const nomesNiveis = {
    iniciante: "Iniciante",
    intermediario: "Intermediário",
    avancado: "Avançado"
};

function obterVideoId(url) {
    try {
        const endereco = new URL(url);

        if (endereco.hostname.includes("youtu.be")) {
            return endereco.pathname
                .split("/")
                .filter(Boolean)[0] || null;
        }

        if (endereco.pathname.startsWith("/embed/")) {
            return endereco.pathname
                .split("/")[2] || null;
        }

        return endereco.searchParams.get("v");
    } catch {
        return null;
    }
}

function obterUrlIncorporada(url) {
    const videoId = obterVideoId(url);

    if (!videoId) {
        return null;
    }

    const parametros = new URL(url).searchParams;
    const tempo = parametros.get("t") || "";

    let segundos = 0;

    if (/^\d+$/.test(tempo)) {
        segundos = Number(tempo);
    } else {
        const match = tempo.match(
            /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/
        );

        if (match && match[0]) {
            segundos =
                Number(match[1] || 0) * 3600 +
                Number(match[2] || 0) * 60 +
                Number(match[3] || 0);
        }
    }

    const inicio = segundos > 0
        ? `?start=${segundos}`
        : "";

    return `https://www.youtube-nocookie.com/embed/${videoId}${inicio}`;
}

function CartaoManobra({ manobra, selecionada, onClick }) {
    const textoNivel = manobra.categoria === "extra"
        ? "EXTRA"
        : nomesNiveis[manobra.nivel] || manobra.nivel;

    return (
        <button
            type="button"
            className={`manobra-card ${
                selecionada ? "manobra-card-selecionada" : ""
            }`}
            onClick={onClick}
            aria-pressed={selecionada}
        >
            <div className="manobra-card-topo">
                <span className="manobra-icone">
                    {manobra.icone || "🛹"}
                </span>

                <span
                    className={`manobra-badge manobra-badge-${manobra.categoria === "extra" ? "extra" : manobra.nivel}`}
                >
                    {textoNivel}
                </span>
            </div>

            <h3 className="manobra-card-titulo">
                {manobra.nome}
            </h3>

            <p className="manobra-card-descricao">
                {manobra.descricao}
            </p>

            <span className="manobra-card-acao">
                ▶ Ver tutorial
            </span>
        </button>
    );
}

export default function ManobrasPage() {
    const [manobras, setManobras] = useState([]);
    const [filtro, setFiltro] = useState("todos");
    const [selecionada, setSelecionada] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarManobras() {
            try {
                const response = await fetch(
                    "/api/manobras",
                    {
                        cache: "no-store"
                    }
                );

                const dados = await response.json();

                if (!response.ok) {
                    throw new Error(
                        dados.erro ||
                        "Não foi possível carregar as manobras."
                    );
                }

                setManobras(
                    Array.isArray(dados) ? dados : []
                );
            } catch (error) {
                console.error(
                    "Erro ao carregar manobras:",
                    error
                );

                setErro(
                    error.message ||
                    "Não foi possível carregar as manobras."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarManobras();
    }, []);

    useEffect(() => {
        if (selecionada) {
            document
                .getElementById("detalhe-manobra")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        }
    }, [selecionada]);

    const grupos = filtro === "todos"
        ? [
            {
                chave: "iniciante",
                titulo: "Iniciante",
                descricao: "Aprenda os fundamentos e construa sua base.",
                itens: manobras.filter(
                    (m) =>
                        m.categoria === "nivel" &&
                        m.nivel === "iniciante"
                )
            },
            {
                chave: "intermediario",
                titulo: "Intermediário",
                descricao: "Evolua a técnica e combine movimentos.",
                itens: manobras.filter(
                    (m) =>
                        m.categoria === "nivel" &&
                        m.nivel === "intermediario"
                )
            },
            {
                chave: "avancado",
                titulo: "Avançado",
                descricao: "Desafie seu domínio do shape e sua precisão.",
                itens: manobras.filter(
                    (m) =>
                        m.categoria === "nivel" &&
                        m.nivel === "avancado"
                )
            },
            {
                chave: "extra",
                titulo: "Extra",
                descricao: "Conteúdos complementares para continuar evoluindo.",
                itens: manobras.filter(
                    (m) => m.categoria === "extra"
                )
            }
        ].filter((grupo) => grupo.itens.length > 0)
        : [
            {
                chave: filtro,
                titulo: filtro === "extra"
                    ? "Extra"
                    : nomesNiveis[filtro],
                descricao: filtro === "extra"
                    ? "Conteúdos complementares para sua evolução."
                    : `Manobras de nível ${nomesNiveis[filtro]?.toLowerCase()}.`,
                itens: manobras.filter((m) =>
                    filtro === "extra"
                        ? m.categoria === "extra"
                        : m.categoria === "nivel" &&
                          m.nivel === filtro
                )
            }
        ].filter((grupo) => grupo.itens.length > 0);

    function mudarFiltro(valor) {
        setFiltro(valor);
        setSelecionada(null);
    }

    return (
        <>
            <PageHeader
                icon="🛹"
                titulo="Manobras"
                descricao="Do iniciante ao avançado, aprenda cada trick com tutoriais em vídeo."
            />

            <main className="manobras-conteudo">
                <nav
                    className="manobras-filtros"
                    aria-label="Filtrar manobras por nível"
                >
                    {filtros.map((item) => (
                        <button
                            key={item.valor}
                            type="button"
                            className={`manobras-filtro ${
                                filtro === item.valor
                                    ? "manobras-filtro-ativo"
                                    : ""
                            }`}
                            onClick={() => mudarFiltro(item.valor)}
                            aria-pressed={filtro === item.valor}
                        >
                            {item.texto}
                        </button>
                    ))}
                </nav>

                {carregando && (
                    <p className="manobras-mensagem">
                        Carregando manobras...
                    </p>
                )}

                {!carregando && erro && (
                    <p className="manobras-erro">
                        ❌ {erro}
                    </p>
                )}

                {!carregando && !erro && manobras.length === 0 && (
                    <p className="manobras-mensagem">
                        Nenhuma manobra está cadastrada no momento.
                    </p>
                )}

                {!carregando && !erro && grupos.map((grupo) => (
                    <section
                        className="manobras-grupo"
                        key={grupo.chave}
                    >
                        <div className="manobras-grupo-cabecalho">
                            <div>
                                <h2>{grupo.titulo}</h2>
                                <p>{grupo.descricao}</p>
                            </div>

                            <span className="manobras-contagem">
                                {grupo.itens.length}{" "}
                                {grupo.itens.length === 1
                                    ? "conteúdo"
                                    : "conteúdos"}
                            </span>
                        </div>

                        <div className="manobras-grid">
                            {grupo.itens.map((manobra) => (
                                <CartaoManobra
                                    key={manobra.id}
                                    manobra={manobra}
                                    selecionada={
                                        selecionada?.id === manobra.id
                                    }
                                    onClick={() =>
                                        setSelecionada(manobra)
                                    }
                                />
                            ))}
                        </div>
                    </section>
                ))}

                {selecionada && (
                    <section
                        id="detalhe-manobra"
                        className="manobra-detalhe"
                    >
                        <div className="manobra-detalhe-cabecalho">
                            <div>
                                <span className="manobra-detalhe-etiqueta">
                                    {selecionada.categoria === "extra"
                                        ? "CONTEÚDO EXTRA"
                                        : `NÍVEL ${nomesNiveis[selecionada.nivel]?.toUpperCase()}`}
                                </span>

                                <h2>{selecionada.nome}</h2>
                            </div>

                            <button
                                type="button"
                                className="manobra-fechar"
                                onClick={() => setSelecionada(null)}
                                aria-label="Fechar tutorial"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="manobra-detalhe-layout">
                            <div className="manobra-video">
                                {obterUrlIncorporada(
                                    selecionada.video_url
                                ) ? (
                                    <iframe
                                        src={obterUrlIncorporada(
                                            selecionada.video_url
                                        )}
                                        title={`Tutorial: ${selecionada.nome}`}
                                        loading="lazy"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    />
                                ) : (
                                    <p>
                                        Não foi possível preparar a prévia deste vídeo.
                                    </p>
                                )}
                            </div>

                            <div className="manobra-detalhe-texto">
                                <h3>Sobre a manobra</h3>

                                <p>{selecionada.descricao}</p>

                                {selecionada.categoria === "nivel" && (
                                    <div className="manobra-info-nivel">
                                        <span>Nível de dificuldade</span>
                                        <strong>
                                            {nomesNiveis[selecionada.nivel]}
                                        </strong>
                                    </div>
                                )}

                                <a
                                    href={selecionada.video_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="manobra-abrir-youtube"
                                >
                                    Assistir diretamente no YouTube ↗
                                </a>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}