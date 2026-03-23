(function () {
  const LOGIN_PAGE = "index.html";
  const SESSION_KEY = "_gl_session";
  const MAX_INACTIVITY_MINUTES = 60;

  const rawSession = localStorage.getItem(SESSION_KEY);

  const triggerExit = (reason) => {
    console.warn(`Acesso bloqueado: ${reason}`);
    localStorage.removeItem(SESSION_KEY);

    window.location.replace(`${LOGIN_PAGE}?auth_error=${reason}`);
  };

  if (!rawSession) {
    triggerExit("no_session");
    return;
  }

  try {
    const decodedData = JSON.parse(atob(rawSession));

    const now = Date.now();
    const sessionAgeMs = now - decodedData.ts;
    const minutesActive = sessionAgeMs / 1000 / 60;

    if (minutesActive > MAX_INACTIVITY_MINUTES) {
      triggerExit("session_expired");
      return;
    }

    if (!decodedData.u || !decodedData.u.includes("@")) {
      triggerExit("corrupted_data");
      return;
    }

    decodedData.ts = Date.now();
    localStorage.setItem(SESSION_KEY, btoa(JSON.stringify(decodedData)));

    console.log("GasoLink: Sessão validada com sucesso.");
  } catch (error) {
    triggerExit("integrity_fail");
  }
})();

//coloquei essas camadas de segurança pra evitar que certas pessoas tente entrar sem autorização de login kkkkkk chupa
