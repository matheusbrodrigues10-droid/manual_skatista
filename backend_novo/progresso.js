
const express = require("express");
const db = require("./db");

const router = express.Router();

// =====================================================
// CONSULTAS AO MYSQL
// =====================================================

function consultar(sql, parametros = []) {
    return new Promise((resolve, reject) => {
        db.query(sql, parametros, (erro, resultado) => {
            if (erro) reject(erro);
            else resolve(resultado);
        });
    });
}

// =====================================================
// SEGURANÇA
// =====================================================

function validarToken(req, res, next) {
    const token = process.env.PROGRESSO_API_TOKEN;

    if (
        !token ||
        req.headers["x-progresso-token"] !== token
    ) {
        return res.status(403).json({
            erro: "Acesso não autorizado."
        });
    }

    next();
}

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function normalizarTexto(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function identificarNivel(nome) {
    const nivel = normalizarTexto(nome);

    if (nivel.includes("iniciante")) return "iniciante";
    if (nivel.includes("intermediario")) return "intermediario";
    if (nivel.includes("avancado")) return "avancado";

    return null;
}

async function buscarUsuario(usuarioId) {
    const resultado = await consultar(
        `SELECT
            u.id,
            u.nivel_id,
            n.descricao AS nivel
         FROM usuarios u
         LEFT JOIN nivel_skate n ON n.id = u.nivel_id
         WHERE u.id = ?
         LIMIT 1`,
        [usuarioId]
    );

    return resultado[0] || null;
}

// =====================================================
// SORTEAR CINCO VÍDEOS DE LIFESTYLE
// =====================================================

async function obterLifestyleSelecionados(usuarioId) {

    // Remove vídeos que foram desativados ou excluídos.
    await consultar(
        `DELETE s
         FROM progresso_lifestyle_selecionados s
         LEFT JOIN videos_lifestyle v ON v.id = s.video_id
         WHERE s.usuario_id = ?
           AND (
               v.id IS NULL
               OR v.ativo <> 1
               OR v.video_url IS NULL
               OR TRIM(v.video_url) = ''
           )`,
        [usuarioId]
    );

    let selecionados = await consultar(
        `SELECT video_id
         FROM progresso_lifestyle_selecionados
         WHERE usuario_id = ?`,
        [usuarioId]
    );

    if (selecionados.length < 5) {

        const idsExistentes = selecionados.map(
            item => Number(item.video_id)
        );

        const quantidade = 5 - idsExistentes.length;

        let sql = `
            SELECT id
            FROM videos_lifestyle
            WHERE ativo = 1
              AND video_url IS NOT NULL
              AND TRIM(video_url) <> ''
        `;

        const parametros = [];

        if (idsExistentes.length > 0) {
            sql += `
                AND id NOT IN (
                    ${idsExistentes.map(() => "?").join(",")}
                )
            `;

            parametros.push(...idsExistentes);
        }

        sql += " ORDER BY RAND() LIMIT ?";
        parametros.push(quantidade);

        const novosVideos = await consultar(sql, parametros);

        for (const video of novosVideos) {
            await consultar(
                `INSERT IGNORE INTO
                    progresso_lifestyle_selecionados
                    (usuario_id, video_id)
                 VALUES (?, ?)`,
                [usuarioId, video.id]
            );
        }
    }

    return consultar(
        `SELECT
            v.id,
            v.titulo,
            v.video_url
         FROM progresso_lifestyle_selecionados s
         INNER JOIN videos_lifestyle v
            ON v.id = s.video_id
         WHERE s.usuario_id = ?
         ORDER BY s.selecionado_em ASC`,
        [usuarioId]
    );
}

// =====================================================
// CALCULAR PROGRESSO
// =====================================================

async function calcularProgresso(usuarioId, permitirAvanco = true) {

    const usuario = await buscarUsuario(usuarioId);

    if (!usuario) {
        throw new Error("Usuário não encontrado.");
    }

    const nivel = identificarNivel(usuario.nivel);

    // =========================================
    // NÍVEL AVANÇADO
    // =========================================

    if (nivel === "avancado") {
        return {
            nivelAtual: usuario.nivel,
            proximoNivel: null,
            percentual: 100,
            totalConcluidos: 0,
            totalNecessarios: 0,
            nivelMaximo: true,
            mensagem: "Parabéns! Você alcançou o nível Avançado!",
            etapas: [],
            videosLifestyle: []
        };
    }

    if (!nivel) {
        throw new Error("Nível do usuário não reconhecido.");
    }

    // =========================================
    // BUSCAR CONTEÚDOS
    // =========================================

    const [manobras, montagens, registros] =
        await Promise.all([

            consultar(
                `SELECT id, nivel
                 FROM manobras
                 WHERE ativo = 1
                   AND video_url IS NOT NULL
                   AND TRIM(video_url) <> ''`
            ),

            consultar(
                `SELECT id, categoria
                 FROM montagens
                 WHERE ativo = 1
                   AND video_url IS NOT NULL
                   AND TRIM(video_url) <> ''`
            ),

            consultar(
                `SELECT tipo_conteudo, conteudo_id
                 FROM progresso_conteudos
                 WHERE usuario_id = ?`,
                [usuarioId]
            )
        ]);

    const concluidos = new Set(
        registros.map(item =>
            `${item.tipo_conteudo}:${Number(item.conteudo_id)}`
        )
    );

    // =========================================
    // DEFINIR OBJETIVOS DO NÍVEL
    // =========================================

    let tarefas = [];
    let videosLifestyle = [];
    let proximoNivel = "";

    // =========================================
    // INICIANTE PARA INTERMEDIÁRIO
    // =========================================

    if (nivel === "iniciante") {

        proximoNivel = "Intermediário";

        const manobrasIniciantes = manobras
            .filter(item =>
                identificarNivel(item.nivel) === "iniciante"
            )
            .map(item => Number(item.id));

        const manobrasIntermediarias = manobras
            .filter(item =>
                identificarNivel(item.nivel) === "intermediario"
            )
            .map(item => Number(item.id));

        const videosMontagem = montagens
            .filter(item =>
                normalizarTexto(item.categoria).includes("montagem")
            )
            .map(item => Number(item.id));

        tarefas = [
            {
                titulo: "Todas as manobras de nível Iniciante",
                tipo: "manobra",
                ids: manobrasIniciantes,
                total: manobrasIniciantes.length
            },
            {
                titulo: "Todos os vídeos de Montagem",
                tipo: "montagem",
                ids: videosMontagem,
                total: videosMontagem.length
            },
            {
                titulo: "Pelo menos 2 manobras de nível Intermediário",
                tipo: "manobra",
                ids: manobrasIntermediarias,
                total: 2
            }
        ];
    }

    // =========================================
    // INTERMEDIÁRIO PARA AVANÇADO
    // =========================================

    if (nivel === "intermediario") {

        proximoNivel = "Avançado";

        const manobrasIntermediariasEAvancadas =
            manobras
                .filter(item => {
                    const nivelManobra =
                        identificarNivel(item.nivel);

                    return (
                        nivelManobra === "intermediario" ||
                        nivelManobra === "avancado"
                    );
                })
                .map(item => Number(item.id));

        const videosManutencao = montagens
            .filter(item =>
                normalizarTexto(item.categoria).includes("manutencao")
            )
            .map(item => Number(item.id));

        videosLifestyle =
            await obterLifestyleSelecionados(usuarioId);

        tarefas = [
            {
                titulo: "Todas as manobras Intermediárias e Avançadas",
                tipo: "manobra",
                ids: manobrasIntermediariasEAvancadas,
                total: manobrasIntermediariasEAvancadas.length
            },
            {
                titulo: "Todos os vídeos de Manutenção",
                tipo: "manutencao",
                ids: videosManutencao,
                total: videosManutencao.length
            },
            {
                titulo: "5 vídeos aleatórios de Dicas e Lifestyle",
                tipo: "lifestyle",
                ids: videosLifestyle.map(video => Number(video.id)),
                total: 5
            }
        ];
    }

    // =========================================
    // CALCULAR ETAPAS
    // =========================================

    const etapas = tarefas.map(tarefa => {

        const quantidadeConcluida = tarefa.ids.filter(id =>
            concluidos.has(`${tarefa.tipo}:${id}`)
        ).length;

        const disponivel =
            tarefa.total > 0 &&
            tarefa.ids.length >= tarefa.total &&
            (
                tarefa.tipo !== "lifestyle" ||
                videosLifestyle.length === 5
            );

        const concluidosEtapa = Math.min(
            quantidadeConcluida,
            tarefa.total
        );

        return {
            titulo: tarefa.titulo,
            concluidos: concluidosEtapa,
            total: tarefa.total,

            percentual: disponivel
                ? Math.round(
                    (concluidosEtapa / tarefa.total) * 100
                )
                : 0,

            disponivel,

            completo:
                disponivel &&
                quantidadeConcluida >= tarefa.total
        };
    });

    const totalConcluidos = etapas.reduce(
        (soma, etapa) => soma + etapa.concluidos,
        0
    );

    const totalNecessarios = etapas.reduce(
        (soma, etapa) => soma + etapa.total,
        0
    );

    const percentual = totalNecessarios > 0
        ? Math.round(
            (totalConcluidos / totalNecessarios) * 100
        )
        : 0;

    const todasConcluidas =
        etapas.length > 0 &&
        etapas.every(etapa => etapa.disponivel && etapa.completo);

    // =========================================
    // PROMOVER AUTOMATICAMENTE
    // =========================================

    if (permitirAvanco && todasConcluidas) {

        const niveis = await consultar(
            `SELECT id, descricao FROM nivel_skate`
        );

        const proximoSlug =
            nivel === "iniciante"
                ? "intermediario"
                : "avancado";

        const nivelEncontrado = niveis.find(item =>
            identificarNivel(item.descricao) === proximoSlug
        );

        if (!nivelEncontrado) {
            throw new Error(
                "Próximo nível não encontrado na tabela nivel_skate."
            );
        }

        await consultar(
            `UPDATE usuarios
             SET nivel_id = ?
             WHERE id = ?
               AND nivel_id = ?`,
            [
                nivelEncontrado.id,
                usuarioId,
                usuario.nivel_id
            ]
        );

        return calcularProgresso(usuarioId, false);
    }

    // =========================================
    // STATUS DOS VÍDEOS LIFESTYLE
    // =========================================

    const lifestyleComStatus = videosLifestyle.map(video => ({
        id: Number(video.id),
        titulo: video.titulo,
        url: video.video_url,
        concluido: concluidos.has(
            `lifestyle:${Number(video.id)}`
        )
    }));

    return {
        nivelAtual: usuario.nivel,
        proximoNivel,
        percentual,
        totalConcluidos,
        totalNecessarios,
        nivelMaximo: false,
        mensagem: todasConcluidas
            ? "Etapas concluídas!"
            : "Continue acessando os vídeos para evoluir!",
        etapas,
        videosLifestyle: lifestyleComStatus
    };
}

// =====================================================
// CONSULTAR PROGRESSO
// =====================================================

router.get(
    "/progresso/:usuarioId",
    validarToken,
    async (req, res) => {

        try {
            const usuarioId = Number(req.params.usuarioId);

            if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
                return res.status(400).json({
                    erro: "Identificador inválido."
                });
            }

            const progresso = await calcularProgresso(usuarioId);

            return res.json(progresso);

        } catch (erro) {
            console.error("ERRO NO PROGRESSO:", erro);

            return res.status(500).json({
                erro: erro.message
            });
        }
    }
);

