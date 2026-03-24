const API_URL = "https://api-xmoqlb6ppq-uc.a.run.app/versoes";

// Iniciar sistema
document.addEventListener("DOMContentLoaded", () => {
    verificarAcesso();
    buscarVersoes();
});

// Pede email/senha apenas se não estiverem salvos no navegador
function verificarAcesso() {
    if (!localStorage.getItem("gas_email") || !localStorage.getItem("gas_pass")) {
        const email = prompt("E-mail de Administrador:");
        const senha = prompt("Senha de Acesso:");
        if (email && senha) {
            localStorage.setItem("gas_email", email);
            localStorage.setItem("gas_pass", senha);
        } else {
            alert("Acesso negado. Recarregue para tentar novamente.");
            document.body.innerHTML = "<h1>Acesso Negado</h1>";
        }
    }
}

function logout() {
    localStorage.clear();
    location.reload();
}

async function buscarVersoes() {
    const lista = document.getElementById("lista-versoes");
    try {
        const response = await fetch(API_URL);
        const versoes = await response.json();

        // Filtra o documento 'token' se ele vier na lista por engano
        const dadosFiltrados = versoes.filter(v => v.id !== "token");

        lista.innerHTML = dadosFiltrados.map(v => `
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
        `).join("");
    } catch (e) {
        lista.innerHTML = "<p>Erro ao conectar com a API.</p>";
    }
}

async function salvarVersao() {
    const id = document.getElementById("version-id").value;
    const nomeVersao = document.getElementById("nomeVersao").value;
    const link = document.getElementById("link").value;
    
    // Pega credenciais do navegador (não estão expostas no código)
    const email = localStorage.getItem("gas_email");
    const senha = localStorage.getItem("gas_pass");

    if (!nomeVersao || !link) return alert("Preencha os campos!");

    const dados = { email, senha, nomeVersao, link };
    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            alert("Sucesso!");
            limparFormulario();
            buscarVersoes();
        } else {
            const erro = await res.json();
            alert("Erro: " + erro.message);
            if(res.status === 401) logout(); // Senha errada? Desloga.
        }
    } catch (e) { alert("Erro de rede."); }
}

async function deletarVersao(id) {
    if (!confirm("Deletar versão?")) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) buscarVersoes();
    } catch (e) { alert("Erro ao deletar."); }
}

function prepararEdicao(id, nome, link) {
    document.getElementById("version-id").value = id;
    document.getElementById("nomeVersao").value = nome;
    document.getElementById("link").value = link;
    document.getElementById("form-title").innerText = "Editando Versão";
    document.getElementById("btn-save").innerText = "SALVAR ALTERAÇÕES";
    document.getElementById("btn-cancel").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limparFormulario() {
    document.getElementById("version-id").value = "";
    document.getElementById("nomeVersao").value = "";
    document.getElementById("link").value = "";
    document.getElementById("form-title").innerText = "Publicar Nova Versão";
    document.getElementById("btn-save").innerText = "PUBLICAR AGORA";
    document.getElementById("btn-cancel").style.display = "none";
}