/* ==========================================
   CONFIGURAÇÕES E BANCO DE DADOS
   ========================================== */

const STORAGE_KEY = 'jimo_orcamentos_db';
const CAMINHO_BACKEND = 'backend/orcamentos.json';
const SENHA_ADMIN = 'admin123';
const NUMERO_WHATSAPP = '5591982871598';

/* Carrega os orçamentos salvos no navegador */
function carregarOrcamentos() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

/* Salva os orçamentos no navegador */
function salvarOrcamentos(orcamentos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orcamentos));
}

/* Inicializa o banco lendo o arquivo JSON do backend (apenas na 1ª vez) */
async function inicializarBanco() {
    const orcamentosLocais = carregarOrcamentos();
    
    // Se já existem dados no localStorage, não sobrescreve
    if (orcamentosLocais.length > 0) {
        console.log('Banco local já possui dados. Ignorando seed do backend.');
        return;
    }

    try {
        const response = await fetch(CAMINHO_BACKEND);
        if (response.ok) {
            const dadosIniciais = await response.json();
            salvarOrcamentos(dadosIniciais);
            console.log('Banco inicializado a partir de backend/orcamentos.json');
        } else {
            console.warn('Arquivo backend/orcamentos.json não encontrado ou vazio.');
        }
    } catch (error) {
        console.warn('Não foi possível carregar o JSON do backend. Iniciando banco vazio.', error);
    }
}

/* ==========================================
   FORMULÁRIO DO CLIENTE
   ========================================== */

document.getElementById('quoteForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const equipamento = document.getElementById('equipamento').value;
    const defeito = document.getElementById('defeito').value.trim();

    const novoOrcamento = {
        id: Date.now(),
        nome: nome,
        equipamento: equipamento,
        defeito: defeito,
        status: 'Pendente',
        data: new Date().toLocaleDateString('pt-BR')
    };

    // 1. Salva no banco local
    const orcamentosAtuais = carregarOrcamentos();
    orcamentosAtuais.push(novoOrcamento);
    salvarOrcamentos(orcamentosAtuais);

    // 2. Monta mensagem do WhatsApp
    const mensagem = 
        `Olá, Jimo Eletrônica! Gostaria de solicitar um orçamento.%0A%0A` +
        `*ID:* ${novoOrcamento.id}%0A` +
        `*Nome:* ${nome}%0A` +
        `*Equipamento:* ${equipamento}%0A` +
        `*Defeito:* ${defeito}`;

    const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensagem}`;
    window.open(urlWhatsApp, '_blank');

    // 3. Limpa o formulário
    this.reset();
    alert('Orçamento registrado com sucesso! Você será redirecionado para o WhatsApp.');
});

/* ==========================================
   PAINEL DO TÉCNICO
   ========================================== */

const areaCliente = document.getElementById('area-cliente');
const areaTecnico = document.getElementById('area-tecnico');
const btnAcessoAdmin = document.getElementById('btnAcessoAdmin');
const btnSair = document.getElementById('btnSair');
const btnAtualizarLista = document.getElementById('btnAtualizarLista');
const btnExportar = document.getElementById('btnExportar');
const listaOrcamentosDiv = document.getElementById('listaOrcamentos');

/* Acessa o painel */
btnAcessoAdmin.addEventListener('click', () => {
    const senha = prompt('Digite a senha de acesso:');
    if (senha === SENHA_ADMIN) {
        areaCliente.style.display = 'none';
        areaTecnico.style.display = 'block';
        renderizarOrcamentos();
    } else if (senha !== null) {
        alert('Senha incorreta!');
    }
});

/* Sai do painel */
btnSair.addEventListener('click', () => {
    areaTecnico.style.display = 'none';
    areaCliente.style.display = 'block';
});

/* Renderiza a lista de orçamentos */
function renderizarOrcamentos() {
    const orcamentos = carregarOrcamentos();
    listaOrcamentosDiv.innerHTML = '';

    if (orcamentos.length === 0) {
        listaOrcamentosDiv.innerHTML = '<p style="text-align:center; color:#666;">Nenhum orçamento cadastrado.</p>';
        return;
    }

    // Ordena do mais recente para o mais antigo
    orcamentos.sort((a, b) => b.id - a.id);

    orcamentos.forEach(orc => {
        const card = document.createElement('div');
        card.className = 'orcamento-card';

        const statusClass = `status-${orc.status.replace(/\s+/g, '-')}`;

        card.innerHTML = `
            <div class="orcamento-info">
                <p><strong>ID:</strong> ${orc.id} | <strong>Data:</strong> ${orc.data}</p>
                <p><strong>Cliente:</strong> ${orc.nome}</p>
                <p><strong>Equipamento:</strong> ${orc.equipamento}</p>
                <p><strong>Defeito:</strong> ${orc.defeito}</p>
                <p>Status: <span class="status-badge ${statusClass}">${orc.status}</span></p>
            </div>
            <div class="orcamento-actions">
                <select onchange="atualizarStatus(${orc.id}, this.value)">
                    <option value="Pendente" ${orc.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                    <option value="Em Andamento" ${orc.status === 'Em Andamento' ? 'selected' : ''}>Em Andamento</option>
                    <option value="Concluído" ${orc.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                </select>
            </div>
        `;
        listaOrcamentosDiv.appendChild(card);
    });
}

/* Atualiza o status de um orçamento */
window.atualizarStatus = function (id, novoStatus) {
    const orcamentos = carregarOrcamentos();
    const index = orcamentos.findIndex(o => o.id === id);

    if (index !== -1) {
        orcamentos[index].status = novoStatus;
        salvarOrcamentos(orcamentos);
        renderizarOrcamentos();
        console.log(`Orçamento ${id} atualizado para: ${novoStatus}`);
    }
};

/* Botão: Atualizar lista manualmente */
btnAtualizarLista.addEventListener('click', renderizarOrcamentos);

/* Botão: Exportar backup JSON */
btnExportar.addEventListener('click', () => {
    const orcamentos = carregarOrcamentos();
    const dataStr = JSON.stringify(orcamentos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_orcamentos_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

/* ==========================================
   INICIALIZAÇÃO
   ========================================== */
document.addEventListener('DOMContentLoaded', inicializarBanco);
