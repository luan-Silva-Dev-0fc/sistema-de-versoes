const API_URL = "https://api-xmoqlb6ppq-uc.a.run.app/versoes";

// Carregar versões ao abrir a página
document.addEventListener("DOMContentLoaded", buscarVersoes);

async function buscarVersoes() {
  const lista = document.getElementById("lista-versoes");
  try {
    const response = await fetch(API_URL);
    const versoes = await response.json();

    lista.innerHTML = versoes
      .map(
        (v) => `
            <div class="card-versao">
                <div class="card-info">
                    <h3>v${v.nomeVersao}</h3>
                    <p>${v.link}</p>
                </div>
                <div class="actions">
                    <button class="btn-edit" onclick="prepararEdicao('${v.id}', '${v.nomeVersao}', '${v.link}')">EDITAR</button>
                    <button class="btn-delete" onclick="deletarVersao('${v.id}')">EXCLUIR</button>
                </div>
            </div>
        `,
      )
      .join("");
  } catch (error) {
    lista.innerHTML = "<p>Erro ao carregar dados da API.</p>";
  }
}

async function salvarVersao() {
  const id = document.getElementById("version-id").value;
  const nomeVersao = document.getElementById("nomeVersao").value;
  const link = document.getElementById("link").value;

  const dados = { nomeVersao, link };
  const metodo = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const response = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (response.ok) {
      alert(id ? "Atualizado com sucesso!" : "Publicado com sucesso!");
      limparFormulario();
      buscarVersoes();
    }
  } catch (error) {
    alert("Erro ao salvar versão.");
  }
}

async function deletarVersao(id) {
  if (!confirm("Tem certeza que deseja deletar este link?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    buscarVersoes();
  } catch (error) {
    alert("Erro ao deletar.");
  }
}

function prepararEdicao(id, nome, link) {
  document.getElementById("version-id").value = id;
  document.getElementById("nomeVersao").value = nome;
  document.getElementById("link").value = link;
  document.getElementById("form-title").innerText = "Editar Versão";
  document.getElementById("btn-save").innerText = "SALVAR ALTERAÇÕES";
  document.getElementById("btn-cancel").style.display = "inline-block";
}

function limparFormulario() {
  document.getElementById("version-id").value = "";
  document.getElementById("nomeVersao").value = "";
  document.getElementById("link").value = "";
  document.getElementById("form-title").innerText = "Publicar Nova Versão";
  document.getElementById("btn-save").innerText = "PUBLICAR AGORA";
  document.getElementById("btn-cancel").style.display = "none";
}
