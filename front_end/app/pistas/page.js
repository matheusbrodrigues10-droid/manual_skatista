import PageHeader from "../../components/PageHeader";
import { PISTAS_DEMO } from "../../lib/data";

export default function PistasPage() {
    return (
        <>
            <PageHeader
                icon="📍"
                titulo="Pistas"
                descricao={`Encontre as melhores pistas próximas a você. ${PISTAS_DEMO.length} pistas mapeadas.`}
            />

            <div className="section-page">

                <div
                    style={{
                        background: "var(--black-soft)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "var(--radius-md)",
                        padding: "2rem",
                        marginBottom: "2rem",
                        textAlign: "center",
                        opacity: 0.7
                    }}
                >
                    <div
                        style={{
                            fontSize: "2rem",
                            marginBottom: "0.5rem"
                        }}
                    >
                        🗺️
                    </div>

                    <div
                        style={{
                            fontFamily: "var(--font-condensed)",
                            fontSize: "0.75rem",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "var(--red)"
                        }}
                    >
                        Em breve
                    </div>

                    <p style={{ color: "var(--grey)" }}>
                        Mapa interativo com geolocalização
                    </p>

                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill,minmax(280px,1fr))",
                        gap: "1.25rem"
                    }}
                >

                    {PISTAS_DEMO.map((pista) => (
                        <div
                            className="pista-card"
                            key={pista.id}
                        >

                            <div className="pista-card-top">

                                <div>

                                    <div className="pista-name">
                                        {pista.nome}
                                    </div>

                                    <div className="pista-address">
                                        📌 {pista.address}
                                    </div>

                                </div>

                                <div
                                    className={`pista-tipo ${
                                        pista.tipo === "coberta"
                                            ? "pista-coberta"
                                            : "pista-livre"
                                    }`}
                                >
                                    {pista.tipo}
                                </div>

                            </div>

                            <p>
                                {pista.desc}
                            </p>

                            <div className="pista-rating">

                                {"★".repeat(
                                    Math.floor(pista.rating)
                                )}

                                {"☆".repeat(
                                    5 - Math.floor(pista.rating)
                                )}

                                <strong>
                                    {pista.rating}
                                </strong>

                                <span>
                                    ({pista.avaliacoes} avaliações)
                                </span>

                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </>
    );
}