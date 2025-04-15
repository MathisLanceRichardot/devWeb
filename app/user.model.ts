export interface User {
  id?: string;
  mail: string;
  password: string;
  date_de_naissance: string;
  name: string;
  sexe: string;
  categorie: string;
  nom: string;
  prenom: string;
  photoURL?: string;
  token?: string;
  tokenUsed?: boolean;
  level?: number;
}