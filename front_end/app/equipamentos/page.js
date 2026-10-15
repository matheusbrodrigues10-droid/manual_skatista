"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";

const categorias = [
    { valor: "todos", texto: "Todos" },
    { valor: "shape", texto: "Shapes" },
    { valor: "roda", texto: "Rodas" },
    { valor: "rolamento", texto: "Rolamentos" },
    { valor: "parafuso", texto: "Parafusos" },
    { valor: "truck", texto: "Trucks" },
    { valor: "lixa", texto: "Lixas" },
    { valor: "skate_montado", texto: "Skates montados" }
];

const niveis = [
    { valor: "todos", texto: "Todos os níveis" },
    { valor: "iniciante", texto: "Iniciante" },
    { valor: "intermediario", texto: "Intermediário" },
    { valor: "avancado", texto: "Avançado" }
];

const nomesNiveis = {
    iniciante: "Iniciante",
    intermediario: "Intermediário",
    avancado: "Avançado"
};

const nomesCategorias = {
    shape: "Shape",
    roda: "Roda",
    rolamento: "Rolamento",
    parafuso: "Parafuso de base",
    truck: "Truck",
    lixa: "Lixa",
    skate_montado: "Skate montado"
};

function ImagemEquipamento({ equipamento }) {
    const [falhou, setFalhou] = useState(false);

    if (!equipamento.imagem_url || falhou) {
        return (
            <div className="equipamento-imagem-placeholder">
                <span>{equipamento.icone || "🛹"}</span>
                <small>
                    Imagem do produto não cadastrada
                </small>
            </div>
        );
    }

    return (
        <img
            src={equipamento.imagem_url}
            alt={equipamento.nome}
            className="equipamento-imagem"
            loading="lazy"
            onError={() => setFalhou(true)}
        />
    );
}

export default function EquipamentosPage() {
    const router = useRouter();

    const [equipamentos, setEquipamentos] = useState([]);
    const [categoria, setCategoria] = useState("todos");
    const [nivel, setNivel] = useState("todos");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarEquipamentos() {
            try {
                const response = await fetch(
                    "/api/equipamentos",
                    {
                        cache: "no-store"
                    }
                );

                if (response.status === 401) {
                    router.replace(
                        "/login?redirect=%2Fequipamentos"
                    );
                    return;
                }

                const dados = await response.json();

                if (!response.ok) {
                    throw new Error(
                        dados.erro ||
                        "Não foi possível carregar os equipamentos."
                    );
                }

                if (ativo) {
                    setEquipamentos(
                        Array.isArray(dados) ? dados : []
                    );
                }

            } catch (error) {
                console.error(
                    "Erro ao carregar equipamentos:",
                    error
                );

                if (ativo) {
                    setErro(
                        error.message ||
                        "Erro ao carregar equipamentos."
                    );
                }

            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarEquipamentos();

        return () => {
            ativo = false;
        };
    }, [router]);

    const filtrados = useMemo(() => {
        return equipamentos.filter((item) => {
            const categoriaCorreta =
                categoria === "todos" ||
                item.categoria === categoria;

            const nivelCorreto =
                nivel === "todos" ||
                item.nivel === nivel;

            return categoriaCorreta && nivelCorreto;
        });
    }, [equipamentos, categoria, nivel]);

    return (
        <>
            <PageHeader
                icon="⭐"
                titulo="Equipamentos"
                descricao="Encontre peças para seu skate de acordo com seu estilo e nível de experiência."
            />

            <main className="equipamentos-conteudo">
                <div className="equipamentos-filtros">
                    <div
                        className="equipamentos-categorias"
                        aria-label="Categorias de equipamentos"
                    >
                        {categorias.map((item) => (
                            <button
                                key={item.valor}
                                type="button"
                                className={`equipamento-filtro ${
                                    categoria === item.valor
                                        ? "equipamento-filtro-ativo"
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
                    </div>

                    <div className="equipamentos-filtro-nivel">
                        <label htmlFor="filtro-nivel">
                            Nível de experiência
                        </label>

                        <select
                            id="filtro-nivel"
                            value={nivel}
                            onChange={(event) =>
                                setNivel(event.target.value)
                            }
                        >
                            {niveis.map((item) => (
                                <option
                                    key={item.valor}
                                    value={item.valor}
                                >
                                    {item.texto}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {carregando && (
                    <p className="equipamentos-mensagem">
                        Carregando equipamentos...
                    </p>
                )}

                {!carregando && erro && (
                    <p className="equipamentos-erro">
                        ❌ {erro}
                    </p>
                )}

                {!carregando &&
                    !erro &&
                    equipamentos.length === 0 && (
                        <p className="equipamentos-mensagem">
                            Nenhum equipamento cadastrado.
                        </p>
                    )}

                {!carregando &&
                    !erro &&
                    equipamentos.length > 0 && (
                        <>
                            <p className="equipamentos-contagem">
                                <strong>{filtrados.length}</strong>{" "}
                                {filtrados.length === 1
                                    ? "equipamento encontrado"
                                    : "equipamentos encontrados"}
                            </p>

                            {filtrados.length === 0 ? (
                                <p className="equipamentos-mensagem">
                                    Não há equipamentos para esses filtros.
                                </p>
                            ) : (
                                <div className="equipamentos-grid">
                                    {filtrados.map((item) => (
                                        <article
                                            className="equipamento-card"
                                            key={item.id}
                                        >
                                            <a
                                                href={item.produto_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="equipamento-imagem-link"
                                                aria-label={`Ver ${item.nome} na loja`}
                                            >
                                                <ImagemEquipamento
                                                    equipamento={item}
                                                />
                                            </a>

                                            <div className="equipamento-card-corpo">
                                                <div className="equipamento-etiquetas">
                                                    <span className="equipamento-badge equipamento-badge-categoria">
                                                        {nomesCategorias[item.categoria] ||
                                                            item.categoria}
                                                    </span>

                                                    <span
                                                        className={`equipamento-badge equipamento-badge-${item.nivel}`}
                                                    >
                                                        {nomesNiveis[item.nivel] ||
                                                            item.nivel}
                                                    </span>
                                                </div>

                                                <h2>
                                                    {item.nome}
                                                </h2>

                                                <p className="equipamento-descricao">
                                                    {item.descricao}
                                                </p>

                                                <a
                                                    href={item.produto_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="equipamento-link"
                                                >
                                                    Ver produto na loja ↗
                                                </a>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
            </main>
        </>
    );
}