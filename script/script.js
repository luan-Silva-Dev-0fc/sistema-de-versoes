const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const btnText = document.getElementById("btnText");
const loader = document.getElementById("loader");

(function () {
  async function performLogin(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      showToast("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const API_URL = "https://api-xmoqlb6ppq-uc.a.run.app/restrito/login";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "GasoLink-Client",
        },
        body: JSON.stringify({ email: cleanEmail, senha: password }),
      });

      // Ajuste: Verifica se o retorno é JSON antes de tentar ler
      const contentType = response.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.ok && data) {
        sessionStorage.clear();
        localStorage.clear();

        const sessionData = btoa(
          JSON.stringify({
            t: data.token || data.usuario?.token || "auth",
            u: cleanEmail,
            ts: Date.now(),
          }),
        );

        localStorage.setItem("_gl_session", sessionData);
        window.location.replace("sistema.html");
      } else {
        showToast(data.message || "E-mail ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      showToast("Servidor GasoLink offline ou falha na rede.");
    } finally {
      setLoading(false);
    }
  }

  function setLoading(isLoading) {
    loginBtn.disabled = isLoading;
    if (isLoading) {
      if (btnText) btnText.classList.add("hidden");
      if (loader) {
        loader.classList.remove("hidden");
        loader.style.display = "block"; // Garante visibilidade
      }
      loginBtn.style.opacity = "0.7";
    } else {
      if (btnText) btnText.classList.remove("hidden");
      if (loader) {
        loader.classList.add("hidden");
        loader.style.display = "none";
      }
      loginBtn.style.opacity = "1";
    }
  }

  function showToast(msg) {
    alert(msg);
  }

  // Escuta o submit do form (cobre clique e Enter)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    performLogin(emailInput.value, passwordInput.value);
  });

  // Melhora a experiência: se o usuário der Enter na senha, submete o form
  passwordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performLogin(emailInput.value, passwordInput.value);
    }
  });
})();
