import Link from "next/link";

export default function Home({ usuario }) {
    return (
        <>
            {!usuario ? (
                <section className="hero">
                    <div className="hero-eyebrow">
                        Do iniciante ao avançado
                    </div>

                    <h1>
                        Manual do
                        <br />
                        <em>Skatista</em>
                    </h1>

                    <p>
                        Seu guia completo para dominar o skate.
                        Aprenda manobras, monte seu setup e
                        encontre as melhores pistas.
                    </p>

                    <div className="hero-actions">
                        <Link
                            href="/cadastro"
                            className="btn-hero-primary"
                        >
                            ▶ Começar agora
                        </Link>

                        <Link
                            href="/login"
                            className="btn-hero-secondary"
                        >
                            Já tenho conta
                        </Link>
                    </div>
                </section>
            ) : (
                <section className="welcome-banner">
                    <div className="hero-eyebrow">
                        Bem-vindo de volta
                    </div>

                    <h2>
                        E aí, <em>{usuario?.nome}</em>! 🛹
                    </h2>

                    <p>
                        Pronto para evoluir no skate hoje?
                    </p>
                </section>
            )}

            <div className="stat-strip">
                <div className="stat-strip-inner">
                    <div className="stat-item">
                        <span className="stat-number">12K+</span>
                        <span className="stat-label">Skatistas</span>
                    </div>

                    <div className="stat-divider"></div>

                    <div className="stat-item">
                        <span className="stat-number">340+</span>
                        <span className="stat-label">Manobras</span>
                    </div>

                    <div className="stat-divider"></div>

                    <div className="stat-item">
                        <span className="stat-number">80+</span>
                        <span className="stat-label">Pistas mapeadas</span>
                    </div>

                    <div className="stat-divider"></div>

                    <div className="stat-item">
                        <span className="stat-number">100%</span>
                        <span className="stat-label">Gratuito</span>
                    </div>
                </div>
            </div>

            <section className="services-section">
                <div className="section-label">
                    <span>O que você encontra</span>
                </div>

                <h2 className="services-title">
                    Tudo que você <em>precisa</em> na pista
                </h2>

                <div className="services-grid">
                    <Link
                        href="/manobras"
                        className="service-card"
                    >
                        <span className="service-icon">🛹</span>

                        <h3>Manobras</h3>

                        <p>
                            Do nível iniciante ao avançado,
                            aprenda cada trick com tutoriais em vídeo.
                        </p>

                        <div className="card-arrow">
                            Ver tudo →
                        </div>
                    </Link>

                    <Link
                        href="/montagem"
                        className="service-card"
                    >
                        <span className="service-icon">🔧</span>

                        <h3>Montagem</h3>

                        <p>
                            Vídeos de montagem, manutenção
                            e troca de peças do seu setup.
                        </p>

                        <div className="card-arrow">
                            Ver tudo →
                        </div>
                    </Link>

                    <Link
                        href="/pistas"
                        className="service-card"
                    >
                        <span className="service-icon">📍</span>

                        <h3>Pistas</h3>

                        <p>
                            Encontre as melhores pistas próximas
                            a você no mapa interativo.
                        </p>

                        <div className="card-arrow">
                            Ver mapa →
                        </div>
                    </Link>

                    <Link
                        href="/equipamentos"
                        className="service-card"
                    >
                        <span className="service-icon">⭐</span>

                        <h3>Equipamentos</h3>

                        <p>
                            Melhores custo-benefício para cada
                            estilo e nível de performance.
                        </p>

                        <div className="card-arrow">
                            Ver tudo →
                        </div>
                    </Link>

                    <Link
                        href="/roupas"
                        className="service-card"
                    >
                        <span className="service-icon">👕</span>

                        <h3>Roupas</h3>

                        <p>
                            Conforto e estilo para andar de skate
                            com marcas que entendem a cultura.
                        </p>

                        <div className="card-arrow">
                            Ver tudo →
                        </div>
                    </Link>

                    <Link
                        href="/videos"
                        className="service-card"
                    >
                        <span className="service-icon">🎥</span>

                        <h3>Vídeos</h3>

                        <p>
                            Coletâneas, edits e filmagens das
                            melhores sessões da comunidade.
                        </p>

                        <div className="card-arrow">
                            Assistir →
                        </div>
                    </Link>
                </div>
            </section>

            <div className="tape-divider"></div>
        </>
    );
}