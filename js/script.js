/* ==========================================
   CONFIGURAÇÕES E BANCO DE DADOS
   ========================================== */

const STORAGE_KEY = 'jimo_orcamentos_db';
const CAMINHO_BACKEND = 'backend/orcamentos.json';
const SENHA_ADMIN = 'admin123';
const NUMERO_WHATSAPP = '5591982871598';

/* Carrega orçamentos do localStorage */
function carregarOrcamentos() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

/* Salva orçamentos no localStorage */
function salvarOrcamentos(orcamentos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orcamentos));
}

/* Inicializa o banco lendo o JSON do backend (apenas na 1ª execução) */
async function inicializarBanco() {
    const orcamentosLocais = carregarOrcamentos();

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
        }
    } catch (error) {
        console.warn('Não foi possível carregar o JSON do backend. Iniciando banco vazio.', error);
    }
}

/* ==========================================
   MENU MOBILE
   ========================================== */
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');

mobileMenuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
    } else {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
    }
});

document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
    });
});

/* ==========================================
   FORMULÁRIO DE ORÇAMENTO (CLIENTE)
   ========================================== */
document.getElementById('formOrcamento').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const tipo = document.getElementById('tipoEquipamento').value;
    const marca = document.getElementById('marca').value.trim() || 'Não informada';
    const modelo = document.getElementById('modelo').value.trim() || 'Não informado';
    const defeito = document.getElementById('defeito').value.trim();

    const novoOrcamento = {
        id: Date.now(),
        nome: nome,
        whatsapp: whatsapp,
        equipamento: tipo,
        marca: marca,
        modelo: modelo,
        defeito: defeito,
        status: 'Pendente',
        data: new Date().toLocaleDateString('pt-BR')
    };

    const orcamentosAtuais = carregarOrcamentos();
    orcamentosAtuais.push(novoOrcamento);
    salvarOrcamentos(orcamentosAtuais);

    let mensagem = `*SOLICITAÇÃO DE ORÇAMENTO - JIMO ELETRÔNICA*\n\n`;
    mensagem += `🆔 *ID:* ${novoOrcamento.id}\n`;
    mensagem += `👤 *Cliente:* ${nome}\n`;
    mensagem += `📱 *Telefone:* ${whatsapp}\n`;
    mensagem += `🛠️ *Equipamento:* ${tipo}\n`;
    mensagem += `🏷️ *Marca:* ${marca}\n`;
    mensagem += `📺 *Modelo/Pol:* ${modelo}\n\n`;
    mensagem += `❌ *Defeito Informado:* ${defeito}\n\n`;
    mensagem += `_Mensagem enviada via site JIMO Eletrônica._`;

    const feedback = document.getElementById('orcamentoFeedback');
    feedback.classList.remove('hidden');

    const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

    setTimeout(() => {
        window.open(urlWhatsApp, '_blank');
        setTimeout(() => feedback.classList.add('hidden'), 3000);
    }, 800);

    this.reset();
});

/* ==========================================
   CONSULTA DE OS
   ========================================== */
function buscarOS() {
    const osInput = document.getElementById('inputNumeroOS').value.trim();
    const container = document.getElementById('resultadoOSContainer');
    const content = document.getElementById('resultadoOSContent');

    if (!osInput) {
        container.classList.remove('hidden');
        content.innerHTML = `
            <div class="flex items-center gap-3 text-amber-400">
                <i class="fa-solid fa-triangle-exclamation text-xl"></i>
                <span class="font-bold text-sm">Por favor, digite o número da sua Ordem de Serviço (OS).</span>
            </div>
        `;
        return;
    }

    const orcamentos = carregarOrcamentos();
    const osEncontrada = orcamentos.find(o =>
        o.id.toString() === osInput.replace(/\D/g, '') ||
        o.id.toString().includes(osInput)
    );

    container.classList.remove('hidden');

    if (osEncontrada) {
        content.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700 pb-3 gap-2">
                <div>
                    <span class="text-xs text-brand-cyan font-mono font-bold uppercase">Ordem de Serviço</span>
                    <h4 class="text-white font-extrabold text-lg">OS Nº ${osEncontrada.id}</h4>
                </div>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan text-xs font-semibold self-start sm:self-auto">
                    <i class="fa-solid fa-circle-info"></i> ${osEncontrada.status}
                </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 pt-1">
                <div><strong class="text-slate-400 block">Cliente:</strong><span>${osEncontrada.nome}</span></div>
                <div><strong class="text-slate-400 block">Equipamento:</strong><span>${osEncontrada.equipamento} ${osEncontrada.marca !== 'Não informada' ? '- ' + osEncontrada.marca : ''}</span></div>
                <div><strong class="text-slate-400 block">Data de Entrada:</strong><span>${osEncontrada.data}</span></div>
                <div><strong class="text-slate-400 block">Defeito Relatado:</strong><span>${osEncontrada.defeito}</span></div>
            </div>

            <div class="bg-brand-navy p-3 rounded-xl border border-brand-cyan/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mt-2">
                <span class="text-slate-300">Deseja falar diretamente sobre esta OS com o técnico?</span>
                <a href="https://wa.me/5591982871598?text=Ol%C3%A1,%20gostaria%20de%20informa%C3%A7%C3%B5es%20atualizadas%20sobre%20a%20OS%20N%C2%BA%20${osEncontrada.id}" target="_blank" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition">
                    <i class="fa-brands fa-whatsapp text-sm"></i> Consultar Via WhatsApp
                </a>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div class="flex items-center gap-3 text-amber-400">
                <i class="fa-solid fa-circle-exclamation text-xl"></i>
                <div>
                    <span class="font-bold text-sm block">OS não encontrada.</span>
                    <span class="text-xs text-slate-400">Verifique se o número digitado está correto ou entre em contato pelo WhatsApp.</span>
                </div>
            </div>
        `;
    }
}

/* ==========================================
   PAINEL DO TÉCNICO (ADMIN)
   ========================================== */
const adminPanel = document.getElementById('admin-panel');
const btnSairAdmin = document.getElementById('btnSairAdmin');
const btnAtualizarLista = document.getElementById('btnAtualizarLista');
const btnExportar = document.getElementById('btnExportar');
const listaAdmin = document.getElementById('listaOrcamentosAdmin');
const filtroAdmin = document.getElementById('filtroAdmin');

/* ---------- FUNÇÃO CENTRAL DE ACESSO ---------- */
function solicitarAcessoAdmin() {
    const senha = prompt('🔒 Digite a senha de acesso do técnico:');

    if (senha === SENHA_ADMIN) {
        // Fecha menu mobile se estiver aberto
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }

        adminPanel.classList.remove('hidden');
        adminPanel.scrollIntoView({ behavior: 'smooth' });
        renderizarOrcamentosAdmin();
        console.log('✅ Acesso concedido ao Painel do Técnico.');
    } else if (senha !== null) {
        alert('❌ Senha incorreta! Tente novamente.');
    }
}

/* ---------- MÉTODO 1: URL SECRETA (?admin=1) ---------- */
function verificarUrlSecreta() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1') {
        console.log('🔓 URL secreta detectada. Solicitando senha...');
        // Pequeno delay para garantir que o DOM está pronto
        setTimeout(solicitarAcessoAdmin, 500);
    }
}

/* ---------- MÉTODO 2: ATALHO DE TECLADO (Ctrl+Shift+A) ---------- */
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        console.log('⌨️ Atalho de teclado detectado.');
        solicitarAcessoAdmin();
    }
});

/* ---------- MÉTODO 3: 3 CLIQUES NO LOGO SEGURANDO CTRL ---------- */
const logoJimo = document.getElementById('logoJimo');
let contadorCliquesLogo = 0;
let timerResetCliques = null;

if (logoJimo) {
    logoJimo.addEventListener('click', (e) => {
        // Só conta se o CTRL estiver pressionado
        if (e.ctrlKey) {
            e.preventDefault(); // Impede de ir para #inicio
            contadorCliquesLogo++;
            console.log(`🖱️ Clique ${contadorCliquesLogo}/3 no logo (com Ctrl)`);

            // Limpa o timer anterior e cria um novo (reset em 2s)
            if (timerResetCliques) clearTimeout(timerResetCliques);
            timerResetCliques = setTimeout(() => {
                contadorCliquesLogo = 0;
            }, 2000);

            // Se atingiu 3 cliques, dispara
            if (contadorCliquesLogo >= 3) {
                contadorCliquesLogo = 0;
                clearTimeout(timerResetCliques);
                console.log('🎯 3 cliques detectados! Acesso secreto ativado.');
                solicitarAcessoAdmin();
            }
        } else {
            // Se clicar sem Ctrl, reseta o contador
            contadorCliquesLogo = 0;
        }
    });
}

/* ---------- MÉTODO 4: BOTÃO NO RODAPÉ ---------- */
const btnAcessoAdmin = document.getElementById('btnAcessoAdmin');
if (btnAcessoAdmin) {
    btnAcessoAdmin.addEventListener('click', solicitarAcessoAdmin);
}

/* ---------- SAIR DO PAINEL ---------- */
btnSairAdmin.addEventListener('click', () => {
    adminPanel.classList.add('hidden');
    console.log('🚪 Painel do Técnico fechado.');
});

/* ---------- RENDERIZAR ORÇAMENTOS ---------- */
function renderizarOrcamentosAdmin() {
    const orcamentos = carregarOrcamentos();
    const filtro = filtroAdmin.value.toLowerCase();

    listaAdmin.innerHTML = '';

    const filtrados = orcamentos.filter(o =>
        o.nome.toLowerCase().includes(filtro) ||
        o.id.toString().includes(filtro) ||
        o.status.toLowerCase().includes(filtro)
    );

    if (filtrados.length === 0) {
        listaAdmin.innerHTML = '<p class="text-center text-slate-500 py-8">Nenhum orçamento encontrado.</p>';
        return;
    }

    filtrados.sort((a, b) => b.id - a.id);

    filtrados.forEach(orc => {
        const card = document.createElement('div');
        card.className = 'bg-brand-slate/80 p-5 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4';

        const statusColors = {
            'Pendente': 'bg-amber-500/20 text-amber-400 border-amber-500/40',
            'Em Andamento': 'bg-blue-500/20 text-blue-400 border-blue-500/40',
            'Concluído': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
        };
        const statusColor = statusColors[orc.status] || 'bg-slate-500/20 text-slate-400 border-slate-500/40';

        card.innerHTML = `
            <div class="flex-1 space-y-1">
                <div class="flex items-center gap-3 flex-wrap">
                    <span class="text-brand-cyan font-mono text-xs font-bold bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/30">ID: ${orc.id}</span>
                    <span class="text-xs text-slate-400">${orc.data}</span>
                    <span class="text-xs px-2 py-0.5 rounded-full border ${statusColor} font-semibold">${orc.status}</span>
                </div>
                <h4 class="text-white font-bold text-base">${orc.nome}</h4>
                <p class="text-xs text-slate-300"><strong>Equipamento:</strong> ${orc.equipamento} ${orc.marca !== 'Não informada' ? '- ' + orc.marca : ''} ${orc.modelo !== 'Não informado' ? '| ' + orc.modelo : ''}</p>
                <p class="text-xs text-slate-400"><strong>Defeito:</strong> ${orc.defeito}</p>
                <p class="text-xs text-slate-400"><strong>WhatsApp:</strong> ${orc.whatsapp || 'Não informado'}</p>
            </div>
            <div class="flex flex-col gap-2 w-full md:w-auto">
                <select onchange="atualizarStatusAdmin(${orc.id}, this.value)" class="bg-brand-dark border border-slate-600 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-brand-cyan cursor-pointer">
                    <option value="Pendente" ${orc.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                    <option value="Em Andamento" ${orc.status === 'Em Andamento' ? 'selected' : ''}>Em Andamento</option>
                    <option value="Concluído" ${orc.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                </select>
                <a href="https://wa.me/${orc.whatsapp ? orc.whatsapp.replace(/\D/g, '') : NUMERO_WHATSAPP}?text=Ol%C3%A1%20${encodeURIComponent(orc.nome)},%20sobre%20a%20OS%20${orc.id}..." target="_blank" class="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition">
                    <i class="fa-brands fa-whatsapp"></i> Contatar
                </a>
            </div>
        `;
        listaAdmin.appendChild(card);
    });
}

/* ---------- ATUALIZAR STATUS ---------- */
window.atualizarStatusAdmin = function (id, novoStatus) {
    const orcamentos = carregarOrcamentos();
    const index = orcamentos.findIndex(o => o.id === id);

    if (index !== -1) {
        orcamentos[index].status = novoStatus;
        salvarOrcamentos(orcamentos);
        renderizarOrcamentosAdmin();
    }
};

/* ---------- BOTÕES DO PAINEL ---------- */
btnAtualizarLista.addEventListener('click', renderizarOrcamentosAdmin);
filtroAdmin.addEventListener('input', renderizarOrcamentosAdmin);

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
document.addEventListener('DOMContentLoaded', () => {
    inicializarBanco();
    verificarUrlSecreta(); // Verifica se a URL secreta foi usada
});
