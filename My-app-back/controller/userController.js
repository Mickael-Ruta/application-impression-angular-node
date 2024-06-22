const { User } = require("../models/schema");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const tel = req.body.numTel;
    const pswd = req.body.password;

    const existEtu = await User.findOne({
      $and: [{ numTel: tel }, { password: pswd }],
    });

    if (existEtu) {
      const token = jwt.sign({ _id: existEtu._id }, "mazto_miconnecte_eh", {
        expiresIn: "1d",
      });
      res.status(200).json({ message: "Succès", token: token });
    } else {
      res.status(404).json({ erreur: "Aucun élément trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la recherche de l'utilisateur :", error);
    res
      .status(500)
      .json({ erreur: "Erreur de serveur", details: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { numTel, nom, prenom, password } = req.body;

    if (numTel && nom && password) {
      const user = new User({
        nom: nom,
        prenom: prenom,
        numTel: numTel,
        password: password,
        image:req.body.image
      });
      user.save();
      res.status(200).json({ succes: "utilisateur bien creer" });
    } else {
      res.json({ erreur: "tous les champs sont requis" });
    }
  } catch (error) {
    res.status(500).json({ erreur: "erreur de serveur" });
  }
};

exports.getUser = async (req, res) => {

  const token = req.params.token;
  const decodedToken = jwt.verify(token, "mazto_miconnecte_eh");
  try {
    if (decodedToken && decodedToken._id) {
      console.log(decodedToken);
      const userId = decodedToken._id;
      const user = await User.findOne({ _id: userId });

      if (user) {
        res.status(200).json({ user: user });
      } else {
        console.error("Utilisateur non trouvé pour l'ID:", userId);
        res.status(404).send("Utilisateur non trouvé");
      }
    } else {
      console.error("Jeton invalide ou expiré:", token);
      res.status(401).send("Jeton invalide ou expiré");
    }
  } catch (err) {
    console.error("Erreur lors de la récupération de l'utilisateur:", err);
    res.status(500).send("Erreur lors de la récupération de l'utilisateur");
  }
};
