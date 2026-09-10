const fs = require("fs");

const TOTAL = 200000;
const INICIO = 500001;
const CONCORRENCIA = 50;

const URL = "http://10.111.9.12:3000/inserir";

const SENHA = "Senha123";

let enviados = 0;
let sucessos = 0;
let erros = 0;

const arquivo = fs.createWriteStream(
    "usuarios-200mil.csv",
    {
        flags: "w"
    }
);

arquivo.write(
    "nome,email,senha,cpf,telefone,data_nascimento,palavra_chave,tipo\n"
);

function criarUsuario(numero) {

    return {

        nome:
            `Usuario Teste ${numero}`,

        email:
            `usuario${numero}@teste.com`,

        senha:
            SENHA,

        cpf:
            String(
                10000000000 + numero
            ),

        telefone:
            `119${String(numero).padStart(8, "0")}`,

        data_nascimento:
            "2005-01-01",

        palavra_chave:
            "teste",

        tipo:
            "usuario"
    };
}

function salvarUsuario(usuario) {

    arquivo.write(
        `${usuario.nome},` +
        `${usuario.email},` +
        `${usuario.senha},` +
        `${usuario.cpf},` +
        `${usuario.telefone},` +
        `${usuario.data_nascimento},` +
        `${usuario.palavra_chave},` +
        `${usuario.tipo}\n`
    );
}

async function cadastrar(numero) {

    const usuario =
        criarUsuario(numero);

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
                        JSON.stringify(
                            usuario
                        )
                }
            );

        enviados++;

        if (response.ok) {

            sucessos++;

            // Só salva no arquivo
            // se o cadastro deu certo
            salvarUsuario(usuario);

        } else {

            erros++;
        }

    } catch (error) {

        enviados++;
        erros++;

    }

    if (enviados % 1000 === 0) {

        console.log(
            `Processados: ${enviados}/${TOTAL} | ` +
            `Sucesso: ${sucessos} | ` +
            `Erros: ${erros}`
        );
    }
}

async function iniciar() {

    const inicio =
        Date.now();

    console.log(
        `Iniciando ${TOTAL} cadastros...`
    );

    let proximo =
        INICIO;

    async function trabalhador() {

        while (true) {

            const numero =
                proximo++;

            if (
                numero >=
                INICIO + TOTAL
            ) {
                break;
            }

            await cadastrar(
                numero
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

    arquivo.end();

    const tempo =
        (Date.now() - inicio) /
        1000;

    console.log("");
    console.log(
        "=============================="
    );

    console.log(
        "CADASTRO FINALIZADO"
    );

    console.log(
        "=============================="
    );

    console.log(
        "Total:",
        TOTAL
    );

    console.log(
        "Sucessos:",
        sucessos
    );

    console.log(
        "Erros:",
        erros
    );

    console.log(
        "Tempo:",
        tempo.toFixed(2),
        "segundos"
    );

    console.log(
        "Arquivo:",
        "usuarios-200mil.csv"
    );
}

iniciar();