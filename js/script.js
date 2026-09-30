/* ==========================================
   CONFIGURAÇÕES E BANCO DE DADOS
   ========================================== */

const STORAGE_KEY_ORCAMENTOS = 'jimo_orcamentos_db';
const STORAGE_KEY_TECNICOS = 'jimo_tecnicos_db';
const STORAGE_KEY_SESSAO = 'jimo_sessao_atual';
const CAMINHO_ORCAMENTOS = 'backend/orcamentos.json';
const CAMINHO_TECNICOS = 'backend/tecnicos.json';
const NUMERO_WHATSAPP = '5591982871598';

/* ==========================================
   DADOS PADRÃO (FALLBACK)
   Usados quando o fetch() falha (ex: abrindo via file://)
   ========================================== */

const TECNICOS_PADRAO = [
    {
        id: 'tec_master_001',
        nome: 'Administrador',
        usuario: 'admin',
        email: 'j.ivomota2@gmail.com',
        senha: 'admin123',
        ativo: true,
        isMaster: true
    }
];

const ORCAMENTOS_PADRAO = [
    {
        id: '20260529-1045',
        nome: 'João Silva',
        whatsapp: '(91) 98888-1111',
        equipamento: 'Smart TV / TV LED',
        marca: 'Samsung',
        modelo: '55UN7310',
        defeito: 'A TV liga, mas a tela fica escura. Suspeita de problema na placa de LED.',
        status: 'Aguardando Aprovação',
        orcamentoTecnico: {
            valor: '450.00',
            prazo: '3 dias úteis',
            descricao: 'Troca de 8 barras de LED + mão de obra',
            observacoes: 'Garantia de 90 dias',
            tecnico: 'Administrador',
            data: '29/05/2026'
        },
        tecnicoResponsavel: 'Administrador',
        data: '29/05/2026',
        dataISO: '2026-05-29T10:00:00.000Z'
    },
    {
        id: '20260530-2213',
        nome: 'Maria Oliveira',
        whatsapp: '(91) 97777-2222',
        equipamento: 'Placa Eletrônica',
        marca: 'LG',
        modelo: 'Placa de Som',
        defeito: 'Placa de som não liga. Capacitor estufado visível.',
        status: 'Pendente',
        orcamentoTecnico: null,
        tecnicoResponsavel: null,
        data: '30/05/2026',
        dataISO: '2026-05-30T14:30:00.000Z'
    }
];

/* ==========================================
   FUNÇÕES DE PERSISTÊNCIA
   ========================================== */

function carregarOrcamentos() {
    const dados = localStorage.getItem(STORAGE_KEY_ORCAMENTOS);
    return dados ? JSON.parse(dados) : [];
}

function salvarOrcamentos(orcamentos) {
    localStorage.setItem(STORAGE_KEY_ORCAMENTOS, JSON.stringify(orcamentos));
}

function carregarTecnicos() {
    const dados = localStorage.getItem(STORAGE_KEY_TECNICOS);
    return dados ? JSON.parse(dados) : [];
}

function salvarTecnicos(tecnicos) {
    localStorage.setItem(STORAGE_KEY_TECNICOS, JSON.stringify(tecnicos));
}

function obterSessaoAtual() {
    const dados = localStorage.getItem(STORAGE_KEY_SESSAO);
    return dados ? JSON.parse(dados) : null;
}

function salvarSessao(tecnico) {
    localStorage.setItem(STORAGE_KEY_SESSAO, JSON.stringify({
        id: tecnico.id,
        usuario: tecnico.usuario,
        nome: tecnico.nome,
        isMaster: tecnico.isMaster || false
    }));
}

function encerrarSessao() {
    localStorage.removeItem(STORAGE_KEY_SESSAO);
}

/* ==========================================
   INICIALIZAÇÃO DO BANCO (COM FALLBACK)
   ========================================== */

async function inicializarBanco() {
    // ---------- ORÇAMENTOS ----------
    if (carregarOrcamentos().length === 0) {
        let carregouDoBackend = false;
        try {
            const response = await fetch(CAMINHO_ORCAMENTOS);
            if (response.ok) {
                const dados = await response.json();
                if (Array.isArray(dados) && dados.length > 0) {
                    salvarOrcamentos(dados);
                    carregouDoBackend = true;
                    console.log('✅ Orçamentos carregados do backend.');
                }
            }
        } catch (e) {
            console.warn('⚠️ Fetch de orçamentos falhou. Usando dados padrão.');
        }

        if (!carregouDoBackend) {
            salvarOrcamentos(ORCAMENTOS_PADRAO);
            console.log('✅ Orçamentos padrão aplicados.');
        }
    }

    // ---------- TÉCNICOS ----------
    if (carregarTecnicos().length === 0) {
        let carregouDoBackend = false;
        try {
            const response = await fetch(CAMINHO_TECNICOS);
            if (response.ok) {
                const dados = await response.json();
                if (Array.isArray(dados) && dados.length > 0) {
                    salvarTecnicos(dados);
                    carregouDoBackend = true;
                    console.log('✅ Técnicos carregados do backend.');
                }
            }
        } catch (e) {
            console.warn('⚠️ Fetch de técnicos falhou. Usando dados padrão.');
        }

        if (!carregouDoBackend) {
            salvarTecnicos(TECNICOS_PADRAO);
            console.log('✅ Técnico master padrão criado (admin / admin123).');
        }
    }
}

/* ==========================================
   AUTENTICAÇÃO
   ========================================== */

function autenticarTecnico(usuario, senha) {
    const tecnicos = carregarTecnicos();
    const tecnico = tecnicos.find(t =>
        t.usuario.toLowerCase() === usuario.toLowerCase() &&
        t.senha === senha &&
        t.ativo !== false
    );
    return tecnico || null;
}

/* ==========================================
   GERAÇÃO DE ID DE OS
   ========================================== */

function gerarIdOS() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `${ano}${mes}${dia}-${random}`;
}

/* ==========================================
   INICIALIZAÇÃO GLOBAL
   ========================================== */

document.addEventListener('DOMContentLoaded', inicializarBanco);