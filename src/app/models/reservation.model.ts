export interface ReservationRequest {
  statut: string;
  dateReservation: string; // ISO LocalDateTime
  userTrackingId: string; // UUID as string
}

export interface ReservationResponse {
  trackingId: string;
  statut: string;
  dateReservation: string; // LocalDateTime
  ticketHebergementUrl: string;
  utilisateurTrackingId: string;
  localTrackingId: string;
}
