const express = require("express");
const router = express.Router();

// Route GET simple
router.get("/", (req, res) => {
    res.json({ message: "Route de test fonctionnelle ✅" });
});

module.exports = router;

