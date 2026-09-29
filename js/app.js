const API_URL = "SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI";

// 1. CADASTRAR ORÇAMENTO (CLIENTE)
document.getElementById('form-orcamento').addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    action: "cadastrar",
    nome: document.getElementById('nome').value,
    telefone: document.getElementById('telefone').value,
    aparelho: document.getElementById('aparelho').value,
    defeito: document.getElementById('defeito').value
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const result = await res.json();

    if (result.status === "sucesso") {
      alert(`Orçamento enviado com sucesso! Anote o número da sua OS: ${result.os}`);
      document.getElementById('form-orcamento').reset();
    }
  } catch (err) {
    alert("Erro ao enviar o orçamento. Tente novamente.");
  }
});

// 2. CONSULTAR OS (CLIENTE)
document.getElementById('btn-consultar').addEventListener('click', async () => {
  const os = document.getElementById('busca-os').value.trim();
  const divResultado = document.getElementById('resultado-consulta');

  if (!os) return alert("Digite o número da OS.");

  try {
    const res = await fetch(`\({API_URL}?os=\){encodeURIComponent(os)}`);
    const data = await res.json();

    if (data.encontrado) {
      divResultado.classList.remove('hidden');
      divResultado.innerHTML = `
