"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
    const router = useRouter();

    const [opcoes, setOpcoes] = useState({
        niveis: [],
        objetivos: [],
        tempos: []
    });

    const [form, setForm] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        nivel_id: "",
        objetivo_id: "",
        tempo_id: ""
    });

    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarOpcoes() {
            try {
                // CORREÇÃO: URL direta para o backend
                const response = await fetch(
                    "http://localhost:3001/opcoes-cadastro"
                );

                if (!response.ok) {
                    throw new Error("Erro ao carregar opções");
                }

                const data = await response.json();

                setOpcoes({
                    niveis: data.niveis || [],
                    objetivos: data.objetivos || [],
                    tempos: data.tempos || []
                });

            } catch {
                setErro(
                    "Erro ao carregar opções do cadastro."
                );
            }
        }

        carregarOpcoes();
    }, []);

    function alterarCampo(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    async function fazerCadastro(event) {
        event.preventDefault();

        setErro("");

        if (
            form.senha !==
            form.confirmarSenha
        ) {
            setErro(
                "As senhas não coincidem!"
            );
            return;
        }

        if (form.senha.length < 6) {
            setErro(
                "A senha deve ter pelo menos 6 caracteres."
            );
            return;
        }

        try {
            // CORREÇÃO: URL direta para o backend
            const response = await fetch(
                "http://localhost:3001/usuarios",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        nome: form.nome,
                        email: form.email,
                        senha: form.senha,
                        nivel_id:
                            parseInt(form.nivel_id),
                        objetivo_id:
                            parseInt(form.objetivo_id),
                        tempo_id:
                            parseInt(form.tempo_id)
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setErro(
                    data.erro ||
                    "Erro ao cadastrar."
                );
                return;
            }

            alert(
                "✅ Conta criada com sucesso!"
            );

            router.push("/login");

        } catch {
            setErro(
                "Erro de conexão com o servidor."
            );
        }
    }

    return (
        <div className="form-container">

            <h2>
                🛹 Criar Conta
            </h2>

            <p className="form-subtitle">
                É grátis e rápido
            </p>

            {erro && (
                <p
                    style={{
                        color:
                            "var(--red)",
                        marginBottom:
                            "1rem"
                    }}
                >
                    ❌ {erro}
                </p>
            )}

            <form
                onSubmit={fazerCadastro}
            >

                <div className="form-group">
                    <label>Nome</label>

                    <input
                        name="nome"
                        type="text"
                        placeholder="Seu nome"
                        value={form.nome}
                        onChange={
                            alterarCampo
                        }
                        required
                    />
                </div>

                <div className="form-group">
                    <label>E-mail</label>

                    <input
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={form.email}
                        onChange={
                            alterarCampo
                        }
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Senha</label>

                    <input
                        name="senha"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={form.senha}
                        onChange={
                            alterarCampo
                        }
                        required
                    />
                </div>

                <div className="form-group">
                    <label>
                        Confirmar senha
                    </label>

                    <input
                        name="confirmarSenha"
                        type="password"
                        placeholder="Repita a senha"
                        value={
                            form.confirmarSenha
                        }
                        onChange={
                            alterarCampo
                        }
                        required
                    />
                </div>

                <hr />

                <div className="form-group">
                    <label>
                        Nível no Skate
                    </label>

                    <select
                        name="nivel_id"
                        value={
                            form.nivel_id
                        }
                        onChange={
                            alterarCampo
                        }
                        required
                    >
                        <option value="">
                            Selecione seu nível
                        </option>

                        {opcoes.niveis.map(
                            (nivel) => (
                                <option
                                    key={
                                        nivel.id
                                    }
                                    value={
                                        nivel.id
                                    }
                                >
                                    {
                                        nivel.descricao
                                    }
                                </option>
                            )
                        )}

                    </select>
                </div>

                <div className="form-group">

                    <label>
                        Objetivo
                    </label>

                    <select
                        name="objetivo_id"
                        value={
                            form.objetivo_id
                        }
                        onChange={
                            alterarCampo
                        }
                        required
                    >
                        <option value="">
                            Qual seu objetivo?
                        </option>

                        {opcoes.objetivos.map(
                            (objetivo) => (
                                <option
                                    key={
                                        objetivo.id
                                    }
                                    value={
                                        objetivo.id
                                    }
                                >
                                    {
                                        objetivo.descricao
                                    }
                                </option>
                            )
                        )}

                    </select>

                </div>

                <div className="form-group">

                    <label>
                        Tempo de Skate
                    </label>

                    <select
                        name="tempo_id"
                        value={
                            form.tempo_id
                        }
                        onChange={
                            alterarCampo
                        }
                        required
                    >
                        <option value="">
                            Há quanto tempo você anda?
                        </option>

                        {opcoes.tempos.map(
                            (tempo) => (
                                <option
                                    key={
                                        tempo.id
                                    }
                                    value={
                                        tempo.id
                                    }
                                >
                                    {
                                        tempo.descricao
                                    }
                                </option>
                            )
                        )}

                    </select>

                </div>

                <button
                    className="btn"
                    type="submit"
                >
                    Criar conta
                </button>

            </form>

            <div className="link-text">
                Já tem conta?{" "}
                <Link href="/login">
                    Entrar
                </Link>
            </div>

            <Link
                href="/"
                className="btn btn-voltar"
            >
                ← Voltar
            </Link>

        </div>
    );
}   