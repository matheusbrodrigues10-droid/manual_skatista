const express = require("express");
const cors = require("cors");
const db = require("./db");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

app.use(cors());
app.use(express.json());

// =====================================================
// SWAGGER
// =====================================================

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);
// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function limparCep(cep) {
    return String(cep || "")
        .replace(/\D/g, "");
}


// =====================================================
// TESTE DO BACKEND
// =====================================================

app.get("/teste", (req, res) => {
    res.json({
        ok: true,
        db: "manual_skatista"
    });
});


// =====================================================
// CADASTRO
// =====================================================

app.post("/usuarios", (req, res) => {

    console.log("=".repeat(50));
    console.log("📥 RECEBI DADOS:", req.body);

    const {
        nome,
        email,
        senha,
        nivel_id,
        objetivo_id,
        tempo_id
    } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            erro: "Campos obrigatórios"
        });
    }

    const sql = `
        INSERT INTO usuarios
        (
            nome,
            email,
            senha,
            nivel_id,
            objetivo_id,
            tempo_id
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nome,
            email,
            senha,
            nivel_id,
            objetivo_id,
            tempo_id
        ],
        (err, result) => {

            if (err) {
                console.error(
                    "❌ ERRO:",
                    err.message
                );

                return res.status(500).json({
                    erro: err.message
                });
            }

            console.log(
                "✅ USUÁRIO CADASTRADO! ID:",
                result.insertId
            );

            console.log("=".repeat(50));

            res.status(201).json({
                ok: true,
                id: result.insertId,
                mensagem:
                    "Cadastrado com sucesso!"
            });
        }
    );
});


// =====================================================
// OPÇÕES PARA CADASTRO
// =====================================================

app.get("/opcoes-cadastro", (req, res) => {

    const sqlNiveis =
        "SELECT id, descricao FROM nivel_skate";

    const sqlObjetivos =
        "SELECT id, descricao FROM objetivo_skate";

    const sqlTempos =
        "SELECT id, descricao FROM tempo_skate";


    db.query(
        sqlNiveis,
        (err1, niveis) => {

            if (err1) {
                return res.status(500).json({
                    erro: err1.message
                });
            }

            db.query(
                sqlObjetivos,
                (err2, objetivos) => {

                    if (err2) {
                        return res.status(500).json({
                            erro: err2.message
                        });
                    }

                    db.query(
                        sqlTempos,
                        (err3, tempos) => {

                            if (err3) {
                                return res.status(500).json({
                                    erro: err3.message
                                });
                            }

                            res.json({
                                niveis,
                                objetivos,
                                tempos
                            });
                        }
                    );
                }
            );
        }
    );
});


// =====================================================
// BUSCAR USUÁRIOS
// =====================================================

app.get("/usuarios", (req, res) => {

    db.query(
        "SELECT * FROM usuarios",
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            console.log(
                "📊 Usuários:",
                result.length
            );

            res.json(result);
        }
    );
});


// =====================================================
// TEMPOS
// =====================================================

app.get("/tempos", (req, res) => {

    db.query(
        "SELECT * FROM tempo_skate",
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            res.json(result);
        }
    );
});


// =====================================================
// NÍVEIS
// =====================================================

app.get("/niveis", (req, res) => {

    db.query(
        "SELECT * FROM nivel_skate",
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            res.json(result);
        }
    );
});


// =====================================================
// OBJETIVOS
// =====================================================

app.get("/objetivos", (req, res) => {

    db.query(
        "SELECT * FROM objetivo_skate",
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            res.json(result);
        }
    );
});


// =====================================================
// LOGIN
// =====================================================

app.post("/login", (req, res) => {

    console.log(
        "📥 LOGIN:",
        req.body.email
    );

    const {
        email,
        senha
    } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            erro:
                "Email e senha são obrigatórios"
        });
    }

    const sql = `
        SELECT *
        FROM usuarios
        WHERE email = ?
        AND senha = ?
    `;

    db.query(
        sql,
        [email, senha],
        (err, result) => {

            if (err) {

                console.error(
                    "❌ Erro no login:",
                    err.message
                );

                return res.status(500).json({
                    erro: "Erro interno"
                });
            }

            if (result.length > 0) {

                const usuario =
                    result[0];

                console.log(
                    "✅ Login OK:",
                    usuario.nome
                );

                // Não envia a senha
                res.json({
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                });

            } else {

                console.log(
                    "❌ Credenciais inválidas"
                );

                res.status(401).json({
                    erro:
                        "Email ou senha inválidos"
                });
            }
        }
    );
});


// =====================================================
// BUSCAR COORDENADAS PELO CEP
// =====================================================

async function buscarCoordenadasPorCep(cep) {

    const cepLimpo = limparCep(cep);

    if (!/^\d{8}$/.test(cepLimpo)) {
        throw new Error("CEP inválido.");
    }

    // -----------------------------------------
    // 1. CONSULTAR VIACEP
    // -----------------------------------------

    const viaCepResponse = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
    );

    if (!viaCepResponse.ok) {
        throw new Error("Erro ao consultar o ViaCEP.");
    }

    const endereco = await viaCepResponse.json();

    console.log("RESULTADO VIACEP:", endereco);

    if (endereco.erro) {
        throw new Error("CEP não encontrado.");
    }

    // -----------------------------------------
    // 2. FUNÇÃO PARA CONSULTAR O NOMINATIM
    // -----------------------------------------

    async function consultarNominatim(parametros) {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${parametros}`,
            {
                headers: {
                    "User-Agent": "Manual-do-Skatista/1.0",
                    "Accept-Language": "pt-BR"
                }
            }
        );

        if (response.status === 429) {
            throw new Error(
                "O serviço de mapas recebeu muitas consultas. Aguarde um pouco e tente novamente."
            );
        }

        if (!response.ok) {
            throw new Error(
                `Erro no serviço de mapas: HTTP ${response.status}.`
            );
        }

        const dados = await response.json();

        console.log("RESULTADO NOMINATIM:", dados);

        return Array.isArray(dados) ? dados : [];
    }

    let resultados = [];

    // -----------------------------------------
    // 3. PRIMEIRA TENTATIVA: BUSCAR PELO CEP
    // -----------------------------------------

    const buscaCep = new URLSearchParams({
        postalcode: cepLimpo,
        country: "Brazil",
        countrycodes: "br",
        format: "jsonv2",
        limit: "1"
    });

    resultados = await consultarNominatim(buscaCep);

    // -----------------------------------------
    // 4. SEGUNDA TENTATIVA: ENDEREÇO ESTRUTURADO
    // -----------------------------------------

    if (!resultados.length) {

        // Respeita um intervalo entre as consultas
        await new Promise(resolve => setTimeout(resolve, 1100));

        const buscaEndereco = new URLSearchParams({
            city: endereco.localidade || "",
            state: endereco.uf || "",
            country: "Brazil",
            countrycodes: "br",
            postalcode: cepLimpo,
            format: "jsonv2",
            limit: "1"
        });

        if (endereco.logradouro) {
            buscaEndereco.set(
                "street",
                endereco.logradouro
            );
        }

        resultados = await consultarNominatim(
            buscaEndereco
        );
    }

    // -----------------------------------------
    // 5. TERCEIRA TENTATIVA: BUSCA POR TEXTO
    // -----------------------------------------

    if (!resultados.length) {

        await new Promise(resolve => setTimeout(resolve, 1100));

        const textoEndereco = [
            endereco.logradouro,
            endereco.bairro,
            endereco.localidade,
            endereco.uf,
            "Brasil"
        ]
            .filter(Boolean)
            .join(", ");

        const buscaTexto = new URLSearchParams({
            q: textoEndereco,
            countrycodes: "br",
            format: "jsonv2",
            limit: "1"
        });

        resultados = await consultarNominatim(buscaTexto);
    }

    // -----------------------------------------
    // 6. VERIFICAR SE ENCONTROU COORDENADAS
    // -----------------------------------------

    if (!resultados.length) {
        throw new Error(
            "Não foi possível localizar esse CEP no mapa. O endereço pode não estar indexado no serviço de mapas."
        );
    }

    const latitude = Number(resultados[0].lat);
    const longitude = Number(resultados[0].lon);

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {
        throw new Error(
            "O serviço de mapas retornou coordenadas inválidas."
        );
    }

    // -----------------------------------------
    // 7. RETORNAR A LOCALIZAÇÃO DE ORIGEM
    // -----------------------------------------

    return {
        cep: endereco.cep,
        logradouro: endereco.logradouro,
        bairro: endereco.bairro,
        cidade: endereco.localidade,
        estado: endereco.uf,
        latitude,
        longitude
    };
}


