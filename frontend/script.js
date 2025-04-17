
document.addEventListener('DOMContentLoaded', function() {

  const data = {
      L1: {
        "TRONC_COMMUN": {
          S1: [
            "Algorithme et structure de données",
            "Algèbre",
            "Analyse",
            "Physique",
            "Mécanique du point"
          ],
          S2: [
            "Algorithme 2",
            "Algèbre 2",
            "Analyse 2",
            "Physique 2",
            "Probabilité et Statistique",
            "Structure Machine 2"
          ]
        }
      },
      L2: {
        "ACAD": {
          S1: [
            "Algorithme et structure de données",
            "Architecture d'ordinateur",
            "Logique mathématique",
            "Programmation orientée objet",
            "Système d'information",
            "Analyse numérique",
            "Probabilité et statistique"
          ],
          S2: [
            "Base de données",
            "Génie logiciel",
            "Système d'exploitation",
            "Réseaux informatique",
            "Théorie des graphes",
            "Théorie des langages"
          ]
        },
        "ISIL": {
          S1: [
            "Algorithme et structure de données",
            "Architecture d'ordinateur",
            "Logique mathématique",
            "Programmation orientée objet",
            "Système d'information",
            "Analyse numérique",
            "Probabilité et statistique"
          ],
          S2: [
            "Base de données",
            "Génie logiciel",
            "Système d'exploitation",
            "Réseaux informatique",
            "Théorie des graphes",
            "Théorie des langages"
          ]
        },
        "GTR": {
          S1: [
            "Algorithme et structure de données",
            "Réseaux",
            "Utilisation et administration des systèmes d'exploitation",
            "Électronique analogique",
            "Électronique numérique"
          ],
          S2: [
            "Normes et interconnexions réseaux",
            "Administration et exploitation des serveurs",
            "Initiation Web",
            "Protocoles TCP/IP",
            "Propagation et Antennes",
            "Architecture des systèmes et microprocesseurs",
            "Traitement du Signal"
          ]
        }
      },
      L3: {
        "ACAD": {
          S1: [
            "Réseaux",
            "Système d'exploitation 2",
            "Compilation",
            "Génie Logiciel et POO",
            "Théorie des Graphes",
            "Anglais"
          ],
          S2: [
            "Option 2",
            "Option 3",
            "Projet de Fin d'Études"
          ]
        },
        "ISIL": {
          S1: [
            "Base de Données 2",
            "Génie Logiciel 2 (GL2)",
            "Systèmes d'Information 2 (SI2)",
            "Compilation",
            "Réseaux 1",
            "Système d'exploitation 2 (SYS2)",
            "Anglais"
          ],
          S2: [
            "Génie Logiciel 3",
            "Réseaux 2",
            "Projet de Fin d'Études (PFE)",
            "Outils RAD (ORAD)"
          ]
        },
        "GTR": {
          S1: [
            "Théorie d'information",
            "Systèmes de communication analogiques",
            "Systèmes de télécommunication et interopérabilité",
            "Téléphonie, Téléphonie mobile et IP",
            "Administration réseaux",
            "Programmation Web",
            "Réseaux et communications sans fil"
          ],
          S2: [
            "Bases de données",
            "Qualité de service des systèmes informatiques",
            "Sécurité des réseaux",
            "Projet personnel"
          ]
        }
      },
      M1: {
        "BIOINFO": {
          S1: [
            "Anglais",
            "Entrepreneuriat",
            "Gestion des entreprises",
            "Algorithmique et complexité avancée",
            "Bioinformatique et génomique",
            "Biomathématique",
            "Biostatistique",
            "Gestion de projet",
            "Système et programmation de scripts"
          ],
          S2: [
            "Anglais",
            "Techniques de rédaction et recherche",
            "Base de données avancées et entreposage",
            "Intégration de données massives",
            "BioAlgorithmique",
            "Fouille de données 1",
            "Éléments combinatoires d'optimisation",
            "Traitement et analyse d'images"
          ]
        },
        "SII": {
          S1: [
            "Compilation : génération de code et optimisation",
            "Systèmes d'exploitation",
            "Architecture et administration des bases de données",
            "Modélisation et évaluation des performances",
            "Anglais"
          ],
          S2: [
            "Sécurité Informatique",
            "Méta-heuristiques évolutionnaires et algorithmes d'apprentissage",
            "Réseaux de neurones",
            "Commerce électronique et services Web",
            "Technologie des agents",
            "Représentation de connaissances et raisonnement 1",
            "Anglais"
          ]
        },
        "IV": {
          S1: [
            "Anglais",
            "Algorithmes avancés et complexité",
            "Résolution de problèmes",
            "Architecture des bases de données",
            "Systèmes d'exploitation",
            "Communication multimédia",
            "Traitement et analyse d'images"
          ],
          S2: [
            "Anglais",
            "Analyse de données",
            "Fouille de données",
            "Compilation : génération et optimisation de code",
            "Réseaux",
            "Vision artificielle",
            "Conception de jeux et réalité virtuelle",
            "Apprentissage et réseaux de neurones"
          ]
        },
        "BIGDATA": {
          S1: [
            "Anglais",
            "BADO : Bases de données / Optimisation",
            "POO : Programmation orientée objet",
            "PRAVAN : Programmation avancée",
            "GP : Gestion de projet",
            "Graphes et Big Data",
            "THOR : Théorie de l'ordonnancement",
            "SSAD : Stratégie de sécurité pour l'aide à la décision",
            "VT : Veille technologique"
          ],
          S2: [
            "Anglais",
            "ARBD : Architecture des bases de données",
            "ENDO : Entrepôts de données",
            "ANAD : Analyse de données",
            "TCA : Théorie des codes et applications",
            "ETUC : Étude de complexité",
            "AMP : Agilité dans le management",
            "SIG et EDG : Systèmes d'information"
          ]
        },
        "HPC": {
          S1: [
            "Algorithmique et complexité avancée",
            "Architectures avancées",
            "Systèmes d'exploitation",
            "Bases de données avancées",
            "Mathématiques appliquées (Analyse)",
            "Anglais"
          ],
          S2: [
            "Techniques de modélisation",
            "Algorithmique répartie",
            "Architectures parallèles",
            "Réseaux et protocoles",
            "Calcul parallèle",
            "Programmation avancée",
            "Anglais"
          ]
        },
        "IL": {
          S1: [
            "Algorithme avancé et Complexité",
            "Modélisation et évaluation des performances des systèmes",
            "Génie Logiciel",
            "Architecture et administration des bases de données",
            "Gestion de projets de logiciels",
            "Systèmes d'exploitation",
            "Anglais"
          ],
          S2: [
            "Systèmes multimédia",
            "Bases de données avancées",
            "Modélisation et architectures logicielles",
            "Compilation 2",
            "Fondements de l'intelligence artificielle 1",
            "Sécurité informatique",
            "Anglais"
          ]
        },
        "SSI": {
          S1: [
            "Anglais pour l'informatique",
            "Aspects juridiques dans la sécurité informatique",
            "Architectures des réseaux informatiques",
            "Veille technologique et bases de données",
            "Complexité algorithmique",
            "Systèmes d'exploitation",
            "Introduction à la sécurité informatique",
            "Arithmétique modulaire"
          ],
          S2: [
            "Cryptographie et sécurité",
            "Politiques de contrôle d'accès",
            "Administration et tuning de bases de données",
            "Sécurité des réseaux",
            "Sécurité des réseaux sans fil",
            "Sécurité des systèmes",
            "Algorithmique répartie",
            "Sûreté de fonctionnement et fiabilité du logiciel"
          ]
        },
        "RSD": {
          S1: [
            "Algorithme et Complexité avancée",
            "Modélisation Évaluation des performances",
            "Architecture et administration des systèmes",
            "Gestion de projet de développement",
            "Protocoles réseaux et systèmes d'exploitation",
            "Anglais"
          ],
          S2: [
            "Administration client-serveur",
            "Algorithmique et contrôle des systèmes",
            "Systèmes multimédias",
            "Sécurité informatique",
            "Techniques d'optimisation pour les réseaux",
            "Vérification formelle",
            "Anglais"
          ]
        }
      },
      M2: {
        "SII": {
          S1: [
            "Présentation de la connaissance / Traitement automatique du langage",
            "Programmation par contraintes",
            "Vision artificielle",
            "Data mining",
            "Recherche d'information",
            "Anglais"
          ],
        },
        "BIOINFO": {
          S1: [
            "Présentation de la connaissance / Traitement automatique du langage",
            "Programmation par contraintes",
            "Vision artificielle",
            "Data mining",
            "Recherche d'information",
            "Anglais",
            "Calcul parallèle",
            "Architecture et fouille de données 2",
            "Systèmes embarqués",
            "Visualisation de données et réalité augmentée",
            "Biométrie et sécurisation de données",
            "Méthodes conceptuelles d'analyse"
          ]
        },
        "IV": {
          S1: [
            "Programmation par contraintes",
            "Vision artificielle",
            "Data mining",
            "Recherche d'information",
            "Anglais",
            "Calcul parallèle",
            "Architecture et fouille de données 2",
            "Systèmes embarqués",
            "Visualisation de données et réalité augmentée",
            "Biométrie et sécurisation de données",
            "Méthodes conceptuelles d'analyse",
            "Atelier créatif",
            "Synthèse d\'images",
            "Gestion de projet",
            "Visualisation de données",
            "Représentation de connaissances et raisonnement",
            "Théorie des jeux",
            "Programmation réseau",
            "Systèmes d\'exploitation mobiles"
          ]
        },
        "BIGDATA": {
          S1: [
            "ANGLAIS",
            "ANADISS",
            "TIAD",
            "BDABD",
            "OPTDIS",
            "DESIN",
            "TBI-SIG"
          ]
        },
        "HPC": {
          S1: [
            "Systèmes Parallèles",
            "Gestion des grilles de calcul",
            "Programmation Multi-Cœurs",
            "Systèmes d'exploitation des ordinateurs",
            "Calcul Embarqué",
            "Imagerie Médicale et Parallélisme",
            "Anglais"
          ]
        },
        "IL": {
          S1: [
            "Génie Logiciel",
            "Concepts Avancés Systèmes d\'Information Coopératifs",
            "Assurance Qualité des Logiciels",
            "Méthodologie et Processus de Développement",
            "Représentation des Connaissances",
            "Systèmes Décisionnels et Entrepôts",
            "Anglais"
          ]
        },
        "SSI": {
          S1: [
            "METHODES OPTIMISATION",
            "MÉTHODES PRATIQUES ET OUTILS DE SYSTÈME",
            "SÉCURITÉ",
            "AUDIT DES SYSTÈMES ET SÛRETÉ",
            "PROGRAMMATION DES SYSTÈMES COMMUNICANTS",
            "MODÉLISATION SÉCURITÉ APPLICATIVE",
            "SÉCURITÉ ET CONTRÔLE DU TRAFIC RÉSEAU"
          ]
        },
        "RSD": {
          S1: [
            "SYSTÈMES SANS FIL",
            "SYSTÈMES DISTRIBUÉS D'EXPLOITATION",
            "INGÉNIERIE DES RÉSEAUX MOBILES",
            "RÉSEAUX",
            "CALCUL PARALLÈLE ET GRILLES DE CALCUL",
            "CONSTRUCTION D'APPLICATIONS RÉPARTIES",
            "Anglais"
          ]
        }
      }
    };
    let selectedModules = {};
  
    function initDropdowns() {
      const choixRows = document.querySelectorAll('tr[data-choice]');
      
      choixRows.forEach(row => {
        const choiceId = row.getAttribute('data-choice');
        const semestreSelect = row.querySelector('.semestre-select');
        const niveauSelect = row.querySelector('.niveau-select');
        const specialiteSelect = row.querySelector('.specialite-select');
        const moduleSelect = row.querySelector('.module-select');
  
        // Remplir les niveaux
        niveauSelect.innerHTML = '<option value="">Sélectionner</option>';
        Object.keys(data).forEach(niveau => {
          const option = document.createElement('option');
          option.value = niveau;
          option.textContent = niveau;
          niveauSelect.appendChild(option);
        });
  
        // Écouteur changement niveau
        niveauSelect.addEventListener('change', function() {
          const niveau = this.value;
          
          // Réinitialiser les autres sélecteurs
          specialiteSelect.innerHTML = '<option value="">Sélectionner</option>';
          moduleSelect.innerHTML = '<option value="">Sélectionner un module</option>';
  
          // Réinitialiser le module sélectionné pour ce choix
          if (selectedModules[choiceId]) {
            delete selectedModules[choiceId];
          }
          
          // Mettre à jour tous les menus déroulants
          updateAllModuleDropdowns();
  
          if (niveau && data[niveau]) {
            // Remplir les spécialités pour ce niveau
            Object.keys(data[niveau]).forEach(specialite => {
              const option = document.createElement('option');
              option.value = specialite;
              option.textContent = specialite;
              specialiteSelect.appendChild(option);
            });
          }
        });
  
        // Écouteur changement spécialité
        specialiteSelect.addEventListener('change', function() {
          const niveau = niveauSelect.value;
          const specialite = this.value;
          const semestre = semestreSelect.value || semestreSelect.getAttribute('value');
          
          // Réinitialiser le sélecteur de modules
          moduleSelect.innerHTML = '<option value="">Sélectionner un module</option>';
          
          // Réinitialiser le module sélectionné pour ce choix
          if (selectedModules[choiceId]) {
            delete selectedModules[choiceId];
          }
          
          // Mettre à jour tous les menus déroulants
          updateAllModuleDropdowns();
          
          // Mettre à jour les modules disponibles
          updateModuleDropdown(niveau, specialite, semestre, moduleSelect, choiceId);
        });
  
        // Écouteur changement module
        moduleSelect.addEventListener('change', function() {
          const selectedModule = this.value;
          
          // Si un module était déjà sélectionné pour ce choix, le supprimer
          if (selectedModules[choiceId]) {
            delete selectedModules[choiceId];
          }
          
          // Ajouter le nouveau module sélectionné
          if (selectedModule) {
            selectedModules[choiceId] = {
              module: selectedModule,
              niveau: niveauSelect.value,
              specialite: specialiteSelect.value,
              semestre: semestreSelect.value || semestreSelect.getAttribute('value')
            };
          }
          
          // Mettre à jour tous les menus déroulants
          updateAllModuleDropdowns();
        });
      });
    }
  
    function updateAllModuleDropdowns() {
      document.querySelectorAll('tr[data-choice]').forEach(row => {
        const choiceId = row.getAttribute('data-choice');
        const niveauSelect = row.querySelector('.niveau-select');
        const specialiteSelect = row.querySelector('.specialite-select');
        const semestreSelect = row.querySelector('.semestre-select');
        const moduleSelect = row.querySelector('.module-select');
  
        const niveau = niveauSelect.value;
        const specialite = specialiteSelect.value;
        const semestre = semestreSelect.value || semestreSelect.getAttribute('value');
  
        if (niveau && specialite && semestre) {
          updateModuleDropdown(niveau, specialite, semestre, moduleSelect, choiceId);
        }
      });
    }
  
    function updateModuleDropdown(niveau, specialite, semestre, moduleSelect, currentChoiceId) {
      moduleSelect.innerHTML = '<option value="">Sélectionner un module</option>';
      
      if (niveau && specialite && semestre && 
          data[niveau] && data[niveau][specialite] && data[niveau][specialite][semestre]) {
        
        const availableModules = data[niveau][specialite][semestre];
        
        const filteredModules = availableModules.filter(module => {
          // Vérifier si ce module est déjà sélectionné dans un autre choix
          for (const choiceId in selectedModules) {
            const selection = selectedModules[choiceId];
            if (choiceId !== currentChoiceId && 
                selection.module === module &&
                selection.niveau === niveau &&
                selection.specialite === specialite &&
                selection.semestre === semestre) {
              return false; // Module déjà sélectionné dans le même contexte
            }
          }
          return true; // Module disponible
        });
        
        filteredModules.forEach(module => {
          const option = document.createElement('option');
          option.value = module;
          option.textContent = module;
          moduleSelect.appendChild(option);
        });
  
        // Si un module est déjà sélectionné pour ce choix, le sélectionner
        if (selectedModules[currentChoiceId]) {
          moduleSelect.value = selectedModules[currentChoiceId].module;
        }
      }
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
  });