"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import MapaPistas from "@/components/MapaPistas";

function formatarDistancia(metros) {
    if (metros < 1000) {
        return `${Math.round(metros)} m`;
    }

    return `${(metros / 1000).toFixed(1)} km`;
}

function formatarTempo(segundos) {
    const minutos =
        Math.round(segundos / 60);

    if (minutos < 60) {
        return `${minutos} min`;
    }

    const horas =
        Math.floor(minutos / 60);

    const resto =
        minutos % 60;

    if (resto === 0) {
        return `${horas}h`;
    }

    return `${horas}h ${resto}min`;
}

export default function PistasPage() {

    const [cep, setCep] = useState("");

    const [origem, setOrigem] =
        useState(null);

    const [pistas, setPistas] =
        useState([]);

    const [pistaSelecionada, setPistaSelecionada] =
        useState(null);

    const [rota, setRota] =
        useState(null);

    const [carregando, setCarregando] =
        useState(false);

    const [erro, setErro] =
        useState("");

    async function buscarPistas(event) {

        event.preventDefault();

        setErro("");
        setPistas([]);
        setPistaSelecionada(null);
        setRota(null);
        setOrigem(null);

        const cepLimpo =
            cep.replace(/\D/g, "");

        if (cepLimpo.length !== 8) {
            setErro(
                "Digite um CEP válido."
            );
            return;
        }

        setCarregando(true);

        try {

            const response =
                await fetch(
                    `/api/pistas/proximas?cep=${cepLimpo}`,
                    {
                        cache: "no-store"
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.erro ||
                    "Erro ao buscar pistas."
                );
            }

            setOrigem(
                data.origem
            );

            setPistas(
                data.pistas
            );

            if (!data.pistas.length) {
                setErro(
                    "Nenhuma pista foi encontrada."
                );
            }

        } catch (error) {

            console.error(error);

            setErro(
                error.message
            );

        } finally {

            setCarregando(false);

        }
    }

    async function selecionarPista(pista) {

        setPistaSelecionada(
            pista
        );

        setRota(null);
        setErro("");

        if (!origem) {
            return;
        }

        try {

            const params =
                new URLSearchParams({
                    origemLat:
                        String(origem.latitude),

                    origemLng:
                        String(origem.longitude),

                    destinoLat:
                        String(pista.latitude),

                    destinoLng:
                        String(pista.longitude)
                });

            const response =
                await fetch(
                    `/api/pistas/rota?${params}`,
                    {
                        cache: "no-store"
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.erro ||
                    "Erro ao calcular rota."
                );
            }

            setRota(data);

        } catch (error) {

            console.error(error);

            setErro(
                error.message
            );
        }
    }

    return (
        <>
            <PageHeader
                icon="📍"
                titulo="Pistas"
                descricao="Encontre as pistas de skate mais próximas da sua localização."
            />

            <div className="section-page">

                <form
                    onSubmit={buscarPistas}
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "2rem",
                        flexWrap: "wrap"
                    }}
                >

                    <input
                        type="text"
                        value={cep}
                        onChange={(e) =>
                            setCep(e.target.value)
                        }
                        placeholder="Digite seu CEP"
                        maxLength={9}
                        required
                        style={{
                            flex: 1,
                            minWidth: "220px",
                            padding:
                                "0.9rem 1rem",
                            background:
                                "var(--black-soft)",
                            color:
                                "var(--white)",
                            border:
                                "1px solid rgba(255,255,255,0.1)",
                            borderRadius:
                                "var(--radius-sm)"
                        }}
                    />

                    <button
                        type="submit"
                        className="btn"
                        style={{
                            width: "auto",
                            padding:
                                "0.9rem 2rem"
                        }}
                    >
                        {carregando
                            ? "BUSCANDO..."
                            : "BUSCAR PISTAS"}
                    </button>

                </form>

                {erro && (
                    <div
                        style={{
                            color:
                                "var(--red)",
                            marginBottom:
                                "1.5rem"
                        }}
                    >
                        ❌ {erro}
                    </div>
                )}

                {origem && (
                    <div
                        style={{
                            marginBottom:
                                "1.5rem",
                            color:
                                "var(--grey)"
                        }}
                    >
                        📍 Localização encontrada:

                        <strong
                            style={{
                                color:
                                    "var(--white)"
                            }}
                        >
                            {" "}
                            {origem.logradouro}
                            {origem.bairro
                                ? `, ${origem.bairro}`
                                : ""}
                            {" - "}
                            {origem.cidade}
                            {" - "}
                            {origem.estado}
                        </strong>
                    </div>
                )}

                {origem && (
                    <div
                        style={{
                            marginBottom:
                                "2rem"
                        }}
                    >

                        <MapaPistas
                            origem={origem}
                            pista={
                                pistaSelecionada
                            }
                            rota={rota}
                        />

                    </div>
                )}

                {pistaSelecionada &&
                    rota && (

                    <div
                        style={{
                            background:
                                "var(--black-soft)",
                            border:
                                "1px solid rgba(215,38,56,0.3)",
                            borderRadius:
                                "var(--radius-md)",
                            padding:
                                "1.5rem",
                            marginBottom:
                                "2rem"
                        }}
                    >

                        <div
                            className="pista-name"
                        >
                            🛹{" "}
                            {
                                pistaSelecionada.nome
                            }
                        </div>

                        <div
                            style={{
                                display:
                                    "flex",
                                gap:
                                    "2rem",
                                marginTop:
                                    "0.75rem",
                                flexWrap:
                                    "wrap"
                            }}
                        >

                            <div>
                                📏{" "}
                                <strong>
                                    {
                                        formatarDistancia(
                                            rota.distancia
                                        )
                                    }
                                </strong>
                            </div>

                            <div>
                                ⏱️{" "}
                                <strong>
                                    {
                                        formatarTempo(
                                            rota.duracao
                                        )
                                    }
                                </strong>
                            </div>

                        </div>

                    </div>
                )}

                {pistas.length > 0 && (

                    <div>

                        <div
                            style={{
                                marginBottom:
                                    "1rem",
                                color:
                                    "var(--grey)"
                            }}
                        >
                            <strong
                                style={{
                                    color:
                                        "var(--white)"
                                }}
                            >
                                {pistas.length}
                            </strong>{" "}
                            pistas encontradas,
                            da mais próxima para
                            a mais distante
                        </div>

                        <div
                            className="section-page-grid"
                        >

                            {pistas.map(
                                (pista) => (

                                    <button
                                        key={
                                            pista.id
                                        }
                                        onClick={() =>
                                            selecionarPista(
                                                pista
                                            )
                                        }
                                        className="pista-card"
                                        style={{
                                            textAlign:
                                                "left",
                                            color:
                                                "inherit",
                                            font:
                                                "inherit",
                                            cursor:
                                                "pointer"
                                        }}
                                    >

                                        <div
                                            className="pista-card-top"
                                        >

                                            <div>

                                                <div
                                                    className="pista-name"
                                                >
                                                    {
                                                        pista.nome
                                                    }
                                                </div>

                                                <div
                                                    className="pista-address"
                                                >
                                                    📌{" "}
                                                    {
                                                        pista.endereco
                                                    }
                                                </div>

                                            </div>

                                            <div
                                                className={`pista-tipo ${
                                                    pista.tipo ===
                                                    "coberta"
                                                        ? "pista-coberta"
                                                        : "pista-livre"
                                                }`}
                                            >
                                                {
                                                    pista.tipo
                                                }
                                            </div>

                                        </div>

                                        <p>
                                            {
                                                pista.descricao
                                            }
                                        </p>

                                        <div
                                            className="pista-rating"
                                        >
                                            📍{" "}

                                            <strong>
                                                {
                                                    formatarDistancia(
                                                        pista.distancia
                                                    )
                                                }
                                            </strong>

                                            <span>
                                                {" "}
                                                •{" "}
                                                {
                                                    formatarTempo(
                                                        pista.duracao
                                                    )
                                                }
                                            </span>
                                        </div>

                                    </button>

                                )
                            )}

                        </div>

                    </div>
                )}

            </div>
        </>
    );
}