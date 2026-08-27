import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">

            <div className="footer-inner">

                <div className="footer-logo">
                    <em>Manual</em> do Skatista
                </div>

                <span className="footer-copy">
                    Manual do Skatista © 2026 — Todos os direitos reservados
                </span>

                <div className="footer-links">

                    <Link href="/sobre">
                        Sobre
                    </Link>

                    <Link href="/login">
                        Entrar
                    </Link>

                </div>

            </div>

        </footer>
    );
}