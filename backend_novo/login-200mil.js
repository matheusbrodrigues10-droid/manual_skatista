const fs = require("fs");

const CONCORRENCIA = 50;

const URL = "http://10.111.9.12:3000/login";

const arquivo =
    fs.readFileSync(
        "usuarios-200mil.csv",
        "utf8"
    );

const linhas =
    arquivo
        .trim()
        .split("\n");

linhas.shift();

const usuarios =
    linhas.map((linha) => {

        const dados =
            linha.split(",");

        return {
            email: dados[1],
            senha: dados[2]
        };
    });

const TOTAL =
    usuarios.length;

let enviados = 0;
let loginOk = 0;
let erro401 = 0;
let erro500 = 0;
let outrosErros = 0;

async function fazerLogin(usuario) {

    try {

        const response =
            await fetch(
                URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            email:
                                usuario.email,

                            senha:
                                usuario.senha
                        })
                }
            );

        enviados++;

        if (
            response.status === 200
        ) {

            loginOk++;

        } else if (
            response.status === 401
        ) {

            erro401++;

        } else if (
            response.status === 500
        ) {

            erro500++;

        } else {

            outrosErros++;
        }

    } catch (error) {

        enviados++;
        outrosErros++;
    }

    if (
        enviados % 1000 === 0
    ) {

        console.log(
            `Processados: ${enviados}/${TOTAL} | ` +
            `LOGIN OK: ${loginOk} | ` +
            `401: ${erro401} | ` +
            `500: ${erro500} | ` +
            `Outros: ${outrosErros}`
        );
    }
}

async function iniciar() {

    const inicio =
        Date.now();

    console.log(
        `Iniciando ${TOTAL} logins...`
    );

    let proximo = 0;

    async function trabalhador() {

        while (true) {

            const indice =
                proximo++;

            if (
                indice >= TOTAL
            ) {
                break;
            }

            await fazerLogin(
                usuarios[indice]
            );
        }
    }

    const trabalhadores = [];

    for (
        let i = 0;
        i < CONCORRENCIA;
        i++
    ) {

        trabalhadores.push(
            trabalhador()
        );
    }

    await Promise.all(
        trabalhadores
    );

    const tempo =
        (Date.now() - inicio) /
        1000;

    console.log("");
    console.log(
        "=============================="
    );

    console.log(
        "TESTE DE LOGIN FINALIZADO"
    );

    console.log(
        "=============================="
    );

    console.log(
        "Total:",
        TOTAL
    );

    console.log(
        "LOGIN OK:",
        loginOk
    );

    console.log(
        "401:",
        erro401
    );

    console.log(
        "500:",
        erro500
    );

    console.log(
        "Outros erros:",
        outrosErros
    );

    console.log(
        "Tempo:",
        tempo.toFixed(2),
        "segundos"
    );

    console.log(
        "Média:",
        (TOTAL / tempo).toFixed(2),
        "logins/segundo"
    );
}

iniciar();