const API_URL = "SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI";

// Envio de Orçamento
document.getElementById('form-orcamento')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const payload = {
    nome: document.getElementById('nome').value,
    telefone: document.getElementById('telefone').value,
    aparelho: document.getElementById('aparelho').value,
    defeito: document.getElementById('defeito').value
  };

  try {
    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert('Orçamento enviado com sucesso! Entraremos em contato.');
  } catch (err) {
    alert('Erro ao enviar o orçamento.');
  }
});

// Consulta de Ordem de Serviço
async function consultarOS(numeroOS) {
  try {
    const response = await fetch(`\({API_URL}?os=\){encodeURIComponent(numeroOS)}`);
    const result = await response.json();
    
    if (result.encontrado) {
      alert(`Status da OS #\({result.os}:\nCliente:\){result.cliente}\nAparelho: \({result.aparelho}\nStatus:\){result.status}\nValor: R$ ${result.valor}`);
    } else {
      alert('Ordem de serviço não encontrada.');
    }
  } catch (err) {
    alert('Erro ao consultar a Ordem de Serviço.');
  }
}
