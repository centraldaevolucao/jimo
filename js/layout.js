/* ==========================================
   LAYOUT GLOBAL - HEADER E FOOTER
   ========================================== */

const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';

function isActive(pagina) {
    return paginaAtual === pagina ? 'text-brand-cyan font-semibold' : 'text-slate-300 hover:text-brand-cyan transition';
}
function isActiveMobile(pagina) {
    return paginaAtual === pagina ? 'text-brand-cyan font-semibold' : 'text-slate-200 hover:bg-brand-slate font-medium transition';
}

const headerHTML = `
<header class="fixed top-0 left-0 w-full z-50 bg-brand-dark/95 backdrop-blur-md border-b border-brand-cyan/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
            <a href="index.html" id="logoJimo" class="flex items-center gap-3 group select-none">
                <div class="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan p-0.5 shadow-lg shadow-brand-cyan/20">
                    <div class="w-full h-full bg-brand-navy rounded-[10px] flex items-center justify-center text-brand-cyan font-bold text-2xl">
                        <i class="fa-solid fa-microchip text-xl"></i>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="flex items-center gap-1.5">
                        <span class="font-extrabold text-2xl tracking-wider text-white">JIMO</span>
                        <span class="text-xs bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded font-semibold border border-brand-cyan/30 uppercase tracking-widest">Eletrônica</span>
                    </div>
                    <span class="text-[10px] text-brand-cyan/80 font-medium">SMART TV E ELETRÔNICOS EM GERAL</span>
                </div>
            </a>

            <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
                <a href="index.html" class="${isActive('index.html')} py-2">Início</a>
                <a href="servicos.html" class="${isActive('servicos.html')} py-2">Serviços</a>
                <a href="sobre.html" class="${isActive('sobre.html')} py-2">Sobre</a>
                <a href="orcamento.html" class="${isActive('orcamento.html')} py-2">Orçamento</a>
                <a href="consultar-os.html" class="${isActive('consultar-os.html')} py-2">Consultar OS</a>
                <a href="contato.html" class="${isActive('contato.html')} py-2">Contato</a>
            </nav>

            <a href="orcamento.html" class="hidden lg:flex bg-gradient-to-r from-brand-cyan to-brand-blue text-brand-dark font-bold px-5 py-2.5 rounded-lg shadow-lg shadow-brand-cyan/20 transition items-center gap-2 text-sm">
                <i class="fa-solid fa-paper-plane"></i> Pedir Orçamento
            </a>

            <button id="mobile-menu-btn" aria-label="Abrir Menu" class="md:hidden text-slate-300 hover:text-white p-2 rounded-lg bg-brand-navy border border-brand-cyan/30">
                <i class="fa-solid fa-bars text-xl" id="menu-icon"></i>
            </button>
        </div>
    </div>

    <div id="mobile-menu" class="hidden md:hidden bg-brand-navy border-b border-brand-cyan/20 px-4 pt-2 pb-6 space-y-3 shadow-xl">
        <a href="index.html" class="block py-2 px-3 rounded-lg ${isActiveMobile('index.html')}">Início</a>
        <a href="servicos.html" class="block py-2 px-3 rounded-lg ${isActiveMobile('servicos.html')}">Serviços</a>
        <a href="sobre.html" class="block py-2 px-3 rounded-lg ${isActiveMobile('sobre.html')}">Sobre Nós</a>
        <a href="orcamento.html" class="block py-2 px-3 rounded-lg ${isActiveMobile('orcamento.html')}">Solicitar Orçamento</a>
        <a href="consultar-os.html" class="block py-2 px-3 rounded-lg ${isActiveMobile('consultar-os.html')}">Consultar OS</a>
        <a href="contato.html" class="block py-2 px-3 rounded-lg ${isActiveMobile('contato.html')}">Contato</a>
        <div class="pt-2 border-t border-slate-700/50">
            <a href="https://wa.me/5591982871598" target="_blank" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg transition">
                <i class="fa-brands fa-whatsapp text-lg"></i> WhatsApp
            </a>
        </div>
    </div>
</header>
`;

const footerHTML = `
<footer class="bg-brand-dark text-slate-400 border-t border-slate-800 pt-16 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div class="md:col-span-2 space-y-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center text-brand-dark font-extrabold text-xl">J</div>
                    <span class="font-bold text-xl text-white tracking-wider">JIMO ELETRÔNICA</span>
                </div>
                <p class="text-sm max-w-md">Assistência em Smart TV e Eletrônicos em Geral. Serviços especializados com transparência, rápida entrega e compromisso com o cliente em Ananindeua e Região Metropolitana.</p>
            </div>
            <div>
                <h4 class="text-white font-bold text-sm uppercase mb-4 border-b border-brand-cyan/30 pb-2 inline-block">Navegação</h4>
                <ul class="space-y-2.5 text-sm">
                    <li><a href="index.html" class="hover:text-brand-cyan transition">Início</a></li>
                    <li><a href="servicos.html" class="hover:text-brand-cyan transition">Serviços</a></li>
                    <li><a href="sobre.html" class="hover:text-brand-cyan transition">Sobre</a></li>
                    <li><a href="orcamento.html" class="hover:text-brand-cyan transition">Orçamento</a></li>
                    <li><a href="consultar-os.html" class="hover:text-brand-cyan transition">Consultar OS</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-bold text-sm uppercase mb-4 border-b border-brand-cyan/30 pb-2 inline-block">Contato</h4>
                <ul class="space-y-2.5 text-sm">
                    <li class="flex items-center gap-2"><i class="fa-brands fa-whatsapp text-emerald-400"></i> (91) 98287-1598</li>
                    <li class="flex items-center gap-2"><i class="fa-solid fa-envelope text-brand-cyan"></i> j.ivomota2@gmail.com</li>
                    <li class="flex items-center gap-2"><i class="fa-solid fa-location-dot text-red-400"></i> Ananindeua – PA</li>
                </ul>
            </div>
        </div>
        <div class="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
            <p>© 2026 JIMO Eletrônica — Todos os direitos reservados.</p>
            <div class="flex items-center gap-4">
                <p>Ananindeua - PA - Brasil</p>
                <a href="admin.html" class="opacity-30 hover:opacity-100 transition text-slate-500 hover:text-brand-cyan text-[10px] flex items-center gap-1.5" title="Acesso Restrito">
                    <i class="fa-solid fa-lock text-[10px]"></i>
                    <span class="underline">Acesso Restrito</span>
                </a>
            </div>
        </div>
    </div>
</footer>

<a href="https://wa.me/5591982871598?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20JIMO%20Eletr%C3%B4nica." 
   target="_blank" title="Falar no WhatsApp" 
   class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center text-3xl shadow-2xl whatsapp-pulse transition transform hover:scale-110">
    <i class="fa-brands fa-whatsapp"></i>
</a>
`;

document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileMenuBtn && mobileMenu && menuIcon) {
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
    }
});