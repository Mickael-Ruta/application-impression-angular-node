const mongoose = require("mongoose");

const etudiantSchema = new mongoose.Schema({
  matricule: { type: String, required: true,unique:true},
  nom: { type: String, required: true },
  prenom: { type: String, required: false },
  dateNaiss: { type: Date, required: true },
  mention: { type: String, required: true },
  niveau: { type: String, required: true },
  situationMatrimonial: { type: String, required: true },
  sexe: { type: String, required: true },
  adress: { type: String, required: true },
  numTel: { type: String, required: true,unique : true },
  cycle: { type: String, required: true },
  cin: { type: Number, required: false ,unique:true },
  nomPere: { type: String, required: false },
  prenomPere: { type: String, required: false },
  nomMere: { type: String, required: false },
  prenomMere: { type: String, required: false },
  image:{type:String,required:false},
  ce:{type:Number,required:false,default:0},
  att:{type:Number,required:false,default:0},
  bacc: { type: mongoose.Types.ObjectId, ref: "bacc" },
  frais: { type: mongoose.Types.ObjectId, ref: "frais" },
})

const baccSchema = new mongoose.Schema({
  enseignement: { type: String, required: true },
  serie: { type: String, required: true },
  numIscri: { type: Number, required: true ,unique:true},
  centre: { type: String, required: true },
  annee: { type: String, required: true },
});

const fraisSchema = new mongoose.Schema({
  banque: { type: String, required: true },
  montant1: { type: Number, required: true },
  montant2: { type: Number, required: false },
  ref: { type: String, required: true },
  datePayement: { type: String, required: true },
})

const userSchema = new mongoose.Schema({
  nom:{type:String,required:true},
  prenom:{type : String ,required:false},
  numTel:{type:String,required:true},
  password:{type : String,required:true},
  image : {type : String,required:false}
})

const User = mongoose.model('user',userSchema)
const Etudiant = mongoose.model("etudiant", etudiantSchema);
const Bacc = mongoose.model("bacc", baccSchema);
const Frais = mongoose.model("frais", fraisSchema);

module.exports = { Etudiant, Bacc, Frais ,User};
