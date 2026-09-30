/* ==========================================
   FORMULÁRIO DE ORÇAMENTO DO CLIENTE
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formOrcamento');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const tipo = document.getElementById('tipoEquipamento').value;
        const marca = document.getElementById('marca').value.trim() || 'Não informada';
        const modelo = document.getElementById('modelo').value.trim() || 'Não informado';
        const defeito = document.getElementById('defeito').value.trim();

        const novaOS = {
            id: gerarIdOS(),
            nome: nome,
            whatsapp: whatsapp,
            equipamento: tipo,
            marca: marca,
            modelo: modelo,
            defeito: defeito,
            status: 'Pendente',
            orcamentoTecnico: null,
            tecnicoResponsavel: null,
            data: new Date().toLocaleDateString('pt-BR'),
            dataISO: new Date().toISOString()
        };

        const orcamentos = carregarOrcamentos();
        orcamentos.push(novaOS);
        salvarOrcamentos(orcamentos);

        let mensagem = `*SOLICITAÇÃO DE ORÇAMENTO - JIMO ELETRÔNICA*\n\n`;
        mensagem += `🆔 *OS:* ${novaOS.id}\n`;
        mensagem += `👤 *Cliente:* ${nome}\n`;
        mensagem += `📱 *Telefone:* ${whatsapp}\n`;
        mensagem += `🛠️ *Equipamento:* ${tipo}\n`;
        mensagem += `🏷️ *Marca:* ${marca}\n`;
        mensagem += `📺 *Modelo:* ${modelo}\n\n`;
        mensagem += `❌ *Defeito:* ${defeito}\n\n`;
        mensagem += `_Mensagem enviada via site JIMO Eletrônica._`;

        const feedback = document.getElementById('orcamentoFeedback');
        if (feedback) feedback.classList.remove('hidden');

        const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

        setTimeout(() => {
            window.open(urlWhatsApp, '_blank');
            setTimeout(() => feedback && feedback.classList.add('hidden'), 3000);
        }, 800);

        this.reset();
    });
});