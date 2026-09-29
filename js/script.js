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

function enviarOrcamento(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const tipo = document.getElementById('tipoEquipamento').value;
    const marca = document.getElementById('marca').value.trim() || 'Não informada';
    const modelo = document.getElementById('modelo').value.trim() || 'Não informado';
    const defeito = document.getElementById('defeito').value.trim();

    let mensagem = `*SOLICITAÇÃO DE ORÇAMENTO - JIMO ELETRÔNICA*\n\n`;
    mensagem += `👤 *Cliente:* ${nome}\n`;
    mensagem += `📱 *Telefone:* ${whatsapp}\n`;
    mensagem += `🛠️ *Equipamento:* ${tipo}\n`;
    mensagem += `🏷️ *Marca:* ${marca}\n`;
    mensagem += `📺 *Modelo/Pol:* ${modelo}\n\n`;
    mensagem += `❌ *Defeito Informado:* ${defeito}\n\n`;
    mensagem += `_Mensagem enviada via site JIMO Eletrônica._`;

    const feedback = document.getElementById('orcamentoFeedback');
    feedback.classList.remove('hidden');

    const numeroEmpresa = '5591982871598';
    const urlWhatsApp = `https://wa.me/\({numeroEmpresa}?text=\){encodeURIComponent(mensagem)}`;

    setTimeout(() => {
        window.open(urlWhatsApp, '_blank');
    }, 800);
}

function buscarOS() {
    const osInput = document.getElementById('inputNumeroOS').value.trim();
    const container = document.getElementById('resultadoOSContainer');
    const content = document.getElementById('resultadoOSContent');

    if (!osInput) {
        container.classList.remove('hidden');
        content.innerHTML = `
