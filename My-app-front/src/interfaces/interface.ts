import { count } from 'rxjs';
export interface Iuser {
  nom: string,
  prenom: string | null,
  numTel: string,
  mdp: string,
}

export interface Ietudiant {
  _id:string,
  matricule: string,
  image:string,
  nom: string,
  prenom: string | null,
  dateNaiss: Date ,
  mention: string,
  niveau: string,
  situationMatrimonial: string,
  sexe: string,
  adress: string,
  numTel: string,
  cycle : string,
  cin: number,
  ce:number,
  att:number,
  nomPere: string | null,
  prenomPere: string | null,
  nomMere: string | null,
  prenomMere: string | null,
  bacc: {
    enseignement: string,
    serie: string,
    numIscri: number,
    centre: string,
    annee: string,
  }
  frais:{
    banque:string,
    montant1: number
    montant2: number | null
    ref: string,
    datePayement:string
  }
}

export interface Ichart{
  counts : {
    license : number,
    master : number
  },
  total : number,
}
export interface IetuByNiveau{
  count:{
    M2:number,
    M1:number,
    L3:number,
    L2:number,
    L1:number,
  }
}
export interface Iuser{
  nom:string,
  prenom:string | null,
  numTel : string,
  password:string,
  image : File
}

export interface Itoken{
  message:string,
  token:string
}