// =====================================================
// PISTAS MAIS PRÓXIMAS DE PRESIDENTE PRUDENTE
// =====================================================

app.get(
    "/pistas/proximas",
    async (req, res) => {

        try {

            const { cep } = req.query;

            if (!cep) {
                return res.status(400).json({
                    erro: "Informe o CEP."
                });
            }

            // -----------------------------------------
            // 1. LOCALIZAR A ORIGEM
            // -----------------------------------------

            const origem = await buscarCoordenadasPorCep(
                cep
            );

            console.log(
                "ORIGEM LOCALIZADA:",
                origem
            );

            // -----------------------------------------
            // 2. BUSCAR SOMENTE PISTAS DE PRESIDENTE
            // PRUDENTE NO BANCO DE DADOS
            // -----------------------------------------

            const sql = `
                SELECT
                    id,
                    nome,
                    endereco,
                    bairro,
                    cidade,
                    estado,
                    cep,
                    tipo,
                    descricao,
                    latitude,
                    longitude
                FROM pistas
                WHERE ativo = 1
                  AND LOWER(TRIM(cidade)) = LOWER(?)
                  AND UPPER(TRIM(estado)) = 'SP'
                  AND latitude IS NOT NULL
                  AND longitude IS NOT NULL
            `;

            db.query(
                sql,
                ["Presidente Prudente"],
                async (err, pistasBanco) => {

                    if (err) {
                        console.error(
                            "ERRO AO BUSCAR PISTAS NO BANCO:",
                            err.message
                        );

                        return res.status(500).json({
                            erro: "Erro ao consultar as pistas no banco de dados."
                        });
                    }

                    // -----------------------------------------
                    // 3. VALIDAR COORDENADAS DAS PISTAS
                    // -----------------------------------------

                    const pistas = pistasBanco.filter(
                        pista => {

                            const lat = Number(
                                pista.latitude
                            );

                            const lng = Number(
                                pista.longitude
                            );

                            return (
                                Number.isFinite(lat) &&
                                Number.isFinite(lng) &&
                                lat >= -90 &&
                                lat <= 90 &&
                                lng >= -180 &&
                                lng <= 180
                            );
                        }
                    );

                    console.log(
                        "PISTAS ENCONTRADAS EM PRESIDENTE PRUDENTE:",
                        pistas.length
                    );

                    if (!pistas.length) {
                        return res.json({
                            origem,
                            pistas: []
                        });
                    }

                    try {

                        // -----------------------------------------
                        // 4. MONTAR COORDENADAS PARA O OSRM
                        // -----------------------------------------

                        const coordenadas = [
                            `${origem.longitude},${origem.latitude}`,

                            ...pistas.map(
                                pista =>
                                    `${Number(pista.longitude)},${Number(pista.latitude)}`
                            )
                        ].join(";");

                        // -----------------------------------------
                        // 5. CALCULAR DISTÂNCIAS E DURAÇÕES
                        // -----------------------------------------

                        const osrmResponse = await fetch(
                            `https://router.project-osrm.org/table/v1/driving/${coordenadas}?sources=0&annotations=distance,duration`
                        );

                        if (!osrmResponse.ok) {
                            throw new Error(
                                "Erro ao acessar o serviço de cálculo de distâncias."
                            );
                        }

                        const osrm = await osrmResponse.json();

                        if (
                            osrm.code !== "Ok" ||
                            !osrm.distances ||
                            !osrm.durations
                        ) {
                            throw new Error(
                                "O serviço de mapas não conseguiu calcular as distâncias."
                            );
                        }

                        const distancias = osrm.distances[0];
                        const duracoes = osrm.durations[0];

                        // -----------------------------------------
                        // 6. ASSOCIAR DISTÂNCIA E TEMPO ÀS PISTAS
                        // -----------------------------------------

                        const resultado = pistas.map(
                            (pista, index) => ({
                                ...pista,

                                distancia:
                                    distancias?.[index + 1] ?? null,

                                duracao:
                                    duracoes?.[index + 1] ?? null
                            })
                        );

                        // -----------------------------------------
                        // 7. ORDENAR DA MAIS PRÓXIMA À MAIS DISTANTE
                        // -----------------------------------------

                        resultado.sort((a, b) => {

                            const distanciaA =
                                a.distancia ?? Infinity;

                            const distanciaB =
                                b.distancia ?? Infinity;

                            return distanciaA - distanciaB;
                        });

                        // -----------------------------------------
                        // 8. RETORNAR RESULTADO
                        // -----------------------------------------

                        return res.json({
                            origem,
                            pistas: resultado
                        });

                    } catch (error) {

                        console.error(
                            "ERRO NO CÁLCULO DAS DISTÂNCIAS:",
                            error.message
                        );

                        return res.status(502).json({
                            erro: error.message ||
                                "Não foi possível calcular as distâncias."
                        });
                    }
                }
            );

        } catch (error) {

            console.error(
                "ERRO AO BUSCAR PISTAS:",
                error.message
            );

            return res.status(400).json({
                erro: error.message ||
                    "Não foi possível buscar as pistas."
            });
        }
    }
);


// =====================================================
// CALCULAR ROTA ATÉ UMA PISTA
// =====================================================

app.get(
    "/pistas/rota",
    async (req, res) => {

        try {

            const {
                origemLat,
                origemLng,
                destinoLat,
                destinoLng
            } = req.query;

            // -----------------------------------------
            // 1. VALIDAR PARÂMETROS
            // -----------------------------------------

            const valores = [
                origemLat,
                origemLng,
                destinoLat,
                destinoLng
            ];

            if (
                valores.some(
                    valor =>
                        valor === undefined ||
                        valor === null ||
                        valor === ""
                )
            ) {
                return res.status(400).json({
                    erro: "Informe todas as coordenadas da origem e do destino."
                });
            }

            const latOrigem = Number(origemLat);
            const lngOrigem = Number(origemLng);
            const latDestino = Number(destinoLat);
            const lngDestino = Number(destinoLng);

            const coordenadasValidas =
                Number.isFinite(latOrigem) &&
                Number.isFinite(lngOrigem) &&
                Number.isFinite(latDestino) &&
                Number.isFinite(lngDestino) &&
                latOrigem >= -90 &&
                latOrigem <= 90 &&
                latDestino >= -90 &&
                latDestino <= 90 &&
                lngOrigem >= -180 &&
                lngOrigem <= 180 &&
                lngDestino >= -180 &&
                lngDestino <= 180;

            if (!coordenadasValidas) {
                return res.status(400).json({
                    erro: "Uma ou mais coordenadas são inválidas."
                });
            }

            // -----------------------------------------
            // 2. MONTAR COORDENADAS NO FORMATO DO OSRM
            // Formato: longitude,latitude
            // -----------------------------------------

            const coordenadas =
                `${lngOrigem},${latOrigem};` +
                `${lngDestino},${latDestino}`;

            // -----------------------------------------
            // 3. SOLICITAR A ROTA
            // -----------------------------------------

            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${coordenadas}?overview=full&geometries=geojson`
            );

            if (!response.ok) {
                throw new Error(
                    "Erro ao acessar o serviço de rotas."
                );
            }

            const data = await response.json();

            if (
                data.code !== "Ok" ||
                !data.routes ||
                !data.routes.length
            ) {
                return res.status(404).json({
                    erro: "Não foi possível encontrar uma rota entre esses pontos."
                });
            }

            // -----------------------------------------
            // 4. RETORNAR ROTA, DISTÂNCIA E DURAÇÃO
            // -----------------------------------------

            const rota = data.routes[0];

            return res.json({
                distancia: rota.distance,
                duracao: rota.duration,
                geometry: rota.geometry
            });

        } catch (error) {

            console.error(
                "ERRO AO CALCULAR ROTA:",
                error.message
            );

            return res.status(502).json({
                erro: error.message ||
                    "Erro ao calcular a rota."
            });
        }
    }
);
const PORT = 3001;

// =========================================
// MANOBRAS
// =========================================

app.get("/manobras", (req, res) => {
    const sql = `
        SELECT
            id,
            nome,
            categoria,
            nivel,
            descricao,
            video_url,
            icone,
            ordem
        FROM manobras
        WHERE ativo = 1
        ORDER BY ordem ASC, id ASC
    `;

    db.query(sql, (err, resultado) => {
        if (err) {
            console.error(
                "Erro ao buscar manobras:",
                err.message
            );

            return res.status(500).json({
                erro: "Não foi possível buscar as manobras."
            });
        }

        return res.status(200).json(resultado);
    });
});

// =========================================
// MONTAGENS E MANUTENÇÃO
// =========================================

app.get("/montagens", (req, res) => {
    const sql = `
        SELECT
            id,
            nome,
            categoria,
            descricao,
            video_url,
            icone,
            ordem
        FROM montagens
        WHERE ativo = 1
        ORDER BY ordem ASC, id ASC
    `;

    db.query(sql, (err, resultado) => {
        if (err) {
            console.error(
                "Erro ao buscar montagens:",
                err.message
            );

            return res.status(500).json({
                erro: "Não foi possível buscar os tutoriais de montagem."
            });
        }

        return res.status(200).json(resultado);
    });
});

// =========================================
// EQUIPAMENTOS
// =========================================

app.get("/equipamentos", (req, res) => {
    const sql = `
        SELECT
            id,
            nome,
            categoria,
            nivel,
            descricao,
            produto_url,
            imagem_url,
            icone,
            ordem
        FROM equipamentos
        WHERE ativo = 1
        ORDER BY ordem ASC, id ASC
    `;

    db.query(sql, (err, resultado) => {
        if (err) {
            console.error(
                "Erro ao buscar equipamentos:",
                err.message
            );

            return res.status(500).json({
                erro: "Não foi possível buscar os equipamentos."
            });
        }

        return res.status(200).json(resultado);
    });
});

// =========================================
// ROUPAS E ACESSÓRIOS
// =========================================

app.get("/roupas", (req, res) => {
    const sql = `
        SELECT
            id,
            nome,
            categoria,
            faixa,
            descricao,
            produto_url,
            imagem_url,
            icone,
            ordem
        FROM roupas
        WHERE ativo = 1
        ORDER BY ordem ASC, id ASC
    `;

    db.query(sql, (err, resultado) => {
        if (err) {
            console.error(
                "Erro ao buscar roupas:",
                err.message
            );

            return res.status(500).json({
                erro: "Não foi possível buscar as roupas."
            });
        }

        return res.status(200).json(resultado);
    });
});

app.listen(
    PORT,
    () => {

        console.log(
            "🚀 Rodando na porta",
            PORT
        );

        console.log(
            "📋 Teste: http://localhost:" +
            PORT +
            "/teste"
        );

    }
);