// =====================================================
// REGISTRAR CONTEÚDO ACESSADO
// =====================================================

router.post(
    "/progresso/:usuarioId/concluir",
    validarToken,
    async (req, res) => {

        try {
            const usuarioId = Number(req.params.usuarioId);
            const conteudoId = Number(req.body.conteudoId);
            const tipo = String(req.body.tipo || "");

            const tiposPermitidos = [
                "manobra",
                "montagem",
                "manutencao",
                "lifestyle"
            ];

            if (
                !Number.isInteger(usuarioId) ||
                usuarioId <= 0 ||
                !Number.isInteger(conteudoId) ||
                conteudoId <= 0 ||
                !tiposPermitidos.includes(tipo)
            ) {
                return res.status(400).json({
                    erro: "Dados inválidos."
                });
            }

            let conteudo = [];

            // MANOBRAS
            if (tipo === "manobra") {
                conteudo = await consultar(
                    `SELECT id
                     FROM manobras
                     WHERE id = ?
                       AND ativo = 1
                       AND video_url IS NOT NULL
                       AND TRIM(video_url) <> ''`,
                    [conteudoId]
                );
            }

            // MONTAGEM
            if (tipo === "montagem" || tipo === "manutencao") {

                const registros = await consultar(
                    `SELECT id, categoria
                     FROM montagens
                     WHERE id = ?
                       AND ativo = 1
                       AND video_url IS NOT NULL
                       AND TRIM(video_url) <> ''`,
                    [conteudoId]
                );

                const categoriaEsperada =
                    tipo === "montagem"
                        ? "montagem"
                        : "manutencao";

                conteudo = registros.filter(item =>
                    normalizarTexto(item.categoria)
                        .includes(categoriaEsperada)
                );
            }

            // LIFESTYLE: somente vídeos sorteados
            if (tipo === "lifestyle") {

                await obterLifestyleSelecionados(usuarioId);

                conteudo = await consultar(
                    `SELECT v.id
                     FROM videos_lifestyle v
                     INNER JOIN progresso_lifestyle_selecionados s
                        ON s.video_id = v.id
                     WHERE v.id = ?
                       AND s.usuario_id = ?
                       AND v.ativo = 1`,
                    [conteudoId, usuarioId]
                );
            }

            if (conteudo.length === 0) {
                return res.status(404).json({
                    erro: "Conteúdo não encontrado ou não pertence à etapa."
                });
            }

            await consultar(
                `INSERT IGNORE INTO progresso_conteudos
                    (usuario_id, tipo_conteudo, conteudo_id)
                 VALUES (?, ?, ?)`,
                [usuarioId, tipo, conteudoId]
            );

            const progresso = await calcularProgresso(usuarioId);

            return res.json({
                ok: true,
                mensagem: "Acesso registrado!",
                progresso
            });

        } catch (erro) {
            console.error("ERRO AO REGISTRAR:", erro);

            return res.status(500).json({
                erro: erro.message
            });
        }
    }
);

// =====================================================
// LISTAR VÍDEOS DE LIFESTYLE
// =====================================================

router.get(
    "/videos-lifestyle",
    validarToken,
    async (req, res) => {

        try {
            const videos = await consultar(
                `SELECT
                    id,
                    titulo,
                    categoria,
                    descricao,
                    video_url
                 FROM videos_lifestyle
                 WHERE ativo = 1
                 ORDER BY id DESC`
            );

            return res.json(videos);

        } catch (erro) {
            console.error("ERRO NOS VÍDEOS:", erro);

            return res.status(500).json({
                erro: "Não foi possível carregar os vídeos."
            });
        }
    }
);

module.exports = router;
