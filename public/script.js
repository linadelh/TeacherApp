let allModules = [];
let data = {};
let selectedModules = {}; 
// { choiceId: { moduleId, moduleNom, niveau, specialite, semestre } }

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/modules');
    if (!res.ok) throw new Error("Erreur serveur");
    allModules = await res.json();

    // Construire data[niveau][specialite][semestre] = [ { id, nom } ]
    allModules.forEach(mod => {
      const { id, nom_module, niveau, specialite, semestre } = mod;
      if (!data[niveau]) data[niveau] = {};
      if (!data[niveau][specialite]) data[niveau][specialite] = {};
      if (!data[niveau][specialite][semestre]) data[niveau][specialite][semestre] = [];
      data[niveau][specialite][semestre].push({ id, nom: nom_module });
    });

    initDropdowns();
  } catch (err) {
    console.error("❌ Chargement modules:", err);
    alert("Impossible de charger les modules. Recharge la page.");
  }
});

function initDropdowns() {
  document.querySelectorAll('tr[data-choice]').forEach(row => {
    const choiceId       = row.dataset.choice;
    const niveauSelect   = row.querySelector('.niveau-select');
    const specialiteSel  = row.querySelector('.specialite-select');
    const semestreInput  = row.querySelector('.semestre-select'); // hidden or select
    const moduleSelect   = row.querySelector('.module-select');

    // 1️⃣ Remplir le select niveau
    resetDropdown(niveauSelect, "Niveau");
    Object.keys(data).forEach(niv => 
      niveauSelect.appendChild(createOption(niv, niv))
    );

    // 2️⃣ À chaque changement de filtre (niveau / spé / sem), on recharge le module list
    const onFilterChange = () => {
      resetDropdown(moduleSelect, "Module");
      delete selectedModules[choiceId];

      const niv  = niveauSelect.value;
      const spec = specialiteSel.value;
      const sem  = semestreInput.value || semestreInput.getAttribute('value') || "";

      if (niv && spec && sem) {
        updateModuleDropdown(niv, spec, sem, moduleSelect, choiceId);
      }
    };

    niveauSelect.addEventListener('change', () => {
      // réinitialise spé + module
      resetDropdown(specialiteSel, "Spécialité");
      resetDropdown(moduleSelect,   "Module");
      delete selectedModules[choiceId];

      const niv = niveauSelect.value;
      if (niv && data[niv]) {
        Object.keys(data[niv]).forEach(spec => 
          specialiteSel.appendChild(createOption(spec, spec))
        );
      }
      // pas d'appel global, on attend le spécif / semestre
    });

    specialiteSel.addEventListener('change', onFilterChange);
    semestreInput.addEventListener('change', onFilterChange);

    // 3️⃣ Quand on choisit un module, on stocke la sélection puis on met à jour *les autres* lignes
    moduleSelect.addEventListener('change', () => {
      const selId = moduleSelect.value;
      // Sauvegarde de l'ancienne valeur avant de mettre à jour
      const previousValue = selectedModules[choiceId]?.moduleId;
      
      if (selId) {
        const selNom = moduleSelect.selectedOptions[0]?.textContent || "";
        selectedModules[choiceId] = {
          moduleId: selId,
          moduleNom: selNom,
          niveau: niveauSelect.value,
          specialite: specialiteSel.value,
          semestre: semestreInput.value || semestreInput.getAttribute('value') || ""
        };
      } else {
        delete selectedModules[choiceId];
      }
    
      // Mettre à jour uniquement les autres lignes
      document.querySelectorAll('tr[data-choice]').forEach(otherRow => {
        const otherId = otherRow.dataset.choice;
        if (otherId === choiceId) return; // On garde cette ligne comme avant
    
        const niv2   = otherRow.querySelector('.niveau-select').value;
        const spec2  = otherRow.querySelector('.specialite-select').value;
        const sem2El = otherRow.querySelector('.semestre-select');
        const sem2   = sem2El.value || sem2El.getAttribute('value') || "";
        const modSel2= otherRow.querySelector('.module-select');
    
        if (niv2 && spec2 && sem2) {
          updateModuleDropdown(niv2, spec2, sem2, modSel2, otherId);
        }
      });
      
      // Si la sélection a changé, s'assurer que la valeur est bien mise à jour
      if (previousValue !== selId) {
        moduleSelect.value = selId;
      }
    });
  });
}

function updateModuleDropdown(niveau, specialite, semestre, moduleSelect, currentChoiceId) {
  // Mémoriser la valeur sélectionnée avant de réinitialiser
  const selectedValue = moduleSelect.value;
  
  resetDropdown(moduleSelect, "Module");
  const possible = data[niveau]?.[specialite]?.[semestre] || [];

  // Filtrer ceux déjà pris (par ID)
  const filtered = possible.filter(mod => {
    // Convertir les IDs en chaînes pour comparaison uniforme
    const modId = String(mod.id);
    
    return !Object.entries(selectedModules).some(([otherId, sel]) => 
      otherId !== currentChoiceId && // Ne pas filtrer la sélection courante
      String(sel.moduleId) === modId &&
      sel.niveau === niveau &&
      sel.specialite === specialite &&
      sel.semestre === semestre
    );
  });

  // Ajouter les options
  filtered.forEach(mod => {
    moduleSelect.appendChild(createOption(mod.id, mod.nom));
  });

  // Restaurer la sélection existante si besoin
  const prev = selectedModules[currentChoiceId];
  if (prev) moduleSelect.value = prev.moduleId;
  else if (selectedValue && filtered.some(mod => String(mod.id) === selectedValue)) {
    moduleSelect.value = selectedValue;
  }
}

