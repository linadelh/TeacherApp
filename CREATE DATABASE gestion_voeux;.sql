CREATE DATABASE gestion_voeux;
USE gestion_voeux;

-- TABLE UTILISATEURS (ENSEIGNANTS + CHEF DE DEPARTEMENT)
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    role ENUM('enseignant', 'chef_de_departement') NOT NULL DEFAULT 'enseignant',
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE ENSEIGNANTS
CREATE TABLE enseignants (
    utilisateur_id INT PRIMARY KEY,
    grade ENUM('MAB', 'MAA', 'MCB', 'MCA', 'PROF') NOT NULL,
    departement ENUM('SIQ', 'AI', 'SD') DEFAULT NULL,
    faculté ENUM('mathematique', 'informatique', 'genie civil', 'physique', 'electronique') NOT NULL,
    statut ENUM('actif', 'inactif') DEFAULT 'actif',
    FOREIGN KEY (id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);
