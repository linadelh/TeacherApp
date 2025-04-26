const API_URL = "/api/auth";

async function handleAuth(isLogin) {
  const url = isLogin ? `${API_URL}/login` : `${API_URL}/register`;

  let payload;
  if (isLogin) {
    // Lors du login, on n’a besoin que de l’email et du mot de passe
    payload = {
      email: document.getElementById("login-email").value,
      password: document.getElementById("login-password").value
    };
  } else {
    // Lors de l’inscription, on envoie tous les champs
    payload = {
      prenom: document.getElementById("signup-prenom").value,
      nom: document.getElementById("signup-nom").value,
      email: document.getElementById("signup-email").value,
      password: document.getElementById("signup-password").value,
      grade: document.getElementById("signup-grade").value,
      faculte: document.getElementById("signup-faculte").value,
      departement: document.getElementById("signup-departement").value,
      role: "enseignant"
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (isLogin) {
      // Si la connexion a réussi et qu'on reçoit un token :
      if (res.ok && result.token) {
        localStorage.setItem("token", result.token);     // 📥 Stocke le token
        window.location.href = "/voeu.html";             // ➡️ Redirige vers la fiche
      } else {
        alert(result.message || "Identifiants incorrects");
      }
    } else {
      // Pour l'inscription, on affiche juste un message
      if (res.ok) alert("Inscription réussie ! Connecte-toi maintenant.");
      else alert(result.message || "Échec de l’inscription");
    }

  } catch (err) {
    console.error("Erreur réseau :", err);
    alert("Problème de connexion au serveur");
  }
}
