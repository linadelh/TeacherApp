const Voeu = require('../models/Voeu');
const Enseignant = require('../models/Enseignant');
const ModuleVoeu = require('../models/ModuleVoeu');
const Module = require('../models/Module');
const Utilisateur = require('../models/Utilisateur');
const models = require('../models');
exports.getDashboard = async (req, res) => {
   try {
      // Get current user
      const user = await Utilisateur.findByPk(req.user.id, {
         include: [Enseignant]
      });

      // Get all wishes with related data
     const wishes = await Voeu.findAll({
  include: [
    {
      model: Enseignant,
      include: [Utilisateur]
    },
    {
      model: ModuleVoeu,
      include: [{
        model: Module,
        attributes: ['id', 'nom_module', 'niveau', 'semestre', 'specialite'] // <-- ajoute ces champs ici
      }]
    }
  ],
  where: {
    annee: new Date().getFullYear()
  }
});

      // Format the data
      const formattedWishes = wishes.map(wish => ({
         id: wish.id,
         nom: wish.Enseignant.Utilisateur.nom,
         prenom: wish.Enseignant.Utilisateur.prenom,
         grade: wish.Enseignant.grade,
         departement: wish.Enseignant.departement,
         status: wish.status,
         nb_pfe_licence: wish.nb_pfe_licence,
         nb_pfe_master: wish.nb_pfe_master,
         heures_sup: wish.heures_sup,
         commentaire: wish.commentaire,
         modules: wish.ModuleVoeus
  .sort((a, b) => (a.ordre || 0) - (b.ordre || 0))
  .map(mv => ({
    id: mv.Module.id,
    nom_module: mv.Module.nom_module,
    niveau: mv.Module.niveau,
    specialite: mv.Module.specialite,
    semestre: mv.Module.semestre,
    type_enseignement: mv.type_enseignement,
    ordre: mv.ordre
  }))
      }));

      // Calculate stats
      const stats = {
         total: wishes.length,
         accepted: wishes.filter(w => w.status === 'accepté').length,
         negotiation: wishes.filter(w => w.status === 'en négociation').length,
         pending: wishes.filter(w => w.status === 'en attente').length
      };

      res.render('chef/dashboard', {
         user: {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            grade: user.Enseignant.grade,
            departement: user.Enseignant.departement
         },
         wishes: formattedWishes,
         stats: stats
      });

   } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors du chargement du tableau de bord');
   }
};

exports.createNegotiation = async (req, res) => {
   try {
      const chefId = req.user?.id || 1;
      const {
         voeu_id,
         commentaire,
         modules,
         enseignant_id
      } = req.body;
      const voeu = await Voeu.findByPk(voeu_id);
      if (!voeu) {
         return res.status(404).json({ error: "Voeu not found" });
      }
      const utilisateur_id = voeu.utilisateur_id;
      // 1. Create negotiation record
      let negotiation;
      try {
         negotiation = await Negociations.create({
            voeu_id,
            commentaire,
            enseignant_id : utilisateur_id,
            chef_id:1
         });
      } catch (err) {
         console.error("Failed to create negotiation:", err);
         return res.status(500).json({
            error: err.message
         });
      }

      // 2. Save proposed modules
      if (modules && modules.length > 0) {
         await NegociationsModules.bulkCreate(
            modules.map(m => ({
               negociation_id: negotiation.id,
               module_id: m.module_id,
               type_enseignement: m.type_enseignement || 'Cours'
            }))
         );
      }

      // 3. Update original request status
      await Voeu.update({
         status: 'en négociation'
      }, {
         where: {
            id: voeu_id
         }
      });
      await Notification.create({
         teacherId: utilisateur_id ,//11
         message: `Nouvelle négociation reçue: ${commentaire}`,
         readme: false
      });
      console.log("✅ Négociation envoyée avec succès");
      return res.status(201).json({
         success: true,
         message: "Négociation créée"
      });

   } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({
         success: false,
         error: error.message
      });
   }
};


