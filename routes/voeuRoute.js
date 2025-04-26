
const express = require('express');
const router = express.Router();
const voeuController = require('../controllers/voeuController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/submit', authMiddleware, voeuController.soumettreFicheVoeux);
router.get('/last', authMiddleware, voeuController.recupererDerniersVoeux);
router.post('/update/:id', authMiddleware, voeuController.modifierFicheVoeux);

router.post('/', (req, res) => {
    console.log('✅ Vœux reçus :', req.body);
    res.status(200).json({ message: 'Vœux enregistrés avec succès ✅' });
  });
module.exports = router;