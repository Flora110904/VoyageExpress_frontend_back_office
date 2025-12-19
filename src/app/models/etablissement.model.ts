import { TypeEtablissement } from './enums.model';

export interface EtablissementRequest {
  nom: string;
  adresse: string;
  type: TypeEtablissement;
  description?: string;
  proprietaireId: string; // UUID as string
}

export interface EtablissementResponse {
  id: number;
  trackingId: string;
  nom?: string;
  adresse: string;
  description?: string;
  type: TypeEtablissement;
  proprietaireId?: string;
}
