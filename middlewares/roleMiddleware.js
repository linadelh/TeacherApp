// middlewares/roleMiddleware.js

module.exports = function authorizeRoles(...rolesAutorises) {
    return (req, res, next) => {
        const userRole = req.user.role; // le rôle vient du token JWT décodé dans authMiddleware

        if (!rolesAutorises.includes(userRole)) {
            return res.status(403).json({ message: "Accès refusé : rôle non autorisé" });
        }

        next(); // Le rôle est bon, on continue
    };
};
