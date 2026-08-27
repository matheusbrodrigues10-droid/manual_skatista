import PageHeader from "../../components/PageHeader";
import { VIDEOS_DEMO } from "../../lib/data";

export default function VideosPage() {
    return (
        <>
            <PageHeader
                icon="🎥"
                titulo="Vídeos"
                descricao="Coletâneas, edits e filmagens das melhores sessões da comunidade."
            />

            <div className="section-page">

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill,minmax(260px,1fr))",
                        gap: "1.25rem"
                    }}
                >

                    {VIDEOS_DEMO.map((video) => (
                        <div
                            className="video-card"
                            key={video.id}
                        >

                            <div className="video-thumb">

                                {video.thumbnail ? (
                                    <img
                                        className="video-thumb-img"
                                        src={video.thumbnail}
                                        alt={video.titulo}
                                    />
                                ) : (
                                    <div className="video-placeholder">
                                        🎬
                                    </div>
                                )}

                                <div className="video-play-btn">
                                    ▶
                                </div>

                            </div>

                            <div className="video-info">

                                <div className="video-category">
                                    {video.categoria}
                                </div>

                                <div className="video-title">
                                    {video.titulo}
                                </div>

                                <div className="video-meta">
                                    📺 {video.canal}
                                    {" • "}
                                    ⏱ {video.duracao}
                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </>
    );
}