export interface ReservationRequest {
  statut: string;
  dateReservation: string; // ISO LocalDateTime
  userTrackingId: string; // UUID as string
  itineraireTrackingId?: string;
  localTrackingId?: string;
  classeVoyage?: string;
  bagageSupplementaireKg?: number;
  notes?: string;
}

export interface SeatSelection {
  seatTrackingId: string;
  passagerNom: string;
  passagerPrenom: string;
  numeroDocument: string;
}

export interface ReservationResponse {
  trackingId: string;
  numeroReservation: string;
  statut: string;
  dateReservation: string; // LocalDateTime
  montantTotal: number;
  bagageInclusKg: number;
  bagageSupplementaireKg?: number;
  bagageSupplementaireMontant?: number;
  classeVoyage: string;
  itineraireTrackingId?: string;
  localTrackingId?: string;
  ticketHebergementUrl?: string;
  utilisateurTrackingId: string;
  seatSelections?: SeatSelection[];
  paymentUrl?: string;
  compagnieNom?: string;
}

export interface ReservationDetailResponse extends ReservationResponse {
  userName?: string;
  userEmail?: string;
  userTelephone?: string;
  itineraireDetails?: {
    villeDepart: string;
    villeArrivee: string;
    pointDepart: string;
    pointArrivee: string;
    dateDepart: string;
    heureDepart: string;
    heureArrivee: string;
    prix: number;
    prixEconomique?: number;
    prixEconomiquePremium?: number;
    prixAffaires?: number;
    prixPremiere?: number;
  };
  localDetails?: {
    numero: string;
    description: string;
    type: string;
    capacite: number;
    nombreLits?: number;
    equipements?: string[];
  };
}
