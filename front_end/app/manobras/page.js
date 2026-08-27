import PageHeader from "../../components/PageHeader";
import { MANOBRAS_DEMO } from "../../lib/data";

export default function ManobrasPage() {
    return (
        <>
            <PageHeader
                icon="🛹"
                titulo="Manobras"
                descricao={`Do iniciante ao avançado, aprenda cada trick com tutoriais em vídeo. ${MANOBRAS_DEMO.length} manobras catalogadas.`}
            />

            <div className="section-page">

                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        marginBottom: "1.5rem"
                    }}
                >
                    <button className="filter-btn active">
                        Todos
                    </button>

                    <button className="filter-btn">
                        🟢 Iniciante
                    </button>

                    <button className="filter-btn">
                        🟡 Intermediário
                    </button>

                    <button className="filter-btn">
                        🔴 Avançado
                    </button>
                </div>

                <div className="section-page-grid">

                    {MANOBRAS_DEMO.map((m) => (
                        <div
                            key={m.id}
                            className="item-card"
                        >

                            <span className="item-card-icon">
                                {m.icon}
                            </span>

                            <div className={`item-card-level ${
                                m.nivel === "iniciante"
                                    ? "level-iniciante"
                                    : m.nivel === "intermediario"
                                    ? "level-intermediario"
                                    : "level-avancado"
                            }`}>
                                {m.nivel}
                            </div>

                            <h3>
                                {m.nome}
                            </h3>

                            <p>
                                {m.desc}
                            </p>

                            <div className="item-card-meta">
                                ⏱ Tempo estimado:
                                <span>
                                    {m.duracao}
                                </span>
                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </>
    );
}