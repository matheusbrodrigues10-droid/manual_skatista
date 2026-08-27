import PageHeader from "../../components/PageHeader";
import { EQUIPAMENTOS_DEMO } from "../../lib/data";

export default function EquipamentosPage() {
    return (
        <>
            <PageHeader
                icon="⭐"
                titulo="Equipamentos"
                descricao="Melhores custo-benefício para cada estilo e nível de performance."
            />

            <div className="section-page">

                <div className="section-page-grid">

                    {EQUIPAMENTOS_DEMO.map((item) => (
                        <div
                            className="item-card"
                            key={item.id}
                        >

                            <span className="item-card-icon">
                                {item.icon}
                            </span>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "6px",
                                    marginBottom: "0.5rem"
                                }}
                            >
                                <div className="item-card-level level-todos">
                                    {item.categoria}
                                </div>

                                <div className="item-card-level level-intermediario">
                                    {item.nivel}
                                </div>
                            </div>

                            <h3>
                                {item.nome}
                            </h3>

                            <p>
                                {item.desc}
                            </p>

                            <div className="item-card-meta">
                                💰 Referência:
                                <span>
                                    {item.preco_ref}
                                </span>
                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </>
    );
}