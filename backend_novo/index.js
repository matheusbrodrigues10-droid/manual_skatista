const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


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

    const cepLimpo =
        limparCep(cep);

    if (cepLimpo.length !== 8) {
        throw new Error(
            "CEP inválido."
        );
    }


    // -----------------------------------------
    // VIACEP
    // -----------------------------------------

    const viaCepResponse =
        await fetch(
            `https://viacep.com.br/ws/${cepLimpo}/json/`
        );

    if (!viaCepResponse.ok) {
        throw new Error(
            "Erro ao consultar o CEP."
        );
    }

    const endereco =
        await viaCepResponse.json();

    if (endereco.erro) {
        throw new Error(
            "CEP não encontrado."
        );
    }


    // -----------------------------------------
    // NOMINATIM
    // -----------------------------------------

    const parametros =
        new URLSearchParams({

            street:
                endereco.logradouro || "",

            city:
                endereco.localidade || "",

            state:
                endereco.uf || "",

            country:
                "Brazil",

            postalcode:
                endereco.cep
                    ? endereco.cep.replace(/\D/g, "")
                    : cepLimpo,

            format:
                "jsonv2",

            limit:
                "1"
        });


    const nominatimResponse =
        await fetch(
            `https://nominatim.openstreetmap.org/search?${parametros}`,
            {
                headers: {
                    "User-Agent":
                        "Manual-do-Skatista/1.0"
                }
            }
        );


    if (!nominatimResponse.ok) {

        throw new Error(
            "Erro ao localizar o endereço no mapa."
        );
    }


    let resultados =
        await nominatimResponse.json();


    // -----------------------------------------
    // SEGUNDA TENTATIVA
    // -----------------------------------------

    if (!resultados.length) {

        const buscaAlternativa =
            new URLSearchParams({

                q: [
                    endereco.logradouro,
                    endereco.bairro,
                    endereco.localidade,
                    endereco.uf,
                    "Brazil"
                ]
                    .filter(Boolean)
                    .join(", "),

                format:
                    "jsonv2",

                limit:
                    "1"
            });


        const segundaBusca =
            await fetch(
                `https://nominatim.openstreetmap.org/search?${buscaAlternativa}`,
                {
                    headers: {
                        "User-Agent":
                            "Manual-do-Skatista/1.0"
                    }
                }
            );


        if (segundaBusca.ok) {
            resultados =
                await segundaBusca.json();
        }
    }


    if (!resultados.length) {
        throw new Error(
            "Não foi possível localizar o CEP no mapa."
        );
    }


    return {

        cep:
            endereco.cep,

        logradouro:
            endereco.logradouro,

        bairro:
            endereco.bairro,

        cidade:
            endereco.localidade,

        estado:
            endereco.uf,

        latitude:
            Number(
                resultados[0].lat
            ),

        longitude:
            Number(
                resultados[0].lon
            )
    };
}


// =====================================================
// PISTAS MAIS PRÓXIMAS
// =====================================================

app.get(
    "/pistas/proximas",
    async (req, res) => {

        try {

            const {
                cep
            } = req.query;


            if (!cep) {

                return res.status(400).json({
                    erro:
                        "Informe o CEP."
                });
            }


            // -----------------------------------------
            // LOCALIZAÇÃO DO USUÁRIO
            // -----------------------------------------

            const origem =
                await buscarCoordenadasPorCep(
                    cep
                );


            // -----------------------------------------
            // BUSCA PISTAS NO BANCO
            // -----------------------------------------

            db.query(
                `
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
                WHERE ativo = TRUE
                `,
                async (err, pistas) => {

                    if (err) {

                        console.error(
                            "❌ ERRO AO BUSCAR PISTAS NO BANCO:",
                            err.message
                        );

                        return res.status(500).json({
                            erro: err.message
                        });
                    }


                    if (!pistas.length) {

                        return res.json({
                            origem,
                            pistas: []
                        });
                    }


                    try {

                        // -----------------------------------------
                        // MONTA COORDENADAS
                        // -----------------------------------------

                        const coordenadas = [

                            `${origem.longitude},${origem.latitude}`,

                            ...pistas.map(
                                (pista) =>
                                    `${pista.longitude},${pista.latitude}`
                            )

                        ].join(";");


                        // -----------------------------------------
                        // OSRM
                        // -----------------------------------------

                        const osrmResponse =
                            await fetch(
                                `https://router.project-osrm.org/table/v1/driving/${coordenadas}?sources=0&annotations=distance,duration`
                            );


                        if (!osrmResponse.ok) {

                            throw new Error(
                                "Erro ao acessar o serviço de rotas."
                            );
                        }


                        const osrm =
                            await osrmResponse.json();


                        if (osrm.code !== "Ok") {

                            throw new Error(
                                "Erro ao calcular as distâncias."
                            );
                        }


                        const distancias =
                            osrm.distances[0];

                        const duracoes =
                            osrm.durations[0];


                        // -----------------------------------------
                        // ADICIONA DISTÂNCIA E TEMPO
                        // -----------------------------------------

                        const resultado =
                            pistas.map(
                                (pista, index) => ({

                                    ...pista,

                                    distancia:
                                        distancias[
                                            index + 1
                                        ],

                                    duracao:
                                        duracoes[
                                            index + 1
                                        ]

                                })
                            );


                        // -----------------------------------------
                        // ORDENA DA MAIS PRÓXIMA
                        // -----------------------------------------

                        resultado.sort(
                            (a, b) =>
                                a.distancia -
                                b.distancia
                        );


                        return res.json({

                            origem,

                            pistas:
                                resultado

                        });

                    } catch (error) {

                        console.error(
                            "❌ ERRO NO OSRM:",
                            error
                        );

                        return res.status(500).json({

                            erro:
                                error.message ||
                                "Erro ao calcular distâncias."

                        });
                    }

                }
            );

        } catch (error) {

            console.error(
                "❌ ERRO AO BUSCAR PISTAS:",
                error
            );

            return res.status(500).json({

                erro:
                    error.message ||
                    "Erro ao buscar pistas."

            });
        }

    }
);


// =====================================================
// ROTA ATÉ A PISTA
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


            if (
                !origemLat ||
                !origemLng ||
                !destinoLat ||
                !destinoLng
            ) {

                return res.status(400).json({

                    erro:
                        "Coordenadas incompletas."

                });
            }


            const coordenadas =

                `${origemLng},${origemLat};` +
                `${destinoLng},${destinoLat}`;


            const response =
                await fetch(

                    `https://router.project-osrm.org/route/v1/driving/${coordenadas}?overview=full&geometries=geojson`

                );


            if (!response.ok) {

                throw new Error(
                    "Erro ao acessar o serviço de rotas."
                );
            }


            const data =
                await response.json();


            if (
                data.code !== "Ok" ||
                !data.routes?.length
            ) {

                return res.status(404).json({

                    erro:
                        "Não foi possível encontrar uma rota."

                });
            }


            const rota =
                data.routes[0];


            return res.json({

                distancia:
                    rota.distance,

                duracao:
                    rota.duration,

                geometry:
                    rota.geometry

            });

        } catch (error) {

            console.error(
                "❌ ERRO AO CALCULAR ROTA:",
                error
            );

            return res.status(500).json({

                erro:
                    "Erro ao calcular a rota."

            });
        }

    }
);


// =====================================================
// INICIAR SERVIDOR
// =====================================================

const PORT = 3001;

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