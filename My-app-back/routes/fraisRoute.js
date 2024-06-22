const express = require("express");
const router = express.Router();
const fraisController = require("../controller/fraisController");

router.get("/etudiant/frais/nonPaye", fraisController.getEtuNonPaye);

router.get("/etudiant/frais/tranche", fraisController.getEtuTranche);

router.get("/etudiant/frais/paye", fraisController.getEtuPaye);

router.get("/nbreTranche", fraisController.countEtuTranche);

router.get("/nbreNonPaye" ,fraisController.countEtuFraisNonPaye)

router.get("/nbrePaye" ,fraisController.countEtuFraisPaye)

module.exports = router;
