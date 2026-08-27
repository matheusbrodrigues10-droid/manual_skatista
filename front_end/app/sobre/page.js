import Link from "next/link";

export default function SobrePage() {
    return (
        <div className="form-container">

            <h2>
                Sobre Nós
            </h2>

            <p className="form-subtitle">
                Conheça o projeto
            </p>

            <p className="sobre-text">
                O Manual do Skatista é um projeto de TCC
                desenvolvido para ajudar skatistas de todos
                os níveis a evoluir no esporte.
            </p>

            <p className="sobre-text">
                Nossa missão é fornecer conteúdo de qualidade
                sobre manobras, equipamentos, pistas e tudo
                relacionado ao universo do skate.
            </p>

            <Link
                href="/"
                className="btn btn-voltar"
            >
                ← Voltar
            </Link>

        </div>
    );
}