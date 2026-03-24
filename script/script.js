const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const btnText = document.getElementById("btnText");
const loader = document.getElementById("loader");

async function performLogin(email, password) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password; 

  if (!cleanEmail || !cleanPassword) {
    alert("Preencha e-mail e senha para acessar.");
    return;
  }

  setLoading(true);

  try {
    const API_LOGIN_URL = "https://api-xmoqlb6ppq-uc.a.run.app/restrito/login";

    const response = await fetch(API_LOGIN_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 
        email: cleanEmail, 
        senha: cleanPassword 
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.clear(); 
      localStorage.setItem("userToken", JSON.stringify(data.usuario || data));
      window.location.replace("sistema.html"); 
    } else {
      console.warn("Acesso negado:", data.message);
      alert(data.message || "Acesso restrito: E-mail ou senha incorretos.");
    }
  } catch (error) {
    console.error("Erro crítico na conexão:", error);
    alert("Erro de conexão. Verifique se a API do Gasolink está online.");
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  if (isLoading) {
    if(btnText) btnText.style.display = "none";
    if(loader) {
        loader.classList.remove("hidden");
        loader.style.display = "block";
    }
    loginBtn.disabled = true;
    loginBtn.style.opacity = "0.6";
    loginBtn.style.cursor = "not-allowed";
  } else {
    if(btnText) btnText.style.display = "block";
    if(loader) {
        loader.classList.add("hidden");
        loader.style.display = "none";
    }
    loginBtn.disabled = false;
    loginBtn.style.opacity = "1";
    loginBtn.style.cursor = "pointer";
  }
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  performLogin(emailInput.value, passwordInput.value);
});

passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    performLogin(emailInput.value, passwordInput.value);
  }
});