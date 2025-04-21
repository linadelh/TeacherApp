CREATE DATABASE gestion_voeux;
USE gestion_voeux ; 
 
 
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    role ENUM('enseignant', 'chef_de_departement') NOT NULL DEFAULT 'enseignant',
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE enseignants (
    utilisateur_id INT PRIMARY KEY, 
    grade ENUM('MAB', 'MAA', 'MCB', 'MCA', 'PROF') NOT NULL,
    departement ENUM('SIQ', 'AI', 'SD') DEFAULT NULL,
    faculte ENUM('mathematique', 'informatique', 'genie civil', 'physique', 'electronique') NOT NULL,
    statut ENUM('actif', 'inactif') DEFAULT 'actif',
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);
 
CREATE TABLE modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    niveau ENUM('L1', 'L2', 'L3', 'M1', 'M2') NOT NULL,
    specialite ENUM('TRONC_COMMUN','ACAD', 'ISIL', 'GTR', 'BIOINFO', 'SII', 'IV', 'BIGDATA', 'HPC', 'IL', 'SSI', 'RSD') NOT NULL,
    semestre ENUM('S1', 'S2') NOT NULL,
    nom_module VARCHAR(100) NOT NULL,
    heures_cours INT NOT NULL DEFAULT 3,
    heures_td INT NOT NULL DEFAULT 2,
    heures_tp DECIMAL(3, 1) NOT NULL DEFAULT 1.5,
    UNIQUE(niveau, specialite, semestre, nom_module)
);
 
 
CREATE TABLE voeux (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utilisateur_id INT NOT NULL,
    semestre ENUM('S1', 'S2') NOT NULL,
    status ENUM('en attente', 'accepté', 'en négociation', 'refusé') DEFAULT 'en attente',
	nb_pfe_licence INT DEFAULT 1 CHECK (nb_pfe_licence >= 1),  -- PFE Licence (min 1)
    nb_pfe_master INT DEFAULT 1 CHECK (nb_pfe_master >= 1),    -- PFE Master (min 1)
    heures_sup INT DEFAULT 0 CHECK (heures_sup >= 0), 
    commentaire TEXT DEFAULT NULL,
    date_soumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES enseignants(utilisateur_id) ON DELETE CASCADE
);
 
 
CREATE TABLE module_voeux (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    voeu_id INT NOT NULL,
    module_id INT NOT NULL,
    type_enseignement ENUM('Cours', 'TD', 'TP') NOT NULL,
    FOREIGN KEY (voeu_id) REFERENCES voeux(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE (voeu_id, module_id, type_enseignement) -- Empêche les doublons
);
 
CREATE TABLE negociations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voeu_id INT NOT NULL,
    chef_de_departement_id INT NOT NULL,
    commentaire TEXT NOT NULL,
	nouveau_nb_pfe_licence INT DEFAULT NULL CHECK (nouveau_nb_pfe_licence >= 1),
    nouveau_nb_pfe_master INT DEFAULT NULL CHECK (nouveau_nb_pfe_master >= 1),
    nouvelles_heures_sup INT DEFAULT NULL,
    statut ENUM('en attente', 'accepté', 'refusé') DEFAULT 'en attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (voeu_id) REFERENCES voeux(id) ON DELETE CASCADE,
    FOREIGN KEY (chef_de_departement_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);
 
CREATE TABLE negociations_modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    negociation_id INT NOT NULL,
    type_enseignement ENUM('Cours', 'TD', 'TP') NOT NULL,
    module_id INT NOT NULL,
    FOREIGN KEY (negociation_id) REFERENCES negociations(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);
 
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utilisateur_id INT NOT NULL,
    type_notification ENUM('voeu accepté', 'négociation', 'nouveau voeu') NOT NULL,
    message TEXT NOT NULL,
    statut ENUM('non lu', 'lu') DEFAULT 'non lu',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);
 
