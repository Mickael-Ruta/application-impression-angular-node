const e = require("express");
const { Etudiant, Frais } = require("../models/schema");

exports.getEtuNonPaye = async (req, res) => {
  try {
    const etudiantsNonPaye = await Etudiant.find({
      frais: { $exists: false },
    }).populate("bacc");
    res.send(etudiantsNonPaye);
  } catch (error) {
    console.log("Erreur", error);
    res
      .status(500)
      .json({ error: "Erreur interne du serveur", details: error.message });
  }
};

exports.getEtuTranche = async (req, res) => {
  try {
    const etudiantsAvecFrais = await Etudiant.find({
      frais: { $exists: true },
    }).populate(["bacc", "frais"]);
    const etudiantsTranche = etudiantsAvecFrais.filter((etudiant) => {
      if (etudiant.cycle === "license" && etudiant.frais.montant1 < 500000 && !etudiant.frais.montant2) {
        return true;
      } else if (
        etudiant.cycle === "master" &&
        etudiant.frais.montant1 < 700000 && 
        !etudiant.frais.montant2
      ) {
        return true;
      } else {
        return false;
      }
    });
    res.send(etudiantsTranche);
  } catch (error) {
    console.log("Erreur", error);
    res
      .status(500)
      .json({ error: "Erreur interne du serveur", details: error.message });
  }
};

exports.getEtuPaye = async (req, res) => {
  try {
    const etuFraisExist = await Etudiant.find({
      frais: { $exists: true },
    }).populate(["frais", "bacc"]);

    if (etuFraisExist) {
      const etuPaye = etuFraisExist.filter((etudiant) => {
        if (etudiant.cycle === "license") {
          return (
            etudiant.frais.montant1 === 50000 ||
            etudiant.frais.montant1 + (etudiant.frais.montant2 || 0) === 500000
          );
        } else {
          return (
            etudiant.frais.montant1 === 70000 ||
            etudiant.frais.montant1 + (etudiant.frais.montant2 || 0) === 700000
          );
        }
      });

      res.send(etuPaye);
    } else {
      res.json({ etudiant: "Aucun étudiant" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: "Erreur interne du serveur" });
  }
};

exports.countEtuTranche = async (req, res) => {
  try {
    const etudiantsAvecFrais = await Etudiant.find({
      frais: { $exists: true },
    }).populate(["bacc", "frais"]);

    const counts = etudiantsAvecFrais.reduce(
      (acc, etudiant) => {
        if (etudiant.cycle === "license" && etudiant.frais.montant1 < 500000 && !etudiant.frais.montant2) {
          acc.license++;
        } else if (
          etudiant.cycle === "master" &&
          etudiant.frais.montant1 < 700000 &&
          !etudiant.frais.montant2
        ) {
          acc.master++;
        }
        return acc;
      },
      { license: 0, master: 0 }
    );
    const total = counts.license + counts.master;
    res.json({ counts, total });
  } catch (error) {
    console.error("Erreur", error);
    res
      .status(500)
      .json({ error: "Erreur interne du serveur", details: error.message });
  }
};

exports.countEtuFraisNonPaye = async (req, res) => {
  try {
    const EtuNonPaye = await Etudiant.find({
      frais: { $exists: false },
    }).populate(["frais", "bacc"]);

    const counts = EtuNonPaye.reduce(
      (acc, etu) => {
        if (etu.cycle === "license") {
          acc.license++;
        } else {
          acc.master++;
        }
        return acc;
      },
      { license: 0, master: 0 }
    );
    const total = counts.license + counts.master;

    res.json({ counts, total })
  } catch (error) {
    res.status(500).json({ error: "Erreur interne" });
  }
};

exports.countEtuFraisPaye = async (req, res) => {
  try {
    const etuAvecFrais = await Etudiant.find({
      frais: { $exists: true },
    }).populate("frais");

    if (etuAvecFrais) {
      const count = etuAvecFrais.reduce((acc,etu)=>{
        if(etu.cycle==='license'){
          if(etu.frais.montant1===500000 || (etu.frais.montant1 + (etu.frais.montant2 || 0)) === 500000){
            acc.license++
          }
        }else{
          if(etu.frais.montant1===700000 || (etu.frais.montant1 + (etu.frais.montant2 || 0)) === 700000){
            acc.master++
          }
        }
        return acc
      },{license:0,master:0})

      const total = count.license + count.master

      res.json({ count, total })
    } else {
      res.json({ etudiant: "Aucune Etudiant correspondant" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur interne" });
  }
}
