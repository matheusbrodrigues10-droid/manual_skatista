"use client";

import { useState } from "react";
import PageHeader from "./PageHeader";

const ROUPAS_DEMO = [
    {
        id: 1,
        marca: "Thrasher",
        nome: "Camiseta Flame Logo",
        categoria: "camiseta",
        desc: "Algodão pesado, gola careca, fit relaxado.",
        imagem: null,
        badge: "hot",
        uso_count: 847,
        lojas_online: [
            {
                nome: "Thrasher Store",
                url: "https://thrashermagazine.com"
            }
        ],
        lojas_fisicas:
            "Skate shops em São Paulo e Rio de Janeiro"
    },

    {
        id: 2,
        marca: "Vans",
        nome: "SK8-Hi MTE-2",
        categoria: "tenis",
        desc: "Cano alto com forro de lã sintética.",
        imagem: null,
        badge: "trending",
        uso_count: 612,
        lojas_online: [
            {
                nome: "Vans Brasil",
                url: "https://vans.com.br"
            }
        ],
        lojas_fisicas:
            "Lojas Vans e Centauro em todo Brasil"
    }
];

const CATEGORIAS = [
    {
        key: "todos",
        label: "Tudo",
        icon: "👁️"
    },
    {
        key: "camiseta",
        label: "Camisetas",
        icon: "👕"
    },
    {
        key: "short",
        label: "Shorts",
        icon: "🩳"
    },
    {
        key: "calca",
        label: "Calças",
        icon: "👖"
    },
    {
        key: "moletom",
        label: "Moletons",
        icon: "🧥"
    },
    {
        key: "tenis",
        label: "Tênis",
        icon: "👟"
    },
    {
        key: "acessorio",
        label: "Acessórios",
        icon: "🧢"
    }
];

export default function Roupas() {
    const [filtro, setFiltro] = useState("todos");
    const [produto, setProduto] = useState(null);

    const lista =
        filtro === "todos"
            ? ROUPAS_DEMO
            : ROUPAS_DEMO.filter(
                  (produto) =>
                      produto.categoria === filtro
              );

    return (
        <>
            <PageHeader
                icon="👕"
                titulo="Roupas"
                descricao="As marcas que entendem a cultura. Estilo e conforto para você arrasar na pista."
            />

            <div className="catalog-layout">

                <aside className="sidebar">

                    <div className="sidebar-header">
                        <span className="sidebar-title">
                            ☰ Filtros
                        </span>
                    </div>

                    <div className="sidebar-body">

                        <div className="filter-group">

                            <div className="filter-group-title">
                                Categoria
                            </div>

                            {CATEGORIAS.map(
                                (categoria) => (
                                    <button
                                        key={categoria.key}
                                        className={`filter-btn ${
                                            filtro ===
                                            categoria.key
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setFiltro(
                                                categoria.key
                                            )
                                        }
                                    >
                                        {categoria.icon}{" "}
                                        {categoria.label}
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                </aside>

                <div className="catalog-main">

                    <div className="catalog-toolbar">
                        <span className="catalog-count">
                            <strong>
                                {lista.length}
                            </strong>{" "}
                            peças encontradas
                        </span>
                    </div>

                    <div className="products-grid">

                        {lista.map((produto) => (
                            <div
                                className="product-card"
                                key={produto.id}
                                onClick={() =>
                                    setProduto(produto)
                                }
                            >

                                <div className="product-img-wrap">

                                    {produto.imagem ? (
                                        <img
                                            src={produto.imagem}
                                            alt={produto.nome}
                                        />
                                    ) : (
                                        <div className="product-img-placeholder">
                                            👕
                                        </div>
                                    )}

                                </div>

                                <div className="product-info">

                                    <div className="product-brand">
                                        {produto.marca}
                                    </div>

                                    <div className="product-name">
                                        {produto.nome}
                                    </div>

                                    <div className="product-category-tag">
                                        {
                                            CATEGORIAS.find(
                                                (x) =>
                                                    x.key ===
                                                    produto.categoria
                                            )?.label
                                        }
                                    </div>

                                    <div className="product-desc">
                                        {produto.desc}
                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

            </div>

            {produto && (
                <div
                    className="modal-overlay open"
                    onClick={() => setProduto(null)}
                >

                    <div
                        className="modal-box"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <button
                            className="modal-close"
                            onClick={() =>
                                setProduto(null)
                            }
                        >
                            ✕
                        </button>

                        <div className="product-brand">
                            {produto.marca}
                        </div>

                        <h2>
                            {produto.nome}
                        </h2>

                        <p className="sobre-text">
                            {produto.desc}
                        </p>

                        <p className="sobre-text">
                            📍 {produto.lojas_fisicas}
                        </p>

                    </div>

                </div>
            )}
        </>
    );
}