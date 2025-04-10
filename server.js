
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');




// Démarrer le serveur
const PORT = 3008;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