// Render the chef dashboard (EJS view)
exports.dashboard = async (req, res) => {
   try {
      // Verify DB connection
      const [testData] = await sequelize.query('SELECT 1 AS test');
      console.log('DB connection test:', testData);

      // Fetch teachers
      let teachers = [];
      try {
         const teacherResults = await sequelize.query(
            `SELECT u.id, u.nom, u.prenom,
                e.grade, e.departement,
                v.id AS voeu_id, v.annee, v.status,
                v.nb_pfe_licence, v.nb_pfe_master,
                v.heures_sup, v.commentaire
         FROM utilisateurs u
         JOIN enseignants e ON u.id = e.utilisateur_id
         LEFT JOIN voeux v ON u.id = v.utilisateur_id
         WHERE u.role = 'enseignant'`, {
               type: sequelize.QueryTypes.SELECT,
               raw: true
            }
         );
         teachers = Array.isArray(teacherResults) ? teacherResults : [];
      } catch (err) {
         console.error('Teacher query failed:', err);
         teachers = [];
      }

      // Fetch modules per teacher
      const teachersWithModules = await Promise.all(
         teachers.map(async (teacher) => {
            try {
               if (!teacher.voeu_id) return {
                  ...teacher,
                  modules: []
               };

               const [modules] = await sequelize.query(
                  `SELECT m.nom_module, m.niveau, m.semestre, m.specialite, mv.type_enseignement
                   FROM module_voeux mv
                   JOIN modules m ON mv.module_id = m.id
             WHERE mv.voeu_id = ${teacher.voeu_id}`
               );
               return {
                  ...teacher,
                  modules: Array.isArray(modules) ? modules : []
               };
            } catch (moduleErr) {
               console.error(`Modules failed for teacher ${teacher.id}:`, moduleErr);
               return {
                  ...teacher,
                  modules: []
               };
            }
         })
      );

      // Get counts
      let counts = {
         total: 0,
         accepted: 0,
         negotiating: 0,
         pending: 0
      };
      try {
         const [countResults] = await sequelize.query(
            `SELECT COUNT(*) AS total,
                SUM(status = 'accepté') AS accepted,
                SUM(status = 'en négociation') AS negotiating,
                SUM(status = 'en attente') AS pending
         FROM voeux`, {
               type: sequelize.QueryTypes.SELECT
            }
         );
         if (countResults) {
            counts = {
               total: countResults.total || 0,
               accepted: countResults.accepted || 0,
               negotiating: countResults.negotiating || 0,
               pending: countResults.pending || 0
            };
         }
      } catch (countErr) {
         console.error('Count query failed:', countErr);
      }
      console.log(JSON.stringify(teachersWithModules[0], null, 2));
      // Render view
      res.render('chef', {
         teachers: teachersWithModules,
         counts
      });

   } catch (mainErr) {
      console.error('Critical /chef error:', mainErr);
      res.status(500).render('error', {
         message: 'System error occurred',
         error: process.env.NODE_ENV === 'development' ? mainErr : null
      });
   }
};


/* =======================================
   controllers/chefController.js
   Teacher Preferences JSON API
   ======================================= */
exports.teacherPreferences = async (req, res) => {
   try {
      const [teachers] = await sequelize.query(
         `SELECT u.id, u.nom, u.prenom,
              e.grade, e.departement,
              v.id AS voeu_id, v.annee, v.status
       FROM utilisateurs u
       JOIN enseignants e ON u.id = e.utilisateur_id
       LEFT JOIN voeux v ON u.id = v.utilisateur_id
       WHERE u.role = 'enseignant'`
      );

      for (const teacher of teachers) {
         if (teacher.voeu_id) {
            const [modules] = await sequelize.query(
              `SELECT m.nom_module, m.niveau, m.semestre, m.specialite, mv.type_enseignement
    FROM module_voeux mv
    JOIN modules m ON mv.module_id = m.id
           WHERE mv.voeu_id = ${teacher.voeu_id}`
            );
            teacher.modules = modules;
         } else {
            teacher.modules = [];
         }
      }

      res.json({
         success: true,
         teachers: teachers.map(t => ({
            id: t.id,
            name: `${t.prenom} ${t.nom}`,
            grade: t.grade,
            department: t.departement,
            year: t.annee,
            modules: t.modules
         }))
      });
   } catch (err) {
      console.error('Teacher preferences error:', err);
      res.status(500).json({
         success: false,
         error: 'Server error'
      });
   }
};