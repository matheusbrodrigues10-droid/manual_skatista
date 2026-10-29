import Image from "next/image";
import PageHeader from "../../components/PageHeader";

const autores = [
    {
        nome: "Matheus Bernardes Rodrigues",
        idade: "18 anos",
        imagem: "/images/matheus-bernardes-rodrigues.png",
        descricao:
            "Estudante do 3º ano do Ensino Médio no SENAI " +
            '"Santo Paschoal Crepaldi", em Presidente Prudente-SP.',
        contribuicao:
            "Responsável principalmente pelo desenvolvimento do site, " +
            "pela programação e pela organização visual da aplicação.",
        ilustrativa: false,
    },
    {
        nome: "Leonardo Miguel Neves dos Santos",
        idade: "19 anos",
        imagem: "/images/leonardo-miguel-neves.png",
        descricao:
            "Estudante do 3º ano do Ensino Médio no SENAI " +
            '"Santo Paschoal Crepaldi", em Presidente Prudente-SP.',
        contribuicao:
            "Responsável principalmente pelos conhecimentos sobre skate " +
            "e pela organização dos conteúdos relacionados às manobras, " +
            "aos equipamentos e à cultura do skate.",
        ilustrativa: true,
    },
];

export default function SobrePage() {
    return (
        <>
            <PageHeader
                icon="🛹"
                titulo="Sobre Nós"
                descricao="Conheça o projeto, seus objetivos e os estudantes que o desenvolveram."
            />

            <main className="sobre-container">

                <section className="sobre-intro">
                    <span className="sobre-kicker">
                        NOSSO PROJETO
                    </span>

                    <h2>
                        Mais que um site,
                        <br />
                        uma forma de viver o <em>skate</em>
                    </h2>

                    <p>
                        O Manual do Skatista é um projeto de Trabalho
                        de Conclusão de Curso (TCC), desenvolvido
                        pelos estudantes Matheus Bernardes Rodrigues
                        e Leonardo Miguel Neves dos Santos, do 3º ano
                        do Ensino Médio do SENAI "Santo Paschoal
                        Crepaldi", em Presidente Prudente-SP, com o
                        apoio dos professores Matheus Souza de Oliveira
                        e Bruno Souza Ferreira.
                    </p>

                    <p>
                        A ideia surgiu da vontade de reunir, em um
                        único lugar, informações que ajudem pessoas
                        interessadas no skate, desde quem está começando
                        até quem já possui experiência e deseja melhorar
                        sua prática. O projeto procura facilitar o acesso
                        a conteúdos que muitas vezes estão espalhados
                        por diferentes sites, vídeos e outras fontes.
                    </p>
                </section>

                <section className="sobre-section">
                    <span className="sobre-kicker">
                        A IDEIA POR TRÁS DO SITE
                    </span>

                    <h2>
                        Por que criamos o{" "}
                        <em>Manual do Skatista?</em>
                    </h2>

                    <p>
                        Aprender a andar de skate envolve prática,
                        dedicação e acesso a informações que ajudem
                        a entender os movimentos, escolher os
                        equipamentos adequados e cuidar do próprio
                        skate. Para quem está começando, nem sempre
                        é fácil saber por onde começar ou encontrar
                        orientações organizadas de acordo com seu
                        nível de experiência.
                    </p>

                    <p>
                        Pensando nisso, desenvolvemos o Manual do
                        Skatista para funcionar como um guia digital
                        sobre o universo do skate. O objetivo é tornar
                        a consulta aos conteúdos mais simples e reunir
                        recursos de aprendizagem, referências de
                        equipamentos, informações sobre pistas e
                        vídeos relacionados à prática e à cultura
                        skatista.
                    </p>

                    <p>
                        Além do conteúdo esportivo, o projeto também
                        valoriza o lifestyle do skate, que envolve
                        a convivência entre skatistas, as sessões
                        nas ruas e nas pistas, o estilo e as
                        experiências que fazem parte dessa cultura.
                    </p>
                </section>

                <section className="sobre-section">
                    <span className="sobre-kicker">
                        COMO O SITE FUNCIONA
                    </span>

                    <h2>
                        Tudo sobre skate em <em>um só lugar</em>
                    </h2>

                    <p>
                        A página inicial apresenta as áreas disponíveis
                        e permite que o visitante conheça a proposta
                        do projeto. O usuário pode criar uma conta,
                        fazer login e, depois da autenticação, acessar
                        as áreas que exigem uma sessão ativa. O cabeçalho
                        identifica o usuário conectado e oferece a opção
                        de sair da conta.
                    </p>

                    <div className="sobre-topics">

                        <article className="sobre-topic">
                            <h3>Manobras</h3>

                            <p>
                                Reúne conteúdos de manobras organizados
                                por nível de dificuldade, do iniciante
                                ao avançado, com explicações e vídeos
                                para auxiliar no aprendizado e na
                                evolução da prática.
                            </p>
                        </article>

                        <article className="sobre-topic">
                            <h3>Montagem e manutenção</h3>

                            <p>
                                Apresenta orientações e tutoriais
                                relacionados à montagem do skate,
                                à troca de peças e aos cuidados
                                necessários para conservar os
                                equipamentos em boas condições.
                            </p>
                        </article>

                        <article className="sobre-topic">
                            <h3>Pistas próximas</h3>

                            <p>
                                Permite informar um CEP para localizar
                                um endereço de referência e consultar
                                as pistas cadastradas. O sistema utiliza
                                serviços externos para obter informações
                                geográficas e estimar distâncias e tempos
                                de deslocamento até as pistas disponíveis.
                            </p>
                        </article>

                        <article className="sobre-topic">
                            <h3>Equipamentos</h3>

                            <p>
                                Apresenta informações sobre componentes
                                do skate, como shape, rodas, rolamentos,
                                trucks, lixas e parafusos, ajudando o
                                usuário a conhecer melhor as peças
                                utilizadas na montagem do equipamento.
                            </p>
                        </article>

                        <article className="sobre-topic">
                            <h3>Roupas e estilo</h3>

                            <p>
                                Reúne referências de roupas, calçados
                                e acessórios relacionados ao estilo
                                skatista, incluindo links externos
                                para consultar produtos e lojas.
                            </p>
                        </article>

                        <article className="sobre-topic">
                            <h3>Dicas e Lifestyle</h3>

                            <p>
                                Reúne vídeos sobre vivências de
                                skatistas, competições, sessões,
                                cultura de rua e dicas para evoluir,
                                praticar manobras e desenvolver
                                mais confiança e segurança no skate.
                            </p>
                        </article>

                    </div>

                    <p className="sobre-observacao">
                        As consultas de localização dependem da
                        disponibilidade dos serviços externos e das
                        informações das pistas cadastradas. A reprodução
                        dos vídeos e a consulta de produtos também
                        dependem dos respectivos sites de origem.
                    </p>
                </section>

                <section className="sobre-section">
                    <span className="sobre-kicker">
                        OBJETIVO DO TCC
                    </span>

                    <h2>
                        Tecnologia aplicada à cultura <em>skatista</em>
                    </h2>

                    <p>
                        O desenvolvimento do Manual do Skatista também
                        é uma oportunidade de aplicar, na prática,
                        os conhecimentos adquiridos no curso de
                        Desenvolvimento de Sistemas. O projeto envolve
                        a criação das interfaces, a programação das
                        funcionalidades, a comunicação entre frontend
                        e backend, o armazenamento de dados e a
                        organização das informações apresentadas
                        ao usuário.
                    </p>

                    <p>
                        Além do desenvolvimento técnico, buscamos
                        criar uma interface organizada, visualmente
                        consistente e fácil de compreender. As cores
                        preto, branco e vermelho foram escolhidas para
                        reforçar a identidade visual ligada ao ambiente
                        urbano e à cultura do skate.
                    </p>

                    <p>
                        Nossa intenção é que o site seja útil para
                        quem deseja conhecer melhor o esporte,
                        encontrar informações para a prática e
                        acompanhar conteúdos relacionados ao
                        universo skatista.
                    </p>
                </section>

                <section className="sobre-section sobre-autores-section">
                    <span className="sobre-kicker">
                        QUEM ESTÁ POR TRÁS DO PROJETO
                    </span>

                    <h2>
                        Os autores do <em>Manual do Skatista</em>
                    </h2>

                    <p className="sobre-autores-intro">
                        O projeto foi desenvolvido em conjunto,
                        reunindo conhecimentos de programação,
                        organização visual e conteúdo sobre skate.
                        Cada integrante contribuiu de acordo com
                        suas responsabilidades para construir
                        a proposta apresentada neste TCC.
                    </p>

                    <div className="sobre-autores-grid">
                        {autores.map((autor) => (
                            <article
                                className="sobre-autor-card"
                                key={autor.nome}
                            >
                                <div
                                    className={`sobre-autor-foto ${
                                        autor.ilustrativa
                                            ? "sobre-autor-foto-avatar"
                                            : ""
                                    }`}
                                >
                                    <Image
                                        src={autor.imagem}
                                        alt={
                                            autor.ilustrativa
                                                ? "Imagem de perfil ilustrativa de Leonardo Miguel Neves dos Santos"
                                                : "Matheus Bernardes Rodrigues"
                                        }
                                        width={1170}
                                        height={1462}
                                        className={
                                            autor.ilustrativa
                                                ? "sobre-autor-imagem sobre-autor-imagem-avatar"
                                                : "sobre-autor-imagem"
                                        }
                                        sizes="(max-width: 700px) 100vw, 50vw"
                                    />
                                </div>

                                <div className="sobre-autor-info">
                                    <span className="sobre-autor-tipo">
                                        INTEGRANTE DO PROJETO
                                    </span>

                                    <h3>{autor.nome}</h3>

                                    <p className="sobre-autor-idade">
                                        {autor.idade}
                                    </p>

                                    <p>{autor.descricao}</p>

                                    <div className="sobre-autor-contribuicao">
                                        <h4>Contribuição no projeto</h4>

                                        <p>{autor.contribuicao}</p>
                                    </div>

                                    {autor.ilustrativa && (
                                        <p className="sobre-foto-legenda">
                                            Imagem de perfil ilustrativa.
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="sobre-agradecimento">
                    <span className="sobre-kicker">
                        AGRADECIMENTOS
                    </span>

                    <h2>
                        Apoio que fez parte dessa <em>jornada</em>
                    </h2>

                    <p>
                        Agradecemos aos professores Matheus Souza de
                        Oliveira e Bruno Souza Ferreira pelo apoio
                        durante o desenvolvimento do projeto e pela
                        orientação ao longo dessa etapa de nossa
                        formação no SENAI "Santo Paschoal Crepaldi",
                        em Presidente Prudente-SP.
                    </p>
                </section>

            </main>
        </>
    );
}