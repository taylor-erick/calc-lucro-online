
function adicionarItem() {
  const tbody = document.querySelector("#itens tbody");

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text"></td>

    <td>
      <div class="prefix">
        <span>R$</span>
        <input type="number" step="0.01" class="valor">
      </div>
    </td>

    <td>
      <div class="field-unidade">
        <input type="number" class="qtdCompra">
        <select class="unCompra" onchange="ajustarUnidades(this)">
          <option value="kg">Kg</option>
          <option value="g">g</option>
          <option value="l">L</option>
          <option value="ml">mL</option>
        </select>
      </div>
    </td>

    <td>
      <div class="field-unidade">
        <input type="number" class="qtdUso">
        <select class="unUso"></select>
      </div>
    </td>

    <td>
      <button class="btn-remove" onclick="this.closest('tr').remove()">×</button>
    </td>
  `;

  tbody.appendChild(tr);

  // inicializa corretamente
  ajustarUnidades(tr.querySelector(".unCompra"));
}

function ajustarUnidades(selectCompra) {
  const tr = selectCompra.closest("tr");
  const selectUso = tr.querySelector(".unUso");

  const peso = `
    <option value="kg">Kg</option>
    <option value="g">g</option>
  `;

  const volume = `
    <option value="l">L</option>
    <option value="ml">mL</option>
  `;

  if (selectCompra.value === "kg" || selectCompra.value === "g") {
    selectUso.innerHTML = peso;
  } else {
    selectUso.innerHTML = volume;
  }
}

function base(valor, unidade) {
  if (unidade === "kg" || unidade === "l") return valor * 1000;
  return valor;
}

function calcular() {
  let custoMateriais = 0;

  document.querySelectorAll("#itens tbody tr").forEach(tr => {
    const valor = parseFloat(tr.querySelector(".valor").value) || 0;
    const qtdCompra = parseFloat(tr.querySelector(".qtdCompra").value) || 0;
    const qtdUso = parseFloat(tr.querySelector(".qtdUso").value) || 0;
    const unCompra = tr.querySelector(".unCompra").value;
    const unUso = tr.querySelector(".unUso").value;

    const compraBase = base(qtdCompra, unCompra);
    const usoBase = base(qtdUso, unUso);

    if (compraBase > 0) {
      custoMateriais += (valor / compraBase) * usoBase;
    }
  });

  let tempo = parseFloat(document.getElementById("tempo").value) || 0;
  if (document.getElementById("unidadeTempo").value === "minutos") tempo /= 60;

  const custoMaoObra =
    (parseFloat(document.getElementById("valorHora").value) || 0) * tempo;

  const custoTotal = custoMateriais + custoMaoObra;

  const margem = (parseFloat(document.getElementById("margem").value) || 0) / 100;
  const lote = parseFloat(document.getElementById("lote").value) || 1;

  const precoLote = custoTotal / (1 - margem);
  const precoUnit = precoLote / lote;

  document.getElementById("resultado").innerHTML = `
    <strong>Custo total do lote:</strong> R$ ${custoTotal.toFixed(2)}<br>
    <strong>Preço de venda do lote:</strong> R$ ${precoLote.toFixed(2)}<br>
    <strong>Preço por unidade:</strong> R$ ${precoUnit.toFixed(2)}
  `;
}

// adiciona primeira linha
adicionarItem();