const API_URL = "/api/auth";

async function handleAuth(isLogin) {
  const url = isLogin ? `${API_URL}/login` : `${API_URL}/register`;

  const data = {
    nom: document.getElementById("nom")?.value,
    email: document.getElementById("email").value,
    mot_de_passe: document.getElementById("mot_de_passe").value,
    role: document.getElementById("role")?.value,
    statut: document.getElementById("statut")?.value,
    bureau: document.getElementById("bureau")?.value,
    heures_supplementaires: document.getElementById("heures_supplementaires")?.value,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  alert(result.message || JSON.stringify(result));
}
