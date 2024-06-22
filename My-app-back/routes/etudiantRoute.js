const express = require("express");
const router = express.Router();
const etuController = require("../controller/etudiantController");

router.get("/etudiant", etuController.getAllEtudiant);

router.get("/etudiant/:matricule", etuController.getEtudiantById);

router.post("/etudiant/ajout", etuController.addEtu);

router.put("/etudiant/:matricule", etuController.updateEtudiantById);

router.delete("/etudiant/:matricule", etuController.deleteEtu);

router.put("/etudiant/payment/:matricule",etuController.etuPayment);

router.get("/nombreEtudiantByNiveau",etuController.coutEtuByNiveau);

router.get("/nombreCE",etuController.getNbreCe)

router.get("/nombreAtt",etuController.getNbreAtt)

router.put("/updateCe/:matricule",etuController.updateCe)

router.put("/updateAtt/:matricule",etuController.updateAtt)

module.exports = router;
