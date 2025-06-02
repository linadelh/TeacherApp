const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Aucun token fourni" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            ...decoded, // tu recopies les infos utiles
            enseignantId: decoded.enseignantId // facultatif si déjà inclus
        };
        next(); // ✅ très important !
    } catch (error) {
        return res.status(401).json({ message: "Token invalide." });
    }
};

module.exports = authMiddleware; // ✅ tu exportes la fonction elle-même