// ————— Utilitaires —————

function resetDropdown(select, label) {
  select.innerHTML = `<option value="">Sélectionner ${label}</option>`;
}

function createOption(value, text) {
  const opt = document.createElement('option');
  opt.value = value;
  opt.textContent = text;
  return opt;
}

    // Gestion des heures
    function setupHourCheckboxes() {
      document.querySelectorAll('.hour-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const total = calculateTotalHours();
          if (total > 24) {
            alert('Le total ne doit pas dépasser 24h !');
            this.checked = false;
          }
        });
      });
    }
  
    function calculateTotalHours() {
      let total = 0;
      document.querySelectorAll('.hour-checkbox:checked').forEach(checkbox => {
        total += parseFloat(checkbox.dataset.hours);
      });
      return total;
    }
  
    // Initialisation
    initDropdowns();
    setupHourCheckboxes();
    
    console.log("Script de formulaire chargé avec succès");
  

  window.onload = () => {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "/login.html";
  
    fetch("/api/auth/profile", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Non autorisé");
        return res.json();
      })
      .then(data => {
        const u = data.user;
        const divs = document.querySelectorAll(".teacher-info div");
        divs[0].querySelector("span").textContent = `${u.nom} ${u.prenom}`;
        divs[1].querySelector("span").textContent = u.grade;
        divs[2].querySelector("span").textContent = u.email;
        divs[3].querySelector("span").textContent = `ENS-${u.id.toString().padStart(4,'0')}`;
        divs[4].querySelector("span").textContent = u.faculte;
        divs[5].querySelector("span").textContent = u.departement;
      })
      .catch(err => {
        console.error("Erreur de chargement:", err);
        window.location.href = "/loginsignup.html";
      });
      
  };
  document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('.submit-button');
    
    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Créer des tableaux séparés pour chaque semestre
        const choixS1 = [];
        const choixS2 = [];
        
        // Récupérer tous les choix du tableau
        const choiceRows = document.querySelectorAll('[data-choice]');
        
        choiceRows.forEach(row => {
            const semestre = row.querySelector('.semestre-select').value;
            const moduleSelect = row.querySelector('.module-select');
            const moduleId = moduleSelect.value; // L'ID du module
            
            // Vérifier les types d'enseignement sélectionnés
            const types_enseignement = [];
            
            if (row.querySelector('.hour-checkbox[data-hours="3"]').checked) {
                types_enseignement.push('cours');
            }
            if (row.querySelector('.hour-checkbox[data-hours="2"]').checked) {
                types_enseignement.push('td');
            }
            if (row.querySelector('.hour-checkbox[data-hours="1.5"]').checked) {
                types_enseignement.push('tp');
            }
            
            // Seulement ajouter si un module est sélectionné ET au moins un type d'enseignement
            if (moduleId && types_enseignement.length > 0) {
                const choix = {
                    moduleId: parseInt(moduleId), // Assurez-vous que c'est un nombre
                    type_enseignement: types_enseignement // Tableau des types sélectionnés
                };
                
                // Ajouter au tableau correspondant selon le semestre
                if (semestre === 'S1') {
                    choixS1.push(choix);
                } else if (semestre === 'S2') {
                    choixS2.push(choix);
                }
            }
        });
        
        // Récupérer les autres données
        const pfe_master = document.getElementById('pfe-master').value || "1";
        const pfe_licence = document.getElementById('pfe-licence').value || "1";
        const heures_sup = document.getElementById('heures-sup').value || "0";
        const commentaire = document.getElementById('commentaire').value || "";
        
        // Construire l'objet complet 
        const ficheDeVoeux = {
          choixS1: choixS1,
          choixS2: choixS2,
          nb_pfe_licence: parseInt(document.getElementById('pfe-licence').value) || 1,
          nb_pfe_master: parseInt(document.getElementById('pfe-master').value) || 1,
          heures_sup: parseInt(heures_sup),
          commentaire: commentaire
        };
        
        console.log("Données à envoyer:", JSON.stringify(ficheDeVoeux));
        
        // Récupération du token
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert("🔒 Vous devez être connecté(e) !");
            return;
        }
        
        try {
          const timestamp = new Date().getTime();
          const response = await fetch(`http://localhost:5000/voeux/submit?t=${timestamp}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(ficheDeVoeux)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('✅ Fiche de vœux envoyée avec succès !');
                console.log('✅ Réponse du serveur :', data);
            } else {
                console.error(' Erreur :', data.message || 'Une erreur est survenue');
                alert(' Erreur : ' + (data.message || 'Vérifiez vos données'));
            }
            
        } catch (err) {
            console.error(' Erreur réseau :', err);
            alert(' Erreur de connexion au serveur');
        }
    });
});