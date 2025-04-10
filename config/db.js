
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost', // Remplace par ton hôte si différent
    user: 'root', // Ton utilisateur MySQL
    password: '0101', // Ton mot de passe MySQL (laisse vide si tu n’en as pas)
    database: 'gestion_voeux' // Remplace par le nom de ta base de données
});

// Vérification de la connexion
connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à MySQL :', err);
        return;
    }
    console.log('Connecté à MySQL ✅');
});

module.exports = connection;
