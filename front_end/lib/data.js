export const MANOBRAS_DEMO = [
    {
        id: 1,
        nome: "Ollie",
        nivel: "iniciante",
        desc: "A base de tudo. Salto sem usar as mãos que é pré-requisito para praticamente qualquer outra manobra.",
        duracao: "2-4 semanas",
        icon: "🛹"
    },
    {
        id: 2,
        nome: "Kickflip",
        nivel: "iniciante",
        desc: "Rotação do shape 360° no eixo longitudinal com flip do pé dianteiro. O trick mais icônico do street skate.",
        duracao: "1-3 meses",
        icon: "🔄"
    },
    {
        id: 3,
        nome: "Heelflip",
        nivel: "intermediario",
        desc: "Flip no sentido oposto ao kickflip. Raspagem do calcanhar para baixo e para fora no nose.",
        duracao: "1-2 meses após kickflip",
        icon: "↩️"
    },
    {
        id: 4,
        nome: "360 Flip (Tre Flip)",
        nivel: "intermediario",
        desc: "Combinação de kickflip com 360 shuvit. Uma das manobras mais estéticas do skate de rua.",
        duracao: "3-6 meses",
        icon: "⚡"
    },
    {
        id: 5,
        nome: "Hardflip",
        nivel: "avancado",
        desc: "Frontside pop shuvit combinado com kickflip.",
        duracao: "6+ meses",
        icon: "💥"
    },
    {
        id: 6,
        nome: "Laser Flip",
        nivel: "avancado",
        desc: "Heelflip com 360 frontside shuvit.",
        duracao: "1+ ano",
        icon: "🔥"
    }
];

export const MONTAGEM_DEMO = [
    {
        id: 1,
        nome: "Como montar seu skate do zero",
        categoria: "montagem",
        desc: "Guia completo: shape, truck, rodas, rolamentos e grip.",
        icon: "🛹",
        duracao: "30 min"
    },
    {
        id: 2,
        nome: "Troca de rolamentos",
        categoria: "manutencao",
        desc: "Quando e como trocar os rolamentos.",
        icon: "🔩",
        duracao: "15 min"
    },
    {
        id: 3,
        nome: "Regulagem de trucks",
        categoria: "manutencao",
        desc: "Como ajustar o kingpin para seu estilo de andar.",
        icon: "🔧",
        duracao: "10 min"
    },
    {
        id: 4,
        nome: "Aplicação do grip tape",
        categoria: "montagem",
        desc: "Técnica correta para aplicar sem bolhas.",
        icon: "🪛",
        duracao: "20 min"
    }
];

export const EQUIPAMENTOS_DEMO = [
    {
        id: 1,
        nome: "Shape Powell Peralta",
        categoria: "Shape",
        nivel: "todos",
        desc: '8.0" de largura, maple canadense de 7 camadas.',
        icon: "🛹",
        preco_ref: "R$ 220–350"
    },
    {
        id: 2,
        nome: "Truck Independent 149",
        categoria: "Truck",
        nivel: "todos",
        desc: "Truck com geometria comprovada para street e bowl.",
        icon: "🔩",
        preco_ref: "R$ 180–280 (par)"
    },
    {
        id: 3,
        nome: "Roda Spitfire Formula Four",
        categoria: "Roda",
        nivel: "intermediario",
        desc: "99A de dureza e núcleo de poliuretano.",
        icon: "⚙️",
        preco_ref: "R$ 180–250"
    }
];

export const VIDEOS_DEMO = [
    {
        id: 1,
        titulo: "Ollie do Zero — Tutorial Completo",
        categoria: "Tutorial",
        canal: "Manual do Skatista",
        duracao: "8:42",
        thumbnail: null
    },
    {
        id: 2,
        titulo: "Sessão no Ibirapuera | Edit HD",
        categoria: "Edit",
        canal: "SP Skate Crew",
        duracao: "3:15",
        thumbnail: null
    },
    {
        id: 3,
        titulo: "Como fazer Kickflip — Passo a Passo",
        categoria: "Tutorial",
        canal: "Manual do Skatista",
        duracao: "11:20",
        thumbnail: null
    }
];

export const PISTAS_DEMO = [
    {
        id: 1,
        nome: "Pista do Ibirapuera",
        tipo: "livre",
        address: "Av. Pedro Álvares Cabral, São Paulo - SP",
        rating: 4.8,
        avaliacoes: 312,
        desc: "Pista pública com bowl, corrimão e manual pad."
    },
    {
        id: 2,
        nome: "Skate Park da Vila Leopoldina",
        tipo: "coberta",
        address: "Rua Guaicurus, São Paulo - SP",
        rating: 4.6,
        avaliacoes: 187,
        desc: "Coberta com iluminação noturna."
    },
    {
        id: 3,
        nome: "Pista da Orla de Santos",
        tipo: "livre",
        address: "Av. Bartolomeu de Gusmão, Santos - SP",
        rating: 4.5,
        avaliacoes: 98,
        desc: "Vista para o mar e sessões ao entardecer."
    }
];