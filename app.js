require("dotenv").config();

const express = require('express');
const sequelize = require('./config/database');
const app = express();
app.use(express.json());



// ✅ Importation des vrais routeurs maintenant
const enseignantRoutes = require('./routes/enseignantRoutes');
const authRoutes = require('./routes/authRoutes'); // 🔁 MAINTENANT c’est un vrai router !
const protectedRoutes = require('./routes/protectedRoutes');

// ✅ Utilisation
app.use('/api/auth', authRoutes);
app.use('/api/enseignants', enseignantRoutes);
app.use('/api/protected', protectedRoutes);

// ✅ Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue dans le projet de gestion des fiches de vœux');
});

// ✅ Lancement serveur + BDD
const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Base de données synchronisée !');
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Erreur de synchronisation avec la base :', err);
});

