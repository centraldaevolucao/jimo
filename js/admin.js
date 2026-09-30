/* ==========================================
   PAINEL DO TÉCNICO
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const telaLogin = document.getElementById('telaLogin');
    const painelTecnico = document.getElementById('painelTecnico');
    const formLogin = document.getElementById('formLogin');
    const loginErro = document.getElementById('loginErro');
    const usuarioLogado = document.getElementById('usuarioLogado');
    const badgeTipo = document.getElementById('badgeTipo');
    const btnSairAdmin = document.getElementById('btnSairAdmin');

    const sessao = obterSessaoAtual();
    if (sessao) {
        mostrarPainel(sessao);
    }

    /* ---------- LOGIN ---------- */
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const usuario = document.getElementById('loginUsuario').value.trim();
        const senha = document.getElementById('loginSenha').value;

        const tecnico = autenticarTecnico(usuario, senha);

        if (tecnico) {
            salvarSessao(tecnico);
            loginErro.classList.add('hidden');
            mostrarPainel({
                id: tecnico.id,
                usuario: tecnico.usuario,
                nome: tecnico.nome,
                email: tecnico.email || '',
                telefone: tecnico.telefone || '',
                isMaster: tecnico.isMaster || false
            });
        } else {
            loginErro.textContent = '❌ Usuário ou senha inválidos. Verifique e tente novamente.';
            loginErro.classList.remove('hidden');
        }
    });

    /* ---------- MOSTRAR PAINEL ---------- */
    function mostrarPainel(sessao) {
        telaLogin.classList.add('hidden');
        painelTecnico.classList.remove('hidden');

        usuarioLogado.textContent = `${sessao.nome} (${sessao.usuario})`;

        if (badgeTipo) {
            if (sessao.isMaster) {
                badgeTipo.innerHTML = '<i class="fa-solid fa-crown"></i> Administrador';
                badgeTipo.className = 'text-[10px] bg-amber-500/20 text-amber-400 px-2 py-1 rounded font-bold uppercase tracking-wide border border-amber-500/40';
            } else {
                badgeTipo.innerHTML = '<i class="fa-solid fa-screwdriver-wrench"></i> Técnico';
                badgeTipo.className = 'text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded font-bold uppercase tracking-wide border border-cyan-500/40';
            }
        }

        const btnAbaTecnicos = document.getElementById('btnAbaTecnicos');
        if (btnAbaTecnicos) {
            if (sessao.isMaster) {
                btnAbaTecnicos.classList.remove('hidden');
            } else {
                btnAbaTecnicos.classList.add('hidden');
                const abaAtiva = document.querySelector('.aba-btn.active')?.getAttribute('data-aba');
                if (abaAtiva === 'aba-tecnicos') trocarAba('aba-os');
            }
        }

        preencherPerfil(sessao);
        renderizarOrcamentosAdmin(sessao);
        renderizarTecnicos(sessao);
    }

    /* ---------- SAIR ---------- */
    btnSairAdmin.addEventListener('click', () => {
        if (confirm('Deseja sair do painel?')) {
            encerrarSessao();
            location.reload();
        }
    });

    /* ---------- ABAS ---------- */
    document.querySelectorAll('.aba-btn').forEach(btn => {
        btn.addEventListener('click', () => trocarAba(btn.getAttribute('data-aba')));
    });

    /* ---------- FILTROS E BOTÕES ---------- */
    document.getElementById('filtroAdmin')?.addEventListener('input', () => renderizarOrcamentosAdmin(obterSessaoAtual()));
    document.getElementById('btnAtualizarLista')?.addEventListener('click', () => renderizarOrcamentosAdmin(obterSessaoAtual()));
    document.getElementById('btnNovoTecnico')?.addEventListener('click', () => abrirModalTecnico(null));

    /* ---------- FORM: ALTERAR PRÓPRIA SENHA ---------- */
    const formAlterarSenha = document.getElementById('formAlterarSenha');
    formAlterarSenha?.addEventListener('submit', (e) => {
        e.preventDefault();

        const sessao = obterSessaoAtual();
        if (!sessao) {
            alert('❌ Sessão expirada. Faça login novamente.');
            return;
        }

        const senhaAtual = document.getElementById('senhaAtual').value;
        const novaSenha = document.getElementById('novaSenha').value;
        const confirmar = document.getElementById('confirmarNovaSenha').value;
        const feedback = document.getElementById('senhaFeedback');

        const exibirFeedback = (msg, tipo) => {
            feedback.textContent = msg;
            feedback.className = 'text-xs text-center rounded-lg py-2 px-3';
            if (tipo === 'sucesso') {
                feedback.classList.add('bg-emerald-500/20', 'text-emerald-400', 'border', 'border-emerald-500/40');
            } else {
                feedback.classList.add('bg-red-500/20', 'text-red-400', 'border', 'border-red-500/40');
            }
            feedback.classList.remove('hidden');
        };

        if (novaSenha.length < 4) {
            exibirFeedback('❌ A nova senha deve ter pelo menos 4 caracteres.', 'erro');
            return;
        }
        if (novaSenha !== confirmar) {
            exibirFeedback('❌ As senhas não coincidem.', 'erro');
            return;
        }
        if (novaSenha === senhaAtual) {
            exibirFeedback('❌ A nova senha deve ser diferente da atual.', 'erro');
            return;
        }

        const tecnicos = carregarTecnicos();
        const idx = tecnicos.findIndex(t => t.id === sessao.id);
        if (idx === -1) {
            exibirFeedback('❌ Técnico não encontrado.', 'erro');
            return;
        }
        if (tecnicos[idx].senha !== senhaAtual) {
            exibirFeedback('❌ Senha atual incorreta.', 'erro');
            return;
        }

        tecnicos[idx].senha = novaSenha;
        salvarTecnicos(tecnicos);

        exibirFeedback('✅ Senha alterada com sucesso!', 'sucesso');
        formAlterarSenha.reset();
        setTimeout(() => feedback.classList.add('hidden'), 4000);
    });
});

