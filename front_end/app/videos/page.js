import PageHeader from "../../components/PageHeader";

const videosLifestyle = [
    {
        id: "52FuKwsTXY8",
        titulo: "Competição SkateBoard Park Games 2021",
    },
    {
        id: "9825t602eiY",
        titulo: "Skate Life em Marselha, França",
    },
    {
        id: "yXdGL_ecEeQ",
        titulo: "Equipe Lifestyle Skate das antigas 1990",
    },
    {
        id: "KwPT6eePpDE",
        titulo: "1° EP Skate Life Luan Oliveira",
    },
    {
        id: "MS2yeiOKhGg",
        titulo: "2° EP Skate Life Luan Oliveira",
    },
    {
        id: "OL6V7GmDNqk",
        titulo: "3° EP Skate Life Luan Oliveira",
    },
];

const videosDicas = [
    {
        id: "y5ZsE3nmew4",
        titulo: "5 Dicas para evoluir mais rápido no skate",
    },
    {
        id: "nN7fDnIBPmc",
        titulo: "Como Dropar na Rampa",
    },
    {
        id: "vOoiKFP4Oow",
        titulo: "Como melhorar seu equilíbrio em cima do skate",
    },
    {
        id: "ZoLiDtmf454",
        titulo: "10 Dicas para não se machucar no Skate",
    },
    {
        id: "sIrLPzMtyl4",
        titulo: "Domine seu medo no Skate",
    },
];

function VideoCard({ video, categoria }) {
    return (
        <article className="dl-video-card">
            <div className="dl-video-frame">
                <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.titulo}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            </div>

            <div className="dl-video-info">
                <span className="dl-video-category">
                    {categoria}
                </span>

                <h3>{video.titulo}</h3>

                <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dl-video-link"
                >
                    Assistir no YouTube ↗
                </a>
            </div>
        </article>
    );
}

export default function VideosPage() {
    return (
        <>
            <PageHeader
                icon="🛹"
                titulo="Dicas e Lifestyle"
                descricao="Vivências do skate, sessões de rua e dicas para evoluir nas manobras."
            />

            <main className="dl-content">
                <section className="dl-section">
                    <div className="dl-section-intro">
                        <span className="dl-kicker">
                            CULTURA SKATE
                        </span>

                        <h2>
                            Lifestyle e <em>vivências</em>
                        </h2>

                        <p>
                            Competições, sessões, histórias e o
                            dia a dia de quem vive o skate.
                        </p>
                    </div>

                    <div className="dl-video-grid">
                        {videosLifestyle.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                categoria="Lifestyle"
                            />
                        ))}
                    </div>
                </section>

                <section className="dl-section">
                    <div className="dl-section-intro">
                        <span className="dl-kicker">
                            EVOLUA NO SKATE
                        </span>

                        <h2>
                            Dicas para <em>mandar bem</em>
                        </h2>

                        <p>
                            Aprenda técnicas, melhore seu equilíbrio,
                            enfrente desafios e evolua com mais segurança.
                        </p>
                    </div>

                    <div className="dl-video-grid">
                        {videosDicas.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                categoria="Dicas de skate"
                            />
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}