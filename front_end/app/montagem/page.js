
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import AvisoDireitosAutorais from "../../components/AvisoDireitosAutorais";

// ==========================================
// FILTROS
// ==========================================

const filtros = [
    { valor: "todos", texto: "Todos" },
    { valor: "montagem", texto: "Montagem" },
    { valor: "manutencao", texto: "Manutenção" }
];

// ==========================================
// NOME DA CATEGORIA
// ==========================================

function nomeCategoria(categoria) {

    if (categoria === "manutencao") {
        return "Manutenção";
    }

    return "Montagem";
}

// ==========================================
// PÁGINA MONTAGEM
// ==========================================

export default function MontagemPage() {

    const router = useRouter();

    const [montagens, setMontagens] = useState([]);
    const [filtro, setFiltro] = useState("todos");
    const [selecionada, setSelecionada] = useState(null);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    // ======================================
    // CARREGAR MONTAGENS
    // ======================================

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

    // ======================================
    // FILTRAR MONTAGENS
    // ======================================

    const montagensFiltradas = useMemo(() => {

        if (filtro === "todos") {
            return montagens;
        }

        return montagens.filter(
            (item) => item.categoria === filtro
        );

    }, [montagens, filtro]);

    // ======================================
    // ROLAR ATÉ OS DETALHES
    // ======================================

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

    // ======================================
    // ALTERAR FILTRO
    // ======================================

    function alterarFiltro(novoFiltro) {

        setFiltro(novoFiltro);
        setSelecionada(null);

    }

    // ======================================
    // RENDERIZAÇÃO
    // ======================================

    return (

        <>

            <PageHeader
                icon="🔧"
                titulo="Montagem"
                descricao="Vídeos de montagem, manutenção e troca de peças do seu setup."
            />

            <main className="montagem-conteudo">

                {/* ==================================
                    FILTROS
                ================================== */}

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

                {/* ==================================
                    CARREGAMENTO
                ================================== */}

                {carregando && (

                    <p className="montagem-mensagem">
                        Carregando tutoriais...
                    </p>

                )}

                {/* ==================================
                    ERRO
                ================================== */}

                {!carregando && erro && (

                    <p className="montagem-erro">
                        ❌ {erro}
                    </p>

                )}

                {/* ==================================
                    NENHUM TUTORIAL
                ================================== */}

                {!carregando &&
                    !erro &&
                    montagensFiltradas.length === 0 && (

                        <p className="montagem-mensagem">
                            Não há tutoriais nesta categoria.
                        </p>

                    )}

                {/* ==================================
                    CARTÕES DE MONTAGEM
                ================================== */}

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

                {/* ==================================
                    DETALHES DO TUTORIAL
                ================================== */}

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

                            {/* ÁREA DO VÍDEO BLOQUEADA */}

                            <div
                                className="montagem-video"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    gap: "12px",
                                    background: "#171717",
                                    color: "#999",
                                    textAlign: "center",
                                    padding: "20px"
                                }}
                            >

                                <span style={{ fontSize: "45px" }}>
                                    🔒
                                </span>

                                <p>
                                    Conteúdo não disponível
                                </p>

                            </div>

                            {/* INFORMAÇÕES */}

                            <div className="montagem-detalhe-texto">

                                <h3>
                                    Sobre este tutorial
                                </h3>

                                <p>
                                    {selecionada.descricao}
                                </p>

                                <div className="montagem-info">

                                    <span>
                                        Categoria
                                    </span>

                                    <strong>
                                        {nomeCategoria(
                                            selecionada.categoria
                                        )}
                                    </strong>

                                </div>

                                <AvisoDireitosAutorais />

                            </div>

                        </div>

                    </section>

                )}

            </main>

        </>

    );

}
