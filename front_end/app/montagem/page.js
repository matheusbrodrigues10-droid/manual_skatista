"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";

const filtros = [
    { valor: "todos", texto: "Todos" },
    { valor: "montagem", texto: "Montagem" },
    { valor: "manutencao", texto: "Manutenção" }
];

function nomeCategoria(categoria) {
    if (categoria === "manutencao") {
        return "Manutenção";
    }

    return "Montagem";
}

// Transforma o link original em uma URL de incorporação
function obterUrlIncorporada(urlOriginal) {
    try {
        const url = new URL(urlOriginal);

        let videoId = null;

        if (url.hostname.includes("youtu.be")) {
            videoId = url.pathname
                .split("/")
                .filter(Boolean)[0];
        } else {
            videoId = url.searchParams.get("v");

            if (!videoId) {
                const correspondencia =
                    url.pathname.match(/\/embed\/([^/]+)/);

                videoId = correspondencia
                    ? correspondencia[1]
                    : null;
            }
        }

        if (!videoId) {
            return null;
        }

        const tempo = url.searchParams.get("t") || "";
        const tempoNumerico = tempo.match(/^(\d+)$/);

        let segundos = tempoNumerico
            ? Number(tempoNumerico[1])
            : 0;

        if (!tempoNumerico && tempo) {
            const horas = tempo.match(/(\d+)h/);
            const minutos = tempo.match(/(\d+)m/);
            const segundosMatch = tempo.match(/(\d+)s/);

            segundos =
                Number(horas?.[1] || 0) * 3600 +
                Number(minutos?.[1] || 0) * 60 +
                Number(segundosMatch?.[1] || 0);
        }

        const inicio = segundos > 0
            ? `?start=${segundos}`
            : "";

        return (
            `https://www.youtube-nocookie.com/embed/` +
            `${videoId}${inicio}`
        );

    } catch {
        return null;
    }
}

export default function MontagemPage() {
    const router = useRouter();

    const [montagens, setMontagens] = useState([]);
    const [filtro, setFiltro] = useState("todos");
    const [selecionada, setSelecionada] = useState(null);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativa = true;

        async function carregarMontagens() {
            try {
                const response = await fetch(
                    "/api/montagens",
                    {
                        cache: "no-store"
                    }
                );

                if (response.status === 401) {
                    router.replace(
                        "/login?redirect=%2Fmontagem"
                    );
                    return;
                }

                const dados = await response.json();

                if (!response.ok) {
                    throw new Error(
                        dados.erro ||
                        "Não foi possível carregar as montagens."
                    );
                }

                if (ativa) {
                    setMontagens(
                        Array.isArray(dados) ? dados : []
                    );
                }

            } catch (error) {
                console.error(
                    "Erro ao buscar montagens:",
                    error
                );

                if (ativa) {
                    setErro(
                        error.message ||
                        "Não foi possível carregar os tutoriais."
                    );
                }

            } finally {
                if (ativa) {
                    setCarregando(false);
                }
            }
        }

        carregarMontagens();

        return () => {
            ativa = false;
        };
    }, [router]);

    const montagensFiltradas = useMemo(() => {
        if (filtro === "todos") {
            return montagens;
        }

        return montagens.filter(
            (item) => item.categoria === filtro
        );
    }, [montagens, filtro]);

    useEffect(() => {
        if (selecionada) {
            document
                .getElementById("detalhe-montagem")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        }
    }, [selecionada]);

    function alterarFiltro(novoFiltro) {
        setFiltro(novoFiltro);
        setSelecionada(null);
    }

    return (
        <>
            <PageHeader
                icon="🔧"
                titulo="Montagem"
                descricao="Vídeos de montagem, manutenção e troca de peças do seu setup."
            />

            <main className="montagem-conteudo">
                <nav
                    className="montagem-filtros"
                    aria-label="Filtrar tutoriais"
                >
                    {filtros.map((item) => (
                        <button
                            key={item.valor}
                            type="button"
                            className={`montagem-filtro ${
                                filtro === item.valor
                                    ? "montagem-filtro-ativo"
                                    : ""
                            }`}
                            onClick={() =>
                                alterarFiltro(item.valor)
                            }
                            aria-pressed={
                                filtro === item.valor
                            }
                        >
                            {item.texto}
                        </button>
                    ))}
                </nav>

                {carregando && (
                    <p className="montagem-mensagem">
                        Carregando tutoriais...
                    </p>
                )}

                {!carregando && erro && (
                    <p className="montagem-erro">
                        ❌ {erro}
                    </p>
                )}

                {!carregando &&
                    !erro &&
                    montagensFiltradas.length === 0 && (
                        <p className="montagem-mensagem">
                            Não há tutoriais nesta categoria.
                        </p>
                    )}

                {!carregando &&
                    !erro &&
                    montagensFiltradas.length > 0 && (
                        <>
                            <div className="montagem-resumo">
                                <span>
                                    {montagensFiltradas.length}
                                </span>{" "}
                                {montagensFiltradas.length === 1
                                    ? "tutorial disponível"
                                    : "tutoriais disponíveis"}
                            </div>

                            <div className="montagem-grid">
                                {montagensFiltradas.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`montagem-card ${
                                            selecionada?.id === item.id
                                                ? "montagem-card-selecionado"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelecionada(item)
                                        }
                                        aria-pressed={
                                            selecionada?.id === item.id
                                        }
                                    >
                                        <span className="montagem-card-icone">
                                            {item.icone || "🔧"}
                                        </span>

                                        <span
                                            className={`montagem-badge montagem-badge-${item.categoria}`}
                                        >
                                            {nomeCategoria(item.categoria)}
                                        </span>

                                        <h2 className="montagem-card-titulo">
                                            {item.nome}
                                        </h2>

                                        <p className="montagem-card-descricao">
                                            {item.descricao}
                                        </p>

                                        <span className="montagem-card-acao">
                                            ▶ VER TUTORIAL
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                {selecionada && (
                    <section
                        id="detalhe-montagem"
                        className="montagem-detalhe"
                    >
                        <div className="montagem-detalhe-cabecalho">
                            <div>
                                <span className="montagem-detalhe-etiqueta">
                                    {nomeCategoria(
                                        selecionada.categoria
                                    ).toUpperCase()}
                                </span>

                                <h2>
                                    {selecionada.nome}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="montagem-fechar"
                                onClick={() =>
                                    setSelecionada(null)
                                }
                                aria-label="Fechar tutorial"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="montagem-detalhe-layout">
                            <div className="montagem-video">
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
                                        Não foi possível carregar a prévia.
                                    </p>
                                )}
                            </div>

                            <div className="montagem-detalhe-texto">
                                <h3>Sobre este tutorial</h3>

                                <p>
                                    {selecionada.descricao}
                                </p>

                                <div className="montagem-info">
                                    <span>Categoria</span>

                                    <strong>
                                        {nomeCategoria(
                                            selecionada.categoria
                                        )}
                                    </strong>
                                </div>

                                <a
                                    href={selecionada.video_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="montagem-youtube"
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