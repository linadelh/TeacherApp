const express = require('express');
const router = express.Router();
const db = require('../config/database');
const voeuController = require('../controllers/voeuController');
const chefController = require('../controllers/chefController');
const authMiddleware = require('../middlewares/authMiddleware');



// JSON API for teacher preferences
router.get('/teacher-preferences', chefController.teacherPreferences);

router.get('/', (req, res) => {

    const sql = 'SELECT * FROM voeux';

    db.query(sql, (err, results) => {
        if (err) {
            console.error("DB Error:", err); 
            return res.status(500).json({
                error: 'Failed to fetch voeux'
            });
        }
        res.json(results);
    });

});

router.get('/simple-stats', (req, res) => {

    const sql = `
    SELECT 
      COUNT(*) as total,
      SUM(status = 'accepté') as accepted,
      SUM(status = 'en négociation') as negotiating,
      SUM(status = 'en attente') as pending
    FROM voeux
  `;
    db.query(sql, {
        type: db.QueryTypes.SELECT
    }).then(result => {
        res.json(result[0]); // Return the first row of results
    }).catch(err => {
        console.error("DB Error details:", err);
        res.status(500).json({
            error: 'Failed to fetch stats',
            details: err.message
        });
    });
});

// New routes you requested to add
router.post('/submit', authMiddleware, voeuController.soumettreFicheVoeux);
//router.get('/last', authMiddleware, voeuController.recupererDerniersVoeux);
router.put('/update/:id', authMiddleware, voeuController.modifierFicheVoeux);


router.post('/', (req, res) => {
    res.status(200).json({
        message: 'Vœux enregistrés avec succès ✅'
    });
});



router.get('/teacher-wishes/:voeuId', async (req, res) => {
    try {
        const {
            voeuId
        } = req.params;

        // 1. Get the specific wish with teacher details
        const [wish] = await db.query(`
      SELECT 
        u.id, u.nom, u.prenom,
        e.grade, e.departement,
        v.id as voeu_id, v.annee, v.status,
        v.nb_pfe_licence, v.nb_pfe_master,
        v.heures_sup, v.commentaire
      FROM utilisateurs u
      JOIN enseignants e ON u.id = e.utilisateur_id
      JOIN voeux v ON u.id = v.utilisateur_id
      WHERE v.id = :voeuId
      LIMIT 1
    `, {
            replacements: {
                voeuId
            },
            type: db.QueryTypes.SELECT
        });

        if (!wish) {
            return res.status(404).json({
                success: false,
                error: 'Wish not found'
            });
        }

        // 2. Get ALL modules for this wish
        const modules = await db.query(`
      SELECT 
        m.id as module_id,
        m.nom_module, 
        m.niveau, 
        m.specialite, 
        m.semestre, 
        mv.type_enseignement
      FROM module_voeux mv
      JOIN modules m ON mv.module_id = m.id
      WHERE mv.voeu_id = :voeuId
    `, {
            replacements: {
                voeuId
            },
            type: db.QueryTypes.SELECT
        });

        // 3. Combine the data and send response
        res.json({
            success: true,
            data: {
                ...wish, // Spread all wish/teacher properties
                modules: modules // Add modules array
            }
        });

    } catch (error) {
        console.error('Error in /api/voeux/teacher-wishes/:voeuId:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch teacher wish',
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
});
router.get('/dashboard', async (req, res) => {
    try {

        // 2. Fetch all teachers with their wishes
        const teachers = await db.query(
            `SELECT 
        u.id, u.nom, u.prenom,
        e.grade, e.departement,
        v.id AS voeu_id, v.annee, v.status,
        v.nb_pfe_licence, v.nb_pfe_master,
        v.heures_sup, v.commentaire
       FROM utilisateurs u
       JOIN enseignants e ON u.id = e.utilisateur_id
       LEFT JOIN voeux v ON u.id = v.utilisateur_id
       WHERE u.role = 'enseignant'`, {
                type: db.QueryTypes.SELECT
            }
        );

        // 3. Fetch modules for each teacher's wish
        const teachersWithModules = await Promise.all(
            teachers.map(async (teacher) => {
                if (!teacher.voeu_id) return {
                    ...teacher,
                    modules: []
                };

                const modules = await db.query(
                   `SELECT m.nom_module, m.niveau, m.semestre, m.specialite, mv.type_enseignement
     FROM module_voeux mv
     JOIN modules m ON mv.module_id = m.id
     WHERE mv.voeu_id = :voeuId`, {
                        replacements: {
                            voeuId: teacher.voeu_id
                        },
                        type: db.QueryTypes.SELECT
                    }
                );

                return {
                    ...teacher,
                    modules
                };
            })
        );

        // 4. Get wish statistics
        const [counts] = await db.query(
            `SELECT 
        COUNT(*) AS total,
        SUM(status = 'accepté') AS accepted,
        SUM(status = 'en négociation') AS negotiating,
        SUM(status = 'en attente') AS pending
       FROM voeux`, {
                type: db.QueryTypes.SELECT
            }
        );

        console.log(teachersWithModules[0]);

        // 5. Render the view with the collected data
        res.render('chef', {
            teachers: teachersWithModules,
            counts: counts || {
                total: 0,
                accepted: 0,
                negotiating: 0,
                pending: 0
            }
        });

    } catch (error) {
        console.error('Error in /chef route:', error);
        res.status(500).json({
            error: 'Failed to load chef dashboard',
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
});


router.put('/accept/:voeuId', async (req, res) => {
    try {
        const voeuId = Number(req.params.voeuId);

        // 1. Update voeu status
        await db.query(
            'UPDATE voeux SET status = "accepté" WHERE id = :id', {
                replacements: {
                    id: voeuId
                },
                type: db.QueryTypes.UPDATE
            }
        );

        // 2. Get teacher ID for this voeu
        const [voeu] = await db.query(
            'SELECT utilisateur_id FROM voeux WHERE id = :id', {
                replacements: {
                    id: voeuId
                },
                type: db.QueryTypes.SELECT
            }
        );

        if (!voeu) {
            return res.status(404).json({
                success: false,
                message: "Vœu non trouvé"
            });
        }

        res.json({
            success: true,
            message: "Vœu accepté et notification envoyée"
        });

    } catch (error) {
        console.error("Erreur dans /accept/:voeuId :", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
});

router.put('/set-negotiation/:id', async (req, res) => {
  try {
    await db.query(
      'UPDATE voeux SET status = "en négociation" WHERE id = :id',
      {
        replacements: { id: req.params.id },
        type: db.QueryTypes.UPDATE
      }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


router.get('/dernier', authMiddleware, voeuController.recupererDerniersVoeux);

module.exports = router;