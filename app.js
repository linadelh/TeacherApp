
const express = require('express');
const app = express();
const port = 3009; // Port local (change-le si besoin)

// Route simple pour tester
app.get('/', (req, res) => {
  res.send('✅ Le serveur fonctionne ! Modifie-moi et sauvegarde pour voir Nodemon relancer le serveur.');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});