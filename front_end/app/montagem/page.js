import PageHeader from "../../components/PageHeader";
import { MONTAGEM_DEMO } from "../../lib/data";

export default function MontagemPage() {
    const categoria = {
        montagem: "Montagem",
        manutencao: "Manutenção",
        guia: "Guia"
    };

    return (
        <>
            <PageHeader
                icon="🔧"
                titulo="Montagem"
                descricao="Vídeos de montagem, manutenção e troca de peças do seu setup."
            />

            <div className="section-page">

                <div className="section-page-grid">

                    {MONTAGEM_DEMO.map((item) => (
                        <div
                            className="item-card"
                            key={item.id}
                        >

                            <span className="item-card-icon">
                                {item.icon}
                            </span>

                            <div className="item-card-level level-todos">
                                {categoria[item.categoria]}
                            </div>

                            <h3>
                                {item.nome}
                            </h3>

                            <p>
                                {item.desc}
                            </p>

                            <div className="item-card-meta">
                                ⏱ <span>{item.duracao}</span>
                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </>
    );
}