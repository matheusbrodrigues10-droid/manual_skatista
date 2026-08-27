import Link from "next/link";

export default function PageHeader({
    icon,
    titulo,
    descricao
}) {
    return (
        <div className="page-header">

            <div className="page-header-inner">

                <Link
                    href="/"
                    className="page-back"
                >
                    ← Voltar
                </Link>

                <h1>
                    {icon} <em>{titulo}</em>
                </h1>

                <p>
                    {descricao}
                </p>

            </div>

        </div>
    );
}   