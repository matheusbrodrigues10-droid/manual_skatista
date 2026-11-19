
export async function registrarAcessoVideo(tipo, conteudoId) {
    try {
        const response = await fetch("/api/progresso", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tipo,
                conteudoId
            }),
            keepalive: true
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.erro || "Não foi possível registrar o vídeo."
            );
        }

        if (typeof window !== "undefined") {
            window.dispatchEvent(
                new Event("progressoAtualizado")
            );
        }

        return data;

    } catch (erro) {
        console.error("Erro ao registrar acesso:", erro);
        throw erro;
    }
}
