const STORAGE_KEY = "jimo_eletronica_os_data";

// Inicializa a base de dados buscando do caminho backend/dados.json
async function carregarBaseInicial() {
  const dadosLocais = localStorage.getItem(STORAGE_KEY);
  if (!dadosLocais) {
    try {
      const res = await fetch('backend/dados.json');
      const json = await res.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(json.ordensServico));
    } catch (err) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }
}

function obterOrdens() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function salvarOrdens(ordens) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ordens));
}

// 1. CADASTRAR ORÇAMENTO (CLIENTE / RECEPÇÃO)
document.getElementById('form-orcamento').addEventListener('submit', (e) => {
  e.preventDefault();

  const ordens = obterOrdens();
  const novoId = "OS-" + (1001 + ordens.length);
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  const novaOS = {
    os: novoId,
    data: dataHoje,
    cliente: document.getElementById('nome').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    aparelho: document.getElementById('aparelho').value.trim(),
    defeito: document.getElementById('defeito').value.trim(),
    status: "Em Análise",
    valor: "0,00"
  };

  ordens.push(novaOS);
  salvarOrdens(ordens);

  alert(`Orçamento cadastrado com sucesso!\n\nNúmero da OS: ${novoId}`);
  document.getElementById('form-orcamento').reset();
});

// 2. CONSULTAR OS (CLIENTE)
document.getElementById('btn-consultar').addEventListener('click', () => {
  const osBusca = document.getElementById('busca-os').value.trim().toUpperCase();
  const divResultado = document.getElementById('resultado-consulta');

  if (!osBusca) return alert("Digite o número da OS para consultar.");

  const ordens = obterOrdens();
  const encontrada = ordens.find(item => item.os.toUpperCase() === osBusca);

  divResultado.classList.remove('hidden');

  if (encontrada) {
    divResultado.innerHTML = `