/* ==========================================
   TROCAR ABA
   ========================================== */
function trocarAba(abaId) {
    document.querySelectorAll('.aba-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.aba-conteudo').forEach(c => c.classList.add('hidden'));

    const btn = document.querySelector(`[data-aba="${abaId}"]`);
    const conteudo = document.getElementById(abaId);
    if (btn) btn.classList.add('active');
    if (conteudo) conteudo.classList.remove('hidden');
}

/* ==========================================
   PREENCHER PERFIL
   ========================================== */
function preencherPerfil(sessao) {
    const nomeEl = document.getElementById('perfilNome');
    const usuarioEl = document.getElementById('perfilUsuario');
    const emailEl = document.getElementById('perfilEmail');
    const telefoneEl = document.getElementById('perfilTelefone');

    if (nomeEl) nomeEl.textContent = sessao.nome;
    if (usuarioEl) usuarioEl.textContent = '@' + sessao.usuario;
    if (emailEl) emailEl.textContent = sessao.email || 'Não cadastrado';
    if (telefoneEl) telefoneEl.textContent = sessao.telefone || 'Não cadastrado';
}

/* ==========================================
   RENDERIZAR ORÇAMENTOS
   ========================================== */
function renderizarOrcamentosAdmin(sessao) {
    const lista = document.getElementById('listaOrcamentosAdmin');
    if (!lista) return;

    const filtro = (document.getElementById('filtroAdmin')?.value || '').toLowerCase();
    const orcamentos = carregarOrcamentos();

    const filtrados = orcamentos.filter(o =>
        o.nome.toLowerCase().includes(filtro) ||
        o.id.toLowerCase().includes(filtro) ||
        o.status.toLowerCase().includes(filtro)
    );

    if (filtrados.length === 0) {
        lista.innerHTML = '<p class="text-center text-slate-500 py-8">Nenhuma OS encontrada.</p>';
        return;
    }

    filtrados.sort((a, b) => new Date(b.dataISO || 0) - new Date(a.dataISO || 0));
    lista.innerHTML = '';

    filtrados.forEach(os => {
        const card = document.createElement('div');
        card.className = 'bg-brand-slate/80 p-5 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4';

        const statusColors = {
            'Pendente': 'bg-amber-500/20 text-amber-400 border-amber-500/40',
            'Em Andamento': 'bg-blue-500/20 text-blue-400 border-blue-500/40',
            'Aguardando Aprovação': 'bg-purple-500/20 text-purple-400 border-purple-500/40',
            'Aprovado': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
            'Concluído': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
            'Recusado': 'bg-red-500/20 text-red-400 border-red-500/40'
        };
        const statusColor = statusColors[os.status] || 'bg-slate-500/20 text-slate-400';

        card.innerHTML = `
            <div class="flex-1 space-y-1">
                <div class="flex items-center gap-3 flex-wrap">
                    <span class="text-brand-cyan font-mono text-xs font-bold bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/30">OS: ${os.id}</span>
                    <span class="text-xs text-slate-400">${os.data}</span>
                    <span class="text-xs px-2 py-0.5 rounded-full border ${statusColor} font-semibold">${os.status}</span>
                    ${os.orcamentoTecnico ? '<span class="text-xs text-emerald-400">✅ Com orçamento</span>' : '<span class="text-xs text-amber-400">⏳ Sem orçamento</span>'}
                </div>
                <h4 class="text-white font-bold">${os.nome}</h4>
                <p class="text-xs text-slate-300"><strong>Equip:</strong> ${os.equipamento} ${os.marca !== 'Não informada' ? '- ' + os.marca : ''}</p>
                <p class="text-xs text-slate-400"><strong>Defeito:</strong> ${os.defeito}</p>
                <p class="text-xs text-slate-400"><strong>WhatsApp:</strong> ${os.whatsapp}</p>
                <p class="text-xs text-slate-400"><strong>Técnico:</strong> ${os.tecnicoResponsavel || 'Não atribuído'}</p>
                ${os.orcamentoTecnico ? `<p class="text-xs text-emerald-400"><strong>Orçamento:</strong> R$ ${parseFloat(os.orcamentoTecnico.valor).toFixed(2)} — ${os.orcamentoTecnico.prazo}</p>` : ''}
            </div>
            <div class="flex flex-col gap-2 w-full md:w-auto">
                <select onchange="atualizarStatusAdmin('${os.id}', this.value)" class="bg-brand-dark border border-slate-600 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-brand-cyan cursor-pointer">
                    ${['Pendente','Em Andamento','Aguardando Aprovação','Aprovado','Concluído','Recusado'].map(s =>
                        `<option value="${s}" ${os.status === s ? 'selected' : ''}>${s}</option>`
                    ).join('')}
                </select>
                <button onclick="abrirModalOrcamento('${os.id}')" class="bg-brand-cyan hover:bg-brand-lightCyan text-brand-dark text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition">
                    <i class="fa-solid fa-file-invoice-dollar"></i> ${os.orcamentoTecnico ? 'Editar Orçamento' : 'Criar Orçamento'}
                </button>
                <a href="https://wa.me/${os.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(os.nome)},%20sobre%20a%20OS%20${os.id}" target="_blank" class="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition">
                    <i class="fa-brands fa-whatsapp"></i> Contatar
                </a>
            </div>`;
        lista.appendChild(card);
    });
}

/* ==========================================
   ATUALIZAR STATUS
   ========================================== */
window.atualizarStatusAdmin = function (id, novoStatus) {
    const orcamentos = carregarOrcamentos();
    const index = orcamentos.findIndex(o => o.id === id);
    if (index !== -1) {
        orcamentos[index].status = novoStatus;
        salvarOrcamentos(orcamentos);
        renderizarOrcamentosAdmin(obterSessaoAtual());
    }
};

/* ==========================================
   MODAL DE ORÇAMENTO TÉCNICO
   ========================================== */
window.abrirModalOrcamento = function (id) {
    const orcamentos = carregarOrcamentos();
    const os = orcamentos.find(o => o.id === id);
    if (!os) return;

    const sessao = obterSessaoAtual();
    const tecnicoNome = sessao ? sessao.nome : 'Técnico';
    const orc = os.orcamentoTecnico || { valor: '', prazo: '', descricao: '', observacoes: '' };

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'modalOrcamento';
    modal.innerHTML = `
        <div class="modal-content p-6">
            <div class="flex justify-between items-center mb-5 border-b border-slate-700 pb-3">
                <h3 class="text-white font-bold text-lg flex items-center gap-2">
                    <i class="fa-solid fa-file-invoice-dollar text-brand-cyan"></i>
                    Orçamento Técnico - OS ${os.id}
                </h3>
                <button onclick="fecharModal('modalOrcamento')" class="text-slate-400 hover:text-red-400 text-xl">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>

            <div class="bg-brand-dark/60 rounded-lg p-3 mb-4 text-xs text-slate-300">
                <p><strong class="text-slate-400">Cliente:</strong> ${os.nome}</p>
                <p><strong class="text-slate-400">Equipamento:</strong> ${os.equipamento}</p>
                <p><strong class="text-slate-400">Defeito:</strong> ${os.defeito}</p>
            </div>

            <form id="formOrcamentoTecnico" class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Valor (R$) *</label>
                    <input type="number" step="0.01" min="0" id="orcValor" required value="${orc.valor}" placeholder="Ex: 350.00" class="w-full bg-brand-dark border border-slate-700 focus:border-brand-cyan rounded-lg py-2.5 px-3 text-sm text-white outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Prazo de Entrega *</label>
                    <input type="text" id="orcPrazo" required value="${orc.prazo}" placeholder="Ex: 3 dias úteis" class="w-full bg-brand-dark border border-slate-700 focus:border-brand-cyan rounded-lg py-2.5 px-3 text-sm text-white outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Descrição do Serviço *</label>
                    <textarea id="orcDescricao" required rows="3" placeholder="Ex: Troca de 8 barras de LED + mão de obra" class="w-full bg-brand-dark border border-slate-700 focus:border-brand-cyan rounded-lg py-2.5 px-3 text-sm text-white outline-none resize-none">${orc.descricao}</textarea>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Observações (opcional)</label>
                    <textarea id="orcObs" rows="2" placeholder="Ex: Garantia de 90 dias" class="w-full bg-brand-dark border border-slate-700 focus:border-brand-cyan rounded-lg py-2.5 px-3 text-sm text-white outline-none resize-none">${orc.observacoes}</textarea>
                </div>

                <div class="flex gap-3 pt-3">
                    <button type="button" onclick="fecharModal('modalOrcamento')" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition">
                        Cancelar
                    </button>
                    <button type="submit" class="flex-1 bg-gradient-to-r from-brand-cyan to-brand-blue text-brand-dark font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
                        <i class="fa-solid fa-save"></i> Salvar Orçamento
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('formOrcamentoTecnico').addEventListener('submit', (e) => {
        e.preventDefault();
        const valor = document.getElementById('orcValor').value;
        const prazo = document.getElementById('orcPrazo').value;
        const descricao = document.getElementById('orcDescricao').value;
        const obs = document.getElementById('orcObs').value;

        const orcamentos = carregarOrcamentos();
        const index = orcamentos.findIndex(o => o.id === id);
        if (index !== -1) {
            orcamentos[index].orcamentoTecnico = {
                valor: valor,
                prazo: prazo,
                descricao: descricao,
                observacoes: obs,
                tecnico: tecnicoNome,
                data: new Date().toLocaleDateString('pt-BR')
            };
            orcamentos[index].tecnicoResponsavel = tecnicoNome;
            if (orcamentos[index].status === 'Pendente' || orcamentos[index].status === 'Em Andamento') {
                orcamentos[index].status = 'Aguardando Aprovação';
            }
            salvarOrcamentos(orcamentos);
            renderizarOrcamentosAdmin(obterSessaoAtual());
            fecharModal('modalOrcamento');
        }
    });
};

/* ==========================================
   FECHAR MODAL
   ========================================== */
window.fecharModal = function (id) {
    const modal = document.getElementById(id);
    if (modal) modal.remove();
};

/* ==========================================
   LISTA DE TÉCNICOS
   ========================================== */
function renderizarTecnicos(sessao) {
    const lista = document.getElementById('listaTecnicos');
    if (!lista) return;

    const tecnicos = carregarTecnicos();
    lista.innerHTML = '';

    tecnicos.forEach(t => {
        const card = document.createElement('div');
        card.className = 'bg-brand-slate/80 p-4 rounded-xl border border-slate-700 flex justify-between items-center gap-3 flex-wrap';
        card.innerHTML = `
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                    <i class="fa-solid ${t.isMaster ? 'fa-crown text-amber-400' : 'fa-user text-brand-cyan'}"></i>
                    <strong class="text-white">${t.nome}</strong>
                    ${t.isMaster ? '<span class="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold uppercase border border-amber-500/40">Administrador</span>' : ''}
                    ${t.ativo === false ? '<span class="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase border border-red-500/40">Inativo</span>' : '<span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase border border-emerald-500/40">Ativo</span>'}
                </div>
                <p class="text-xs text-slate-400 mt-1">Usuário: <span class="text-slate-300">@${t.usuario}</span></p>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    ${t.email ? `<p class="text-xs text-slate-400"><i class="fa-solid fa-envelope text-brand-cyan/70 mr-1"></i>${t.email}</p>` : ''}
                    ${t.telefone ? `<p class="text-xs text-slate-400"><i class="fa-brands fa-whatsapp text-emerald-400 mr-1"></i>${t.telefone}</p>` : ''}
                </div>
            </div>
            <div class="flex gap-2 flex-wrap">
                <button onclick="abrirModalSenha('${t.id}')" class="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1 transition" title="Trocar senha deste técnico">
                    <i class="fa-solid fa-key"></i> Senha
                </button>
                <button onclick="abrirModalTecnico('${t.id}')" class="bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1 transition">
                    <i class="fa-solid fa-edit"></i> Editar
                </button>
                ${!t.isMaster ? `<button onclick="excluirTecnico('${t.id}')" class="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1 transition">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>` : ''}
            </div>`;
        lista.appendChild(card);
    });
}

/* ==========================================
   MODAL DE TÉCNICO (CADASTRO/EDIÇÃO)
   ========================================== */
window.abrirModalTecnico = function (id = null) {
    const sessao = obterSessaoAtual();
    if (!sessao || !sessao.isMaster) {
        alert('❌ Apenas administradores podem gerenciar técnicos.');
        return;
    }

    const tecnicos = carregarTecnicos();
    const tecnico = id ? tecnicos.find(t => t.id === id) : null;
    const isEdit = !!tecnico;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'modalTecnico';
    modal.innerHTML = `
        <div class="modal-content p-6">
            <div class="flex justify-between items-center mb-5 border-b border-slate-700 pb-3">
                <h3 class="text-white font-bold text-lg flex items-center gap-2">
                    <i class="fa-solid fa-user-gear text-brand-cyan"></i>
                    ${isEdit ? 'Editar Técnico' : 'Cadastrar Novo Técnico'}
                </h3>
                <button onclick="fecharModal('modalTecnico')" class="text-slate-400 hover:text-red-400 text-xl">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>

            <form id="formTecnico" class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Nome Completo *</label>
                    <input type="text" id="tecNome" required value="${tecnico?.nome || ''}" placeholder="Ex: Carlos Souza" class="w-full bg-brand-dark border border-slate-700 focus:border-brand-cyan rounded-lg py-2.5 px-3 text-sm text-white outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Usuário de Acesso *</label>
                    <input type="text" id="tecUsuario" required value="${tecnico?.usuario || ''}" ${tecnico?.isMaster ? 'readonly' : ''} placeholder="Ex: carlos.souza" class="w-full bg-brand-dark border border-slate-700 focus:border-brand-cyan rounded-lg py-2.5 px-3 text-sm text-white outline-none ${tecnico?.isMaster ? 'opacity-60 cursor-not-allowed' : ''}">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">E-mail *</label>
                    <input type="email" id="tecEmail" required value="${tecnico?.email || ''}" placeholder="tecnico@jimo.com" class="w-full bg-brand-dark border border-slate-700 focus:border-brand-cyan rounded-lg py-2.5 px-3 text-sm text-white outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Telefone / WhatsApp *</label>
                    <input type="tel" id="tecTelefone" required value="${tecnico?.telefone || ''}" placeholder="(91) 98888-8888" class="w-full bg-brand-dark border border-slate-700 focus:border-brand-cyan rounded-lg py-2.5 px-3 text-sm text-white outline-none">
                </div>

                ${!isEdit ? `
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Senha Inicial *</label>
                    <input type="password" id="tecSenha" required placeholder="Mínimo 4 caracteres" class="w-full bg-brand-dark border border-slate-700 focus:border-brand-cyan rounded-lg py-2.5 px-3 text-sm text-white outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Confirmar Senha *</label>
                    <input type="password" id="tecSenha2" required placeholder="Repita a senha" class="w-full bg-brand-dark border border-slate-700 focus:border-brand-cyan rounded-lg py-2.5 px-3 text-sm text-white outline-none">
                </div>` : `
                <div class="bg-brand-dark/60 p-3 rounded-lg border border-slate-700 text-xs text-slate-400">
                    <i class="fa-solid fa-info-circle text-brand-cyan mr-1"></i>
                    Para alterar a senha, use o botão <strong class="text-amber-400">"Senha"</strong> na lista de técnicos.
                </div>`}

                ${!tecnico?.isMaster ? `
                <div class="flex items-center gap-2">
                    <input type="checkbox" id="tecAtivo" ${tecnico?.ativo !== false ? 'checked' : ''} class="w-4 h-4 accent-brand-cyan">
                    <label for="tecAtivo" class="text-xs text-slate-300">Técnico ativo (pode fazer login)</label>
                </div>` : ''}

                <p id="tecFeedback" class="hidden text-xs text-center rounded-lg py-2 px-3"></p>

                <div class="flex gap-3 pt-3">
                    <button type="button" onclick="fecharModal('modalTecnico')" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition">Cancelar</button>
                    <button type="submit" class="flex-1 bg-gradient-to-r from-brand-cyan to-brand-blue text-brand-dark font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
                        <i class="fa-solid fa-save"></i> ${isEdit ? 'Salvar Alterações' : 'Cadastrar'}
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('formTecnico').addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('tecNome').value.trim();
        const usuario = document.getElementById('tecUsuario').value.trim().toLowerCase();
        const email = document.getElementById('tecEmail').value.trim();
        const telefone = document.getElementById('tecTelefone').value.trim();
        const ativo = document.getElementById('tecAtivo')?.checked ?? true;
        const feedback = document.getElementById('tecFeedback');

        const exibirFeedback = (msg, tipo) => {
            feedback.textContent = msg;
            feedback.className = 'text-xs text-center rounded-lg py-2 px-3';
            if (tipo === 'sucesso') {
                feedback.classList.add('bg-emerald-500/20', 'text-emerald-400', 'border', 'border-emerald-500/40');
            } else {
                feedback.classList.add('bg-red-500/20', 'text-red-400', 'border', 'border-red-500/40');
            }
            feedback.classList.remove('hidden');
        };

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            exibirFeedback('❌ E-mail inválido.', 'erro');
            return;
        }
        if (telefone.replace(/\D/g, '').length < 10) {
            exibirFeedback('❌ Telefone inválido (informe DDD + número).', 'erro');
            return;
        }

        const tecnicos = carregarTecnicos();
        const conflito = tecnicos.find(t => t.usuario === usuario && t.id !== id);
        if (conflito) {
            exibirFeedback('❌ Este usuário já está em uso por outro técnico.', 'erro');
            return;
        }

        if (isEdit) {
            const index = tecnicos.findIndex(t => t.id === id);
            tecnicos[index].nome = nome;
            tecnicos[index].usuario = usuario;
            tecnicos[index].email = email;
            tecnicos[index].telefone = telefone;
            if (!tecnicos[index].isMaster) tecnicos[index].ativo = ativo;
            salvarTecnicos(tecnicos);
            exibirFeedback('✅ Técnico atualizado!', 'sucesso');
        } else {
            const senha = document.getElementById('tecSenha').value;
            const senha2 = document.getElementById('tecSenha2').value;
            if (senha !== senha2) {
                exibirFeedback('❌ As senhas não coincidem!', 'erro');
                return;
            }
            if (senha.length < 4) {
                exibirFeedback('❌ A senha deve ter pelo menos 4 caracteres.', 'erro');
                return;
            }
            tecnicos.push({
                id: 'tec_' + Date.now(),
                nome: nome,
                usuario: usuario,
                email: email,
                telefone: telefone,
                senha: senha,
                ativo: ativo,
                isMaster: false
            });
            salvarTecnicos(tecnicos);
            exibirFeedback('✅ Técnico cadastrado com sucesso!', 'sucesso');
        }

        setTimeout(() => {
            renderizarTecnicos(obterSessaoAtual());
            fecharModal('modalTecnico');
        }, 900);
    });
};

/* ==========================================
   MODAL DE ALTERAÇÃO DE SENHA (ADMIN → TÉCNICO)
   ========================================== */
window.abrirModalSenha = function (id) {
    const sessao = obterSessaoAtual();
    if (!sessao || !sessao.isMaster) {
        alert('❌ Apenas administradores podem alterar senhas de outros técnicos.');
        return;
    }

    const tecnicos = carregarTecnicos();
    const tecnico = tecnicos.find(t => t.id === id);
    if (!tecnico) {
        alert('❌ Técnico não encontrado.');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'modalSenha';
    modal.innerHTML = `
        <div class="modal-content p-6">
            <div class="flex justify-between items-center mb-5 border-b border-slate-700 pb-3">
                <h3 class="text-white font-bold text-lg flex items-center gap-2">
                    <i class="fa-solid fa-key text-amber-400"></i>
                    Alterar Senha
                </h3>
                <button onclick="fecharModal('modalSenha')" class="text-slate-400 hover:text-red-400 text-xl">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>

            <div class="bg-brand-dark/60 p-4 rounded-lg mb-4 space-y-2 text-xs">
                <p class="text-slate-300"><strong class="text-slate-400">Técnico:</strong> ${tecnico.nome}</p>
                <p class="text-slate-300"><strong class="text-slate-400">Usuário:</strong> @${tecnico.usuario}</p>
                ${tecnico.email ? `<p class="text-slate-300"><i class="fa-solid fa-envelope text-brand-cyan mr-1"></i>${tecnico.email}</p>` : ''}
                ${tecnico.telefone ? `<p class="text-slate-300"><i class="fa-brands fa-whatsapp text-emerald-400 mr-1"></i>${tecnico.telefone}</p>` : ''}
            </div>

            <form id="formAdminSenha" class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Nova Senha *</label>
                    <input type="password" id="adminNovaSenha" required placeholder="Mínimo 4 caracteres" class="w-full bg-brand-dark border border-slate-700 focus:border-brand-cyan rounded-lg py-2.5 px-3 text-sm text-white outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Confirmar Nova Senha *</label>
                    <input type="password" id="adminConfirmaSenha" required placeholder="Repita a senha" class="w-full bg-brand-dark border border-slate-700 focus:border-brand-cyan rounded-lg py-2.5 px-3 text-sm text-white outline-none">
                </div>

                <p id="adminSenhaFeedback" class="hidden text-xs text-center rounded-lg py-2 px-3"></p>

                <div class="flex gap-3 pt-3">
                    <button type="button" onclick="fecharModal('modalSenha')" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition">Cancelar</button>
                    <button type="submit" class="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
                        <i class="fa-solid fa-shield-halved"></i> Alterar Senha
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('formAdminSenha').addEventListener('submit', (e) => {
        e.preventDefault();
        const novaSenha = document.getElementById('adminNovaSenha').value;
        const confirmar = document.getElementById('adminConfirmaSenha').value;
        const feedback = document.getElementById('adminSenhaFeedback');

        const exibirFeedback = (msg, tipo) => {
            feedback.textContent = msg;
            feedback.className = 'text-xs text-center rounded-lg py-2 px-3';
            if (tipo === 'sucesso') {
                feedback.classList.add('bg-emerald-500/20', 'text-emerald-400', 'border', 'border-emerald-500/40');
            } else {
                feedback.classList.add('bg-red-500/20', 'text-red-400', 'border', 'border-red-500/40');
            }
            feedback.classList.remove('hidden');
        };

        if (novaSenha.length < 4) {
            exibirFeedback('❌ A senha deve ter pelo menos 4 caracteres.', 'erro');
            return;
        }
        if (novaSenha !== confirmar) {
            exibirFeedback('❌ As senhas não coincidem.', 'erro');
            return;
        }

        const tecnicos = carregarTecnicos();
        const index = tecnicos.findIndex(t => t.id === id);
        if (index === -1) {
            exibirFeedback('❌ Técnico não encontrado.', 'erro');
            return;
        }

        tecnicos[index].senha = novaSenha;
        salvarTecnicos(tecnicos);

        exibirFeedback('✅ Senha alterada com sucesso!', 'sucesso');
        setTimeout(() => {
            fecharModal('modalSenha');
            renderizarTecnicos(obterSessaoAtual());
        }, 1200);
    });
};

/* ==========================================
   EXCLUIR TÉCNICO
   ========================================== */
window.excluirTecnico = function (id) {
    const sessao = obterSessaoAtual();
    if (!sessao || !sessao.isMaster) {
        alert('❌ Apenas administradores podem excluir técnicos.');
        return;
    }
    if (!confirm('Tem certeza que deseja excluir este técnico? Essa ação não pode ser desfeita.')) return;
    const tecnicos = carregarTecnicos().filter(t => t.id !== id);
    salvarTecnicos(tecnicos);
    renderizarTecnicos(obterSessaoAtual());
};