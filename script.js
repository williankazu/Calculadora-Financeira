// Função para formatar números como moeda brasileira
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para carregar o histórico do LocalStorage
function carregarHistorico() {
  const historico = JSON.parse(localStorage.getItem('calculations')) || [];
  const listaHistorico = document.getElementById('historyList');
  listaHistorico.innerHTML = '';

  historico.forEach((item, index) => {
      const li = document.createElement('li');

      // Adiciona o texto do cálculo
      const texto = document.createElement('span');
      texto.textContent = `Principal: ${formatarMoeda(item.principal)}, Taxa: ${item.rate.toFixed(2)}% ao ano, Tempo: ${item.time} anos, Montante: ${formatarMoeda(item.amount)}`;

      // Adiciona o botão de remoção
      const botaoRemover = document.createElement('button');
      botaoRemover.textContent = 'Remover';
      botaoRemover.addEventListener('click', () => removerItemDoHistorico(index));

      li.appendChild(texto);
      li.appendChild(botaoRemover);
      listaHistorico.appendChild(li);
  });
}

// Função para salvar cálculo no histórico
function salvarNoHistorico(principal, rate, time, amount) {
  const historico = JSON.parse(localStorage.getItem('calculations')) || [];
  historico.push({ principal, rate, time, amount });
  localStorage.setItem('calculations', JSON.stringify(historico));
  carregarHistorico();
}

// Função para remover item do histórico
function removerItemDoHistorico(index) {
  const historico = JSON.parse(localStorage.getItem('calculations')) || [];
  historico.splice(index, 1); // Remove o item pelo índice
  localStorage.setItem('calculations', JSON.stringify(historico));
  carregarHistorico(); // Recarrega o histórico atualizado
}

// Função para validar e converter entrada de texto para número
function converterParaNumero(valor) {
  // Remove pontos e substitui vírgula por ponto
  const numero = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
  return isNaN(numero) ? null : numero;
}

// Evento para calcular o montante
document.getElementById('calculateBtn').addEventListener('click', () => {
  const principalInput = document.getElementById('principal').value;
  const rateInput = document.getElementById('rate').value;
  const timeInput = document.getElementById('time').value;

  const principal = converterParaNumero(principalInput);
  const rate = converterParaNumero(rateInput);
  const time = parseInt(timeInput, 10);

  // Validações adicionais
  if (principal === null || principal <= 0) {
      alert("Por favor, insira um valor válido para o Principal.");
      return;
  }
  if (rate === null || rate <= 0) {
      alert("Por favor, insira uma Taxa de Juros válida.");
      return;
  }
  if (isNaN(time) || time <= 0) {
      alert("Por favor, insira um valor válido para o Tempo.");
      return;
  }

  // Cálculo do Montante com Juros Compostos: A = P * (1 + r/n)^(nt)
  const montante = principal * Math.pow((1 + rate / 100), time);
  const juros = montante - principal;

  // Exibindo o resultado
  const resultadoDiv = document.getElementById('result');
  resultadoDiv.innerHTML = `
      <p><strong>Montante Total:</strong> ${formatarMoeda(montante)}</p>
      <p><strong>Juros Gerados:</strong> ${formatarMoeda(juros)}</p>
  `;

  // Salvando no histórico
  salvarNoHistorico(principal, rate, time, montante);
});

// Carregar histórico ao iniciar
carregarHistorico();
