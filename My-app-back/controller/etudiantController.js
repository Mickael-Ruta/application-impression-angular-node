const { Etudiant, Frais, Bacc} = require("../models/schema");
const moment = require("moment");

exports.getAllEtudiant = async (req, res) => {
  try {
    const etudiants = await Etudiant.find({}).populate(["bacc", "frais"]);
    const etudiantsFormatted = etudiants.map((etudiant) => {
      return {
        ...etudiant.toObject(),
        dateNaiss: moment(etudiant.dateNaiss).format("YYYY-MM-DD"),
      };
    });
    res.send(etudiantsFormatted);
  } catch (error) {
    console.error(error);   
    res
      .status(500)
      .json({ error: "Erreur interne du serveur", details: error.message });
  }
};

exports.getEtudiantById = async (req, res) => {
  const matr = req.params.matricule;
  try {
    const etudiant = await Etudiant.find({ matricule: matr }).populate([
      "bacc",
      "frais",
    ]);

    if (!etudiant) {
      res.send(json({ message: "le matricule n'existe pas" }));
    } else {
      const etu = etudiant.map((list) => {
        return {
          ...list.toObject(),
          dateNaiss: moment(list.dateNaiss).format("YYYY-MM-DD"),
        };
      });
      res.send(etudiant);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.updateEtudiantById = async (req, res) => {
  const id = req.params.matricule;
  try {
    const existEtudiant = await Etudiant.findOne({ matricule: id }).populate(
      "bacc"
    );
    if (!existEtudiant) {
      res.send(`Aucun etudiant a le matricule ${id}`);
    } else {
      existEtudiant.set(req.body);
      await existEtudiant.save();

      if (existEtudiant.bacc) {
        await Bacc.findOneAndUpdate(
          { _id: existEtudiant.bacc },
          {
            enseignement: req.body.enseignementBacc,
            serie: req.body.serieBacc,
            numIscri: req.body.numIscriBacc,
            centre: req.body.centreBacc,
            annee: req.body.anneeBacc,
          }
        );
        res.status(200).json({ success: "Modifie avec succès" });
      } else {
        const bacc = new Bacc({
          enseignement: req.body.enseignementBacc,
          serie: req.body.serieBacc,
          numIscri: req.body.numIscriBacc,
          centre: req.body.centreBacc,
          annee: req.body.anneeBacc,
        });

        await bacc.save();
        existEtudiant.bacc = bacc._id;
        await existEtudiant.save();
        res.status(200).json({ success: "Modifie avec succès" });
      }
    }
  } catch (error) {
    res.send(error.message);
  }
};
exports.deleteEtu = async (req, res) => {
  const id = req.params.matricule;
  try {
    const etudiant = await Etudiant.findOne({ matricule: id });
    if (!etudiant) {
      res.send(`Aucun étudiant avec le matricule ${id}`);
    } else {
      await Etudiant.deleteOne({ matricule: etudiant.matricule });
      if (etudiant.bacc) {
        await Bacc.deleteOne({ _id: etudiant.bacc });
      }
      if (etudiant.frais) {
        await Frais.deleteOne({ _id: etudiant.frais });
      }
      res.send({ message: "Étudiant supprimé avec succès" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
exports.addEtu = async (req, res) => {
  try {
    const {
      matricule,
      nom,
      prenom,
      dateNaiss,
      mention,
      niveau,
      situationMatrimonial,
      sexe,
      adress,
      numTel,
      cycle,
      cin,
      nomPere,
      prenomPere,
      nomMere,
      prenomMere,
      enseignementBacc,
      serieBacc,
      numIscriBacc,
      centreBacc,
      anneeBacc,
      image
    } = req.body;

    if (
      !matricule ||
      !nom ||
      !dateNaiss ||
      !situationMatrimonial ||
      !sexe ||
      !adress ||
      !numTel ||
      !cycle ||
      !cin ||
      !enseignementBacc ||
      !serieBacc ||
      !numIscriBacc ||
      !centreBacc ||
      !anneeBacc
    ) {
      res.status(400).json({ error: "Tous les champs sont requis" });
    } else {
      const etudiant = new Etudiant({
        matricule,
        nom,
        prenom,
        dateNaiss:dateNaiss,
        mention,
        niveau,
        situationMatrimonial,
        sexe,
        adress,
        numTel,
        cycle,
        cin,
        nomPere,
        prenomPere,
        nomMere,
        prenomMere,
        image
      });
      const savedEtudiant = await etudiant.save();
      const bacc = new Bacc({
        enseignement: enseignementBacc,
        serie: serieBacc,
        numIscri: numIscriBacc,
        centre: centreBacc,
        annee: anneeBacc,
      });
      savedEtudiant.bacc = bacc._id;
      await bacc.save();
      await savedEtudiant.save();
      res.status(200).json({ success: "Ajout avec succès" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Il y a une erreur" });
  }
};

exports.etuPayment = async (req, res) => {
  const id = req.params.matricule;
  try {
    const existEtudiant = await Etudiant.findOne({ matricule: id }).populate(
      "frais"
    );
    if (!existEtudiant) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    if (existEtudiant.frais) {
      await Frais.findOneAndUpdate(
        { _id: existEtudiant.frais },
        {
          banque: req.body.banque,
          montant1: req.body.montant1,
          montant2: req.body.montant2,
          datePayement: req.body.date,
          ref: req.body.ref,
        }
      );
      res.status(200).json({ success: "Mise à jour du paiement réussie" });
    } else {
      const newFrais = await Frais.create({
        banque: req.body.banque,
        montant1: req.body.montant1,
        montant2: req.body.montant2,
        datePayement: req.body.date,
        ref: req.body.ref,
      });
      existEtudiant.frais = newFrais._id;
      await existEtudiant.save();
      res.status(200).json({ success: "Mise à jour du paiement réussie" });
    }
  } catch (error) {
    console.error("Il y a une erreur :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

exports.countEtu=async(req,res)=>{
  try {
    const nbreEtu=await Etudiant.countDocuments({})
    res.send({nombre:nbreEtu})
  } catch (error) {
      res.status(500).json({erreur : 'erreur interne'})
  }
}

exports.coutEtuByNiveau=async (req,res)=>{
  try {
    const Etu = await Etudiant.find({niveau:{$exists : true}})
    if(Etu){
      let count = Etu.reduce((acc,etudiant)=>{
          if(etudiant.niveau==="M1"){
            acc.M1++
          }else if(etudiant.niveau==="M2"){
            acc.M2++
          }
          else if(etudiant.niveau==="L3"){
            acc.L3++
          }
          else if(etudiant.niveau==="L2"){
            acc.L2++
          }
          else if(etudiant.niveau==="L1"){
            acc.L1++
          }
          return acc
      },{M2:0,M1:0,L3:0,L2:0,L1:0})

      res.json({count})
    }
  } catch (error) {
      console.log(error)
  }
}

exports.getNbreCe=async (req,res)=>{
  try {
    const nombre = await Etudiant.countDocuments({ce:1})
    res.json({nombre:nombre})
  } catch (error) {
    console.error(error)
  }
  
}

exports.getNbreAtt=async (req,res)=>{
  try {
    const nombre = await Etudiant.countDocuments({att:1})
    res.json({nombre:nombre})
  } catch (error) {
    console.error(error)
  }
}

exports.updateCe=async(req,res)=>{
  const id = req.params.matricule
  try {
    const etu=await Etudiant.findOne({matricule:id})
    if(etu){
      etu.set({ce:req.body.ce})
      await etu.save()

      res.json({succes:'Operation effectué avec succes'})
    }else{
      res.send({message:"Aucun etudiant trouvé"})
    }
  } catch (error) {
    console.error(error)
  }
}

exports.updateAtt=async(req,res)=>{
  const id = req.params.matricule
  try {
    const etu=await Etudiant.findOne({matricule:id})
    if(etu){
      etu.set({att:req.body.att})
      await etu.save()

      res.status(200).json({succes:'Operation effectué avec succes'})
    }else{
      res.send({message:"Aucun etudiant trouvé"})
    }
  } catch (error) {
    console.error(error)
  }
}