CREATE TABLE recapitulatif (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voeu_id INT NOT NULL,  
    module_id INT NOT NULL,
    type_enseignement ENUM('Cours', 'TD', 'TP') NOT NULL,  
    FOREIGN KEY (voeu_id) REFERENCES voeux(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);
 
INSERT INTO modules (niveau, specialite, semestre, nom_module) VALUES
-- L1
('L1', 'TRONC_COMMUN', 'S1', 'Algorithme et structure de données'),
('L1', 'TRONC_COMMUN', 'S1', 'Algèbre'),
('L1', 'TRONC_COMMUN', 'S1', 'Analyse'),
('L1', 'TRONC_COMMUN', 'S1', 'Physique'),
('L1', 'TRONC_COMMUN', 'S1', 'Mécanique du point'),
('L1', 'TRONC_COMMUN', 'S2', 'Algorithme 2'),
('L1', 'TRONC_COMMUN', 'S2', 'Algèbre 2'),
('L1', 'TRONC_COMMUN', 'S2', 'Analyse 2'),
('L1', 'TRONC_COMMUN', 'S2', 'Physique 2'),
('L1', 'TRONC_COMMUN', 'S2', 'Probabilité et Statistique'),
('L1', 'TRONC_COMMUN', 'S2', 'Structure Machine 2'),
 
-- L2 ACAD
('L2', 'ACAD', 'S1', 'Algorithme et structure de données'),
('L2', 'ACAD', 'S1', 'Architecture d\'ordinateur'),
('L2', 'ACAD', 'S1', 'Logique mathématique'),
('L2', 'ACAD', 'S1', 'Programmation orientée objet'),
('L2', 'ACAD', 'S1', 'Système d\'information'),
('L2', 'ACAD', 'S1', 'Analyse numérique'),
('L2', 'ACAD', 'S1', 'Probabilité et statistique'),
('L2', 'ACAD', 'S2', 'Base de données'),
('L2', 'ACAD', 'S2', 'Génie logiciel'),
('L2', 'ACAD', 'S2', 'Système d\'exploitation'),
('L2', 'ACAD', 'S2', 'Réseaux informatique'),
('L2', 'ACAD', 'S2', 'Théorie des graphes'),
('L2', 'ACAD', 'S2', 'Théorie des langages'),
 
-- L2 ISIL 
('L2', 'ISIL', 'S1', 'Algorithme et structure de données'),
('L2', 'ISIL', 'S1', 'Architecture d\'ordinateur'),
('L2', 'ISIL', 'S1', 'Logique mathématique'),
('L2', 'ISIL', 'S1', 'Programmation orientée objet'),
('L2', 'ISIL', 'S1', 'Système d\'information'),
('L2', 'ISIL', 'S1', 'Analyse numérique'),
('L2', 'ISIL', 'S1', 'Probabilité et statistique'),
('L2', 'ISIL', 'S2', 'Base de données'),
('L2', 'ISIL', 'S2', 'Génie logiciel'),
('L2', 'ISIL', 'S2', 'Système d\'exploitation'),
('L2', 'ISIL', 'S2', 'Réseaux informatique'),
('L2', 'ISIL', 'S2', 'Théorie des graphes'),
('L2', 'ISIL', 'S2', 'Théorie des langages'),
 
-- L2 GTR
('L2', 'GTR', 'S1', 'Algorithme et structure de données'),
('L2', 'GTR', 'S1', 'Réseaux'),
('L2', 'GTR', 'S1', 'Utilisation et administration des systèmes d\'exploitation'),
('L2', 'GTR', 'S1', 'Électronique analogique'),
('L2', 'GTR', 'S1', 'Électronique numérique'),
('L2', 'GTR', 'S2', 'Normes et interconnexions réseaux'),
('L2', 'GTR', 'S2', 'Administration et exploitation des serveurs'),
('L2', 'GTR', 'S2', 'Initiation Web'),
('L2', 'GTR', 'S2', 'Protocoles TCP/IP'),
('L2', 'GTR', 'S2', 'Propagation et Antennes'),
('L2', 'GTR', 'S2', 'Architecture des systèmes et microprocesseurs'),
('L2', 'GTR', 'S2', 'Traitement du Signal'),
 
-- L3 ACAD
('L3', 'ACAD', 'S1', 'Réseaux'),
('L3', 'ACAD', 'S1', 'Système d\'exploitation 2'),
('L3', 'ACAD', 'S1', 'Compilation'),
('L3', 'ACAD', 'S1', 'Génie Logiciel et POO'),
('L3', 'ACAD', 'S1', 'Théorie des Graphes'),
('L3', 'ACAD', 'S1', 'Anglais'),
('L3', 'ACAD', 'S2', 'Option 2'),
('L3', 'ACAD', 'S2', 'Option 3'),
('L3', 'ACAD', 'S2', 'Projet de Fin d\'Études'),
 
-- L3 ISIL
('L3', 'ISIL', 'S1', 'Base de Données 2'),
('L3', 'ISIL', 'S1', 'Génie Logiciel 2 (GL2)'),
('L3', 'ISIL', 'S1', 'Systèmes d\'Information 2 (SI2)'),
('L3', 'ISIL', 'S1', 'Compilation'),
('L3', 'ISIL', 'S1', 'Réseaux 1'),
('L3', 'ISIL', 'S1', 'Système d\'exploitation 2 (SYS2)'),
('L3', 'ISIL', 'S1', 'Anglais'),
('L3', 'ISIL', 'S2', 'Génie Logiciel 3'),
('L3', 'ISIL', 'S2', 'Réseaux 2'),
('L3', 'ISIL', 'S2', 'Projet de Fin d\'Études (PFE)'),
('L3', 'ISIL', 'S2', 'Outils RAD (ORAD)'),
 
-- L3 GTR
('L3', 'GTR', 'S1', 'Théorie d\'information'),
('L3', 'GTR', 'S1', 'Systèmes de communication analogiques'),
('L3', 'GTR', 'S1', 'Systèmes de télécommunication et interopérabilité'),
('L3', 'GTR', 'S1', 'Téléphonie, Téléphonie mobile et IP'),
('L3', 'GTR', 'S1', 'Administration réseaux'),
('L3', 'GTR', 'S1', 'Programmation Web'),
('L3', 'GTR', 'S1', 'Réseaux et communications sans fil'),
('L3', 'GTR', 'S2', 'Bases de données'),
('L3', 'GTR', 'S2', 'Qualité de service des systèmes informatiques'),
('L3', 'GTR', 'S2', 'Sécurité des réseaux'),
('L3', 'GTR', 'S2', 'Projet personnel'),
 
-- M1 BIOINFO
('M1', 'BIOINFO', 'S1', 'Anglais'),
('M1', 'BIOINFO', 'S1', 'Entrepreneuriat'),
('M1', 'BIOINFO', 'S1', 'Gestion des entreprises'),
('M1', 'BIOINFO', 'S1', 'Algorithmique et complexité avancée'),
('M1', 'BIOINFO', 'S1', 'Bioinformatique et génomique'),
('M1', 'BIOINFO', 'S1', 'Biomathématique'),
('M1', 'BIOINFO', 'S1', 'Biostatistique'),
('M1', 'BIOINFO', 'S1', 'Gestion de projet'),
('M1', 'BIOINFO', 'S1', 'Système et programmation de scripts'),
('M1', 'BIOINFO', 'S2', 'Anglais'),
('M1', 'BIOINFO', 'S2', 'Techniques de rédaction et recherche'),
('M1', 'BIOINFO', 'S2', 'Base de données avancées et entreposage'),
('M1', 'BIOINFO', 'S2', 'Intégration de données massives'),
('M1', 'BIOINFO', 'S2', 'BioAlgorithmique'),
('M1', 'BIOINFO', 'S2', 'Fouille de données 1'),
('M1', 'BIOINFO', 'S2', 'Éléments combinatoires d\'optimisation'),
('M1', 'BIOINFO', 'S2', 'Traitement et analyse d\'images'),
 
-- M1 SII
('M1', 'SII', 'S1', 'Compilation : génération de code et optimisation'),
('M1', 'SII', 'S1', 'Systèmes d\'exploitation'),
('M1', 'SII', 'S1', 'Architecture et administration des bases de données'),
('M1', 'SII', 'S1', 'Modélisation et évaluation des performances'),
('M1', 'SII', 'S1', 'Anglais'),
('M1', 'SII', 'S2', 'Sécurité Informatique'),
('M1', 'SII', 'S2', 'Méta-heuristiques évolutionnaires et algorithmes d\'apprentissage'),
('M1', 'SII', 'S2', 'Réseaux de neurones'),
('M1', 'SII', 'S2', 'Commerce électronique et services Web'),
('M1', 'SII', 'S2', 'Technologie des agents'),
('M1', 'SII', 'S2', 'Représentation de connaissances et raisonnement 1'),
('M1', 'SII', 'S2', 'Anglais'),
 
-- M1 IV
('M1', 'IV', 'S1', 'Anglais'),
('M1', 'IV', 'S1', 'Algorithmes avancés et complexité'),
('M1', 'IV', 'S1', 'Résolution de problèmes'),
('M1', 'IV', 'S1', 'Architecture des bases de données'),
('M1', 'IV', 'S1', 'Systèmes d\'exploitation'),
('M1', 'IV', 'S1', 'Communication multimédia'),
('M1', 'IV', 'S1', 'Traitement et analyse d\'images'),
('M1', 'IV', 'S2', 'Anglais'),
('M1', 'IV', 'S2', 'Analyse de données'),
('M1', 'IV', 'S2', 'Fouille de données'),
('M1', 'IV', 'S2', 'Compilation : génération et optimisation de code'),
('M1', 'IV', 'S2', 'Réseaux'),
('M1', 'IV', 'S2', 'Vision artificielle'),
('M1', 'IV', 'S2', 'Conception de jeux et réalité virtuelle'),
('M1', 'IV', 'S2', 'Apprentissage et réseaux de neurones'),
 
-- M1 BIGDATA
('M1', 'BIGDATA', 'S1', 'Anglais'),
('M1', 'BIGDATA', 'S1', 'BADO : Bases de données / Optimisation'),
('M1', 'BIGDATA', 'S1', 'POO : Programmation orientée objet'),
('M1', 'BIGDATA', 'S1', 'PRAVAN : Programmation avancée'),
('M1', 'BIGDATA', 'S1', 'GP : Gestion de projet'),
('M1', 'BIGDATA', 'S1', 'Graphes et Big Data'),
('M1', 'BIGDATA', 'S1', 'THOR : Théorie de l\'ordonnancement'),
('M1', 'BIGDATA', 'S1', 'SSAD : Stratégie de sécurité pour l\'aide à la décision'),
('M1', 'BIGDATA', 'S1', 'VT : Veille technologique'),
('M1', 'BIGDATA', 'S2', 'Anglais'),
('M1', 'BIGDATA', 'S2', 'ARBD : Architecture des bases de données'),
('M1', 'BIGDATA', 'S2', 'ENDO : Entrepôts de données'),
('M1', 'BIGDATA', 'S2', 'ANAD : Analyse de données'),
('M1', 'BIGDATA', 'S2', 'TCA : Théorie des codes et applications'),
('M1', 'BIGDATA', 'S2', 'ETUC : Étude de complexité'),
('M1', 'BIGDATA', 'S2', 'AMP : Agilité dans le management'),
('M1', 'BIGDATA', 'S2', 'SIG et EDG : Systèmes d\'information'),
 
-- M1 HPC
('M1', 'HPC', 'S1', 'Algorithmique et complexité avancée'),
('M1', 'HPC', 'S1', 'Architectures avancées'),
('M1', 'HPC', 'S1', 'Systèmes d\'exploitation'),
('M1', 'HPC', 'S1', 'Bases de données avancées'),
('M1', 'HPC', 'S1', 'Mathématiques appliquées (Analyse)'),
('M1', 'HPC', 'S1', 'Anglais'),
('M1', 'HPC', 'S2', 'Techniques de modélisation'),
('M1', 'HPC', 'S2', 'Algorithmique répartie'),
('M1', 'HPC', 'S2', 'Architectures parallèles'),
('M1', 'HPC', 'S2', 'Réseaux et protocoles'),
('M1', 'HPC', 'S2', 'Calcul parallèle'),
('M1', 'HPC', 'S2', 'Programmation avancée'),
('M1', 'HPC', 'S2', 'Anglais'),
 
-- M1 IL
('M1', 'IL', 'S1', 'Algorithme avancé et Complexité'),
('M1', 'IL', 'S1', 'Modélisation et évaluation des performances des systèmes'),
('M1', 'IL', 'S1', 'Génie Logiciel'),
('M1', 'IL', 'S1', 'Architecture et administration des bases de données'),
('M1', 'IL', 'S1', 'Gestion de projets de logiciels'),
('M1', 'IL', 'S1', 'Systèmes d\'exploitation'),
('M1', 'IL', 'S1', 'Anglais'),
('M1', 'IL', 'S2', 'Systèmes multimédia'),
('M1', 'IL', 'S2', 'Bases de données avancées'),
('M1', 'IL', 'S2', 'Modélisation et architectures logicielles'),
('M1', 'IL', 'S2', 'Compilation 2'),
('M1', 'IL', 'S2', 'Fondements de l\'intelligence artificielle 1'),
('M1', 'IL', 'S2', 'Sécurité informatique'),
('M1', 'IL', 'S2', 'Anglais'),
 
-- M1 SSI
('M1', 'SSI', 'S1', 'Anglais pour l\'informatique'),
('M1', 'SSI', 'S1', 'Aspects juridiques dans la sécurité informatique'),
('M1', 'SSI', 'S1', 'Architectures des réseaux informatiques'),
('M1', 'SSI', 'S1', 'Veille technologique et bases de données'),
('M1', 'SSI', 'S1', 'Complexité algorithmique'),
('M1', 'SSI', 'S1', 'Systèmes d\'exploitation'),
('M1', 'SSI', 'S1', 'Introduction à la sécurité informatique'),
('M1', 'SSI', 'S1', 'Arithmétique modulaire'),
('M1', 'SSI', 'S2', 'Cryptographie et sécurité'),
('M1', 'SSI', 'S2', 'Politiques de contrôle d\'accès'),
('M1', 'SSI', 'S2', 'Administration et tuning de bases de données'),
('M1', 'SSI', 'S2', 'Sécurité des réseaux'),
('M1', 'SSI', 'S2', 'Sécurité des réseaux sans fil'),
('M1', 'SSI', 'S2', 'Sécurité des systèmes'),
('M1', 'SSI', 'S2', 'Algorithmique répartie'),
('M1', 'SSI', 'S2', 'Sûreté de fonctionnement et fiabilité du logiciel'),
 
('M1', 'RSD', 'S1', 'Algorithme et Complexité avancée'),
('M1', 'RSD', 'S1', 'Modélisation Évaluation des performances'),
('M1', 'RSD', 'S1', 'Architecture et administration des systèmes'),
('M1', 'RSD', 'S1', 'Gestion de projet de développement'),
('M1', 'RSD', 'S1', 'Protocoles réseaux et systèmes d\'exploitation'),
('M1', 'RSD', 'S1', 'Anglais'),
('M1', 'RSD', 'S2', 'Administration client-serveur'),
('M1', 'RSD', 'S2', 'Algorithmique et contrôle des systèmes'),
('M1', 'RSD', 'S2', 'Systèmes multimédias'),
('M1', 'RSD', 'S2', 'Sécurité informatique'),
('M1', 'RSD', 'S2', 'Techniques d\'optimisation pour les réseaux'),
('M1', 'RSD', 'S2', 'Vérification formelle'),
('M1', 'RSD', 'S2', 'Anglais');
