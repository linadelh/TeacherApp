require("dotenv").config();

const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const cors = require('cors');


const app = express();
app.use(cors()); // 
app.use(express.json());


// ✅ Middleware pour servir les fichiers statiques (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));




// ✅ Importation des routeurs
const enseignantRoutes = require('./routes/enseignantRoutes');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const voeuRoutes = require('./routes/voeuRoute');
const moduleRoutes = require('./routes/moduleRoutes');


// ✅ Utilisation des routeurs API
app.use('/api/auth', authRoutes);
app.use('/api/enseignants', enseignantRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/voeux', voeuRoutes);
app.use('/api', moduleRoutes);

// ✅ Route principale pour afficher la page de connexion
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'loginsignup.html'));
});


// ✅ Lancement du serveur et synchronisation de la BDD
const PORT = process.env.PORT || 5001;

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Base de données synchronisée !');
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Erreur de synchronisation avec la base :', err);
});
