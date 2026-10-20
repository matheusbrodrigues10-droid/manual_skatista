"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";

const categorias = [
    { valor: "todos", texto: "👁 Todo" },
    { valor: "camiseta", texto: "👕 Camisetas" },
    { valor: "moletom", texto: "🧥 Moletons" },
    { valor: "shorts", texto: "🩳 Shorts" },
    { valor: "calca", texto: "👖 Calças" },
    { valor: "tenis", texto: "👟 Tênis" },
    { valor: "acessorios", texto: "🧢 Acessórios" }
];

const faixas = [
    { valor: "todas", texto: "Todas as faixas" },
    { valor: "custo_beneficio", texto: "Custo-benefício" },
    { valor: "intermediario", texto: "Intermediário" },
    { valor: "premium", texto: "Avançado / Premium" }
];

const nomesCategoria = {
    camiseta: "Camisetas",
    moletom: "Moletons",
    shorts: "Shorts / Bermudas",
    calca: "Calças",
    tenis: "Tênis",
    bone: "Bonés",
    touca: "Toucas / Gorros"
};

const nomesFaixa = {
    custo_beneficio: "Custo-benefício",
    intermediario: "Intermediário",
    premium: "Avançado / Premium"
};

function ImagemRoupa({ roupa }) {
    const [falhou, setFalhou] = useState(false);

    if (!roupa.imagem_url || falhou) {
        return (
            <div className="roupa-imagem-placeholder">
                <span>{roupa.icone || "👕"}</span>
                <small>Imagem não cadastrada</small>
            </div>
        );
    }

    return (
        <img
            src={roupa.imagem_url}
            alt={roupa.nome}
            className="roupa-imagem"
            loading="lazy"
            onError={() => setFalhou(true)}
        />
    );
}

export default function Roupas() {
    const router = useRouter();

    const [roupas, setRoupas] = useState([]);
    const [categoria, setCategoria] = useState("todos");
    const [faixa, setFaixa] = useState("todas");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativa = true;

        async function carregarRoupas() {
            try {
                const response = await fetch(
                    "/api/roupas",
                    { cache: "no-store" }
                );

                if (response.status === 401) {
                    router.replace(
                        "/login?redirect=%2Froupas"
                    );
                    return;
                }

                const dados = await response.json();

                if (!response.ok) {
                    throw new Error(
                        dados.erro ||
                        "Não foi possível carregar as roupas."
                    );
                }

                if (ativa) {
                    setRoupas(
                        Array.isArray(dados) ? dados : []
                    );
                }

            } catch (error) {
                console.error(
                    "Erro ao carregar roupas:",
                    error
                );

                if (ativa) {
                    setErro(
                        error.message ||
                        "Erro ao carregar as roupas."
                    );
                }

            } finally {
                if (ativa) {
                    setCarregando(false);
                }
            }
        }

        carregarRoupas();

        return () => {
            ativa = false;
        };
    }, [router]);

    const roupasFiltradas = useMemo(() => {
        return roupas.filter((roupa) => {
            const categoriaCorreta =
                categoria === "todos" ||
                (
                    categoria === "acessorios"
                        ? ["bone", "touca"].includes(
                            roupa.categoria
                        )
                        : roupa.categoria === categoria
                );

            const faixaCorreta =
                faixa === "todas" ||
                roupa.faixa === faixa;

            return categoriaCorreta && faixaCorreta;
        });
    }, [roupas, categoria, faixa]);

    return (
        <>
            <PageHeader
                icon="👕"
                titulo="Roupas"
                descricao="As marcas que entendem a cultura. Estilo e conforto para você andar de skate."
            />

            <main className="roupas-conteudo">
                <div className="roupas-layout">

                    <aside className="roupas-sidebar">
                        <div className="roupas-sidebar-titulo">
                            ☰ FILTROS
                        </div>

                        <div className="roupas-sidebar-secao">
                            <h3>Categoria</h3>

                            <nav aria-label="Categorias de roupas">
                                {categorias.map((item) => (
                                    <button
                                        key={item.valor}
                                        type="button"
                                        className={`roupas-categoria ${
                                            categoria === item.valor
                                                ? "roupas-categoria-ativa"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setCategoria(item.valor)
                                        }
                                        aria-pressed={
                                            categoria === item.valor
                                        }
                                    >
                                        {item.texto}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="roupas-sidebar-secao">
                            <h3>Faixa</h3>

                            <label
                                htmlFor="filtro-faixa"
                                className="roupas-label"
                            >
                                Estilo / posicionamento
                            </label>

                            <select
                                id="filtro-faixa"
                                value={faixa}
                                onChange={(event) =>
                                    setFaixa(event.target.value)
                                }
                                className="roupas-select"
                            >
                                {faixas.map((item) => (
                                    <option
                                        key={item.valor}
                                        value={item.valor}
                                    >
                                        {item.texto}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </aside>

                    <section className="roupas-resultados">
                        <div className="roupas-resultados-topo">
                            <p>
                                <strong>
                                    {roupasFiltradas.length}
                                </strong>{" "}
                                {roupasFiltradas.length === 1
                                    ? "peça encontrada"
                                    : "peças encontradas"}
                            </p>
                        </div>

                        {carregando && (
                            <p className="roupas-mensagem">
                                Carregando roupas...
                            </p>
                        )}

                        {!carregando && erro && (
                            <p className="roupas-erro">
                                ❌ {erro}
                            </p>
                        )}

                        {!carregando &&
                            !erro &&
                            roupasFiltradas.length === 0 && (
                                <p className="roupas-mensagem">
                                    Nenhuma peça encontrada para esses filtros.
                                </p>
                            )}

                        {!carregando &&
                            !erro &&
                            roupasFiltradas.length > 0 && (
                                <div className="roupas-grid">
                                    {roupasFiltradas.map((roupa) => (
                                        <article
                                            key={roupa.id}
                                            className="roupa-card"
                                        >
                                            <a
                                                href={roupa.produto_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="roupa-imagem-link"
                                                aria-label={`Ver ${roupa.nome} na loja`}
                                            >
                                                <ImagemRoupa roupa={roupa} />
                                            </a>

                                            <div className="roupa-card-corpo">
                                                <span className="roupa-marca">
                                                    MANUAL DO SKATISTA
                                                </span>

                                                <h2>{roupa.nome}</h2>

                                                <span className="roupa-badge-categoria">
                                                    {nomesCategoria[roupa.categoria]}
                                                </span>

                                                <span
                                                    className={`roupa-badge-faixa roupa-faixa-${roupa.faixa}`}
                                                >
                                                    {nomesFaixa[roupa.faixa]}
                                                </span>

                                                <p className="roupa-descricao">
                                                    {roupa.descricao}
                                                </p>

                                                <a
                                                    href={roupa.produto_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="roupa-link-produto"
                                                >
                                                    VER NA LOJA ↗
                                                </a>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                    </section>
                </div>
            </main>
        </>
    );
}