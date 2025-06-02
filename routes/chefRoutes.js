const express = require('express');
const router = express.Router();
const chefController = require('../controllers/chefController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/dashboard', 
  authMiddleware,
  roleMiddleware('chef_de_departement'),
  chefController.getDashboard
);
module.exports = router;