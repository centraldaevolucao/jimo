/* ==========================================
   CONSULTA DE OS PELO CLIENTE
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
                <span class="font-bold text-sm">Digite o número da Ordem de Serviço.</span>
            </div>`;
        return;
    }

    const orcamentos = carregarOrcamentos();
    const os = orcamentos.find(o => o.id.toLowerCase() === osInput.toLowerCase());

    container.classList.remove('hidden');

    if (os) {
        const statusColors = {
            'Pendente': 'bg-amber-500/20 text-amber-400 border-amber-500/40',
            'Em Andamento': 'bg-blue-500/20 text-blue-400 border-blue-500/40',
            'Aguardando Aprovação': 'bg-purple-500/20 text-purple-400 border-purple-500/40',
            'Aprovado': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
            'Concluído': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
            'Recusado': 'bg-red-500/20 text-red-400 border-red-500/40'
        };
        const statusColor = statusColors[os.status] || 'bg-slate-500/20 text-slate-400';

        let orcamentoHTML = '';
        if (os.orcamentoTecnico) {
            orcamentoHTML = `
                <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mt-3">
                    <h4 class="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
                        <i class="fa-solid fa-file-invoice-dollar"></i> Orçamento Técnico
                    </h4>
                    <div class="grid grid-cols-2 gap-2 text-xs text-slate-300">
                        <div><strong class="text-slate-400">Valor:</strong> R$ ${parseFloat(os.orcamentoTecnico.valor).toFixed(2).replace('.', ',')}</div>
                        <div><strong class="text-slate-400">Prazo:</strong> ${os.orcamentoTecnico.prazo}</div>
                        <div class="col-span-2"><strong class="text-slate-400">Descrição:</strong> ${os.orcamentoTecnico.descricao}</div>
                        ${os.orcamentoTecnico.observacoes ? `<div class="col-span-2"><strong class="text-slate-400">Observações:</strong> ${os.orcamentoTecnico.observacoes}</div>` : ''}
                        <div class="col-span-2 text-[11px] text-slate-500 mt-1">Emitido por: ${os.orcamentoTecnico.tecnico} em ${os.orcamentoTecnico.data}</div>
                    </div>
                </div>`;
        }

        content.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700 pb-3 gap-2">
                <div>
                    <span class="text-xs text-brand-cyan font-mono font-bold uppercase">Ordem de Serviço</span>
                    <h4 class="text-white font-extrabold text-lg">OS ${os.id}</h4>
                </div>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${statusColor} text-xs font-semibold">
                    <i class="fa-solid fa-circle-info"></i> ${os.status}
                </span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 pt-1">
                <div><strong class="text-slate-400 block">Cliente:</strong><span>${os.nome}</span></div>
                <div><strong class="text-slate-400 block">Equipamento:</strong><span>${os.equipamento} ${os.marca !== 'Não informada' ? '- ' + os.marca : ''}</span></div>
                <div><strong class="text-slate-400 block">Data de Entrada:</strong><span>${os.data}</span></div>
                <div><strong class="text-slate-400 block">Técnico Responsável:</strong><span>${os.tecnicoResponsavel || 'Aguardando atribuição'}</span></div>
                <div class="sm:col-span-2"><strong class="text-slate-400 block">Defeito Relatado:</strong><span>${os.defeito}</span></div>
            </div>
            ${orcamentoHTML}
            <div class="bg-brand-navy p-3 rounded-xl border border-brand-cyan/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mt-2">
                <span class="text-slate-300">Dúvidas sobre esta OS? Fale com o técnico.</span>
                <a href="https://wa.me/5591982871598?text=Ol%C3%A1,%20sobre%20a%20OS%20${os.id}" target="_blank" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition">
                    <i class="fa-brands fa-whatsapp"></i> Consultar Via WhatsApp
                </a>
            </div>`;
    } else {
        content.innerHTML = `
            <div class="flex items-center gap-3 text-amber-400">
                <i class="fa-solid fa-circle-exclamation text-xl"></i>
                <div>
                    <span class="font-bold text-sm block">OS não encontrada.</span>
                    <span class="text-xs text-slate-400">Verifique o número digitado.</span>
                </div>
            </div>`;
    }
}