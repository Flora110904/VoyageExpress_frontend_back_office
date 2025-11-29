# 📡 API Endpoints Reference

Base URL: `http://localhost:8080/api/v1`

## 🔐 Authentification

| Méthode | Endpoint | Description | Body | Response |
|---------|----------|-------------|------|----------|
| POST | `/auth/login` | Connexion utilisateur | `LoginRequest` | `LoginResponse` |
| POST | `/auth/logout` | Déconnexion | - | `string` |

## 👥 Utilisateurs

| Méthode | Endpoint | Description | Body | Response |
|---------|----------|-------------|------|----------|
| POST | `/users/inscription` | Créer un utilisateur | `UserRequest` | `UserResponse` |
| GET | `/users/all` | Liste tous les utilisateurs | - | `UserResponse[]` |
| GET | `/users/{trackingId}` | Détails d'un utilisateur | - | `UserResponse` |
| GET | `/users/role/{role}` | Utilisateurs par rôle | - | `UserResponse[]` |
| GET | `/users/non-actifs` | Utilisateurs non actifs | - | `UserResponse[]` |
| PUT | `/users/update/{trackingId}` | Mettre à jour un utilisateur | `UserRequest` | `UserResponse` |
| DELETE | `/users/delete/{trackingId}` | Supprimer un utilisateur | - | `void` |
| POST | `/users/activer/{trackingId}` | Activer un utilisateur | - | `string` |
| POST | `/users/desactiver/{trackingId}` | Désactiver un utilisateur | - | `string` |
| POST | `/users/modifier-mot-de-passe` | Modifier le mot de passe | `PasswordUpdateRequest` | `string` |
| POST | `/users/nouveau-mot-de-passe` | Nouveau mot de passe | `PasswordUpdateRequest` | `string` |

## 🚌 Compagnies

| Méthode | Endpoint | Description | Body | Response |
|---------|----------|-------------|------|----------|
| POST | `/compagnies/create` | Créer une compagnie | `CompagnieRequest` | `CompagnieResponse` |
| GET | `/compagnies/all` | Liste toutes les compagnies | - | `CompagnieResponse[]` |
| GET | `/compagnies/{trackingId}` | Détails d'une compagnie | - | `CompagnieResponse` |
| PUT | `/compagnies/update/{trackingId}` | Mettre à jour une compagnie | `CompagnieRequest` | `CompagnieResponse` |
| DELETE | `/compagnies/delete/{trackingId}` | Supprimer une compagnie | - | `void` |
| PUT | `/compagnies/activer/{trackingId}` | Activer une compagnie | - | `string` |

## 🏨 Établissements

| Méthode | Endpoint | Description | Body | Response |
|---------|----------|-------------|------|----------|
| POST | `/etablissements/create` | Créer un établissement | `EtablissementRequest` | `EtablissementResponse` |
| GET | `/etablissements/all` | Liste tous les établissements | - | `EtablissementResponse[]` |
| GET | `/etablissements/{trackingId}` | Détails d'un établissement | - | `EtablissementResponse` |
| PUT | `/etablissements/update/{trackingId}` | Mettre à jour un établissement | `EtablissementRequest` | `EtablissementResponse` |
| DELETE | `/etablissements/delete/{trackingId}` | Supprimer un établissement | - | `void` |
| PUT | `/etablissements/activer/{trackingId}` | Activer un établissement | - | `string` |
| PUT | `/etablissements/desactiver/{trackingId}` | Désactiver un établissement | - | `string` |
| GET | `/etablissements/search?ville={ville}` | Rechercher par ville | - | `EtablissementResponse[]` |

## 🗺️ Itinéraires

| Méthode | Endpoint | Description | Body | Response |
|---------|----------|-------------|------|----------|
| POST | `/itineraires/create` | Créer un itinéraire | `ItineraireRequest` | `ItineraireResponse` |
| GET | `/itineraires/all` | Liste tous les itinéraires | - | `ItineraireResponse[]` |
| GET | `/itineraires/{trackingId}` | Détails d'un itinéraire | - | `ItineraireResponse` |
| PUT | `/itineraires/update/{trackingId}` | Mettre à jour un itinéraire | `ItineraireRequest` | `ItineraireResponse` |
| DELETE | `/itineraires/delete/{trackingId}` | Supprimer un itinéraire | - | `void` |
| GET | `/itineraires/search?depart={depart}&arrivee={arrivee}` | Rechercher des itinéraires | - | `ItineraireResponse[]` |

## 🏠 Locaux

| Méthode | Endpoint | Description | Body | Response |
|---------|----------|-------------|------|----------|
| POST | `/locaux/create?etablissementTrackingId={id}` | Créer un local | `LocalRequest` | `LocalResponse` |
| GET | `/locaux/all` | Liste tous les locaux | - | `LocalResponse[]` |
| GET | `/locaux/{trackingId}` | Détails d'un local | - | `LocalResponse` |
| PUT | `/locaux/update/{trackingId}` | Mettre à jour un local | `LocalRequest` | `LocalResponse` |
| DELETE | `/locaux/delete/{trackingId}` | Supprimer un local | - | `void` |
| POST | `/locaux/{trackingId}/image` | Upload une image | `FormData` | `LocalResponse` |

## 📅 Réservations

| Méthode | Endpoint | Description | Body | Response |
|---------|----------|-------------|------|----------|
| POST | `/reservations/create` | Créer une réservation | `ReservationRequest` | `ReservationResponse` |
| GET | `/reservations/all?page={page}&size={size}` | Liste les réservations (paginée) | - | `ReservationResponse[]` |
| GET | `/reservations/{trackingId}` | Détails d'une réservation | - | `ReservationResponse` |
| PUT | `/reservations/update/{trackingId}` | Mettre à jour une réservation | `ReservationRequest` | `ReservationResponse` |
| DELETE | `/reservations/delete/{trackingId}` | Supprimer une réservation | - | `void` |
| POST | `/reservations/{trackingId}/generate-ticket-hebergement` | Générer le ticket | - | `ReservationResponse` |
| GET | `/reservations/{trackingId}/download-ticket-hebergement` | Télécharger le ticket | - | `Blob` |

## 🚗 Véhicules

| Méthode | Endpoint | Description | Body | Response |
|---------|----------|-------------|------|----------|
| POST | `/vehicules` | Créer un véhicule | `VehiculeRequest` | `VehiculeResponse` |
| GET | `/vehicules` | Liste tous les véhicules | - | `VehiculeResponse[]` |
| GET | `/vehicules/{trackingId}` | Détails d'un véhicule | - | `VehiculeResponse` |
| PUT | `/vehicules/{trackingId}` | Mettre à jour un véhicule | `VehiculeRequest` | `VehiculeResponse` |
| DELETE | `/vehicules/{trackingId}` | Supprimer un véhicule | - | `void` |

## 🔗 Véhicule-Itinéraires

| Méthode | Endpoint | Description | Body | Response |
|---------|----------|-------------|------|----------|
| POST | `/vehicule-itineraires` | Créer une association | `VehiculeItineraireRequest` | `VehiculeItineraireResponse` |
| GET | `/vehicule-itineraires` | Liste toutes les associations | - | `VehiculeItineraireResponse[]` |
| GET | `/vehicule-itineraires/{trackingId}` | Détails d'une association | - | `VehiculeItineraireResponse` |
| PUT | `/vehicule-itineraires/{trackingId}` | Mettre à jour une association | `VehiculeItineraireRequest` | `VehiculeItineraireResponse` |
| DELETE | `/vehicule-itineraires/{trackingId}` | Supprimer une association | - | `void` |

## 🎫 Billets

| Méthode | Endpoint | Description | Body | Response |
|---------|----------|-------------|------|----------|
| POST | `/billets` | Créer un billet | `BilletRequest` | `BilletResponse` |
| GET | `/billets` | Liste tous les billets | - | `BilletResponse[]` |
| GET | `/billets/{trackingId}` | Détails d'un billet | - | `BilletResponse` |
| PUT | `/billets/{trackingId}` | Mettre à jour un billet | `BilletRequest` | `BilletResponse` |
| DELETE | `/billets/{trackingId}` | Supprimer un billet | - | `void` |
| POST | `/billets/{trackingId}/fichier` | Upload un fichier | `FormData` | `BilletResponse` |
| POST | `/billets/{trackingId}/generate-pdf` | Générer le PDF | - | `BilletResponse` |
| GET | `/billets/{trackingId}/download-pdf` | Télécharger le PDF | - | `Blob` |

---

## 📝 Types de données

### Enums

```typescript
Role: 'ADMIN' | 'CLIENT' | 'COMPAGNIE_BUS' | 'COMPAGNIE_AERIEN' | 'ETABLISSEMENT'
TypeCompagnie: 'AEROPORT' | 'STATION'
TypeEtablissement: 'Hotel' | 'Motel' | 'Appartement'
TypeLocal: 'CHAMBRE_SIMPLE' | 'CHAMBRE_CLIMER' | 'CHAMBRE_VENTILLER' | 'SALLE_DE_CONFERENCE' | 'SALLE_DES_FETES' | 'SUITE'
TypeVehicule: 'AVION' | 'BUS'
```

### Formats

- **Dates**: `YYYY-MM-DD` (ex: 2025-12-01)
- **Heures**: `HH:mm` (ex: 14:30)
- **DateTime**: ISO 8601 (ex: 2025-12-01T14:30:00)
- **UUID**: Format standard (ex: 550e8400-e29b-41d4-a716-446655440000)
- **Téléphone**: Format libre (ex: +221 77 123 45 67)

### Headers requis

```
Authorization: Bearer <token>
Content-Type: application/json
```

*Le token est automatiquement ajouté par l'interceptor HTTP*

---

## 🎯 Utilisation dans Angular

### Exemple: Créer un billet

```typescript
import { BilletServiceApi } from './services/billet.service';

constructor(private billetService: BilletServiceApi) {}

createBillet() {
  const billet: BilletRequest = {
    nomPassager: 'Diop',
    prenomPassager: 'Amadou',
    numeroIdentite: '1234567890123',
    montant: 25000,
    numeroSiege: 'A12',
    classeVoyage: 'ECONOMIQUE',
    statut: 'ACTIF',
    itineraireTrackingId: 'uuid-itineraire'
  };

  this.billetService.create(billet).subscribe({
    next: (response) => {
      console.log('Billet créé:', response);
      // response.numeroBillet
      // response.qrCode
      // response.pdfUrl
    },
    error: (err) => console.error('Erreur:', err)
  });
}
```

### Exemple: Rechercher des itinéraires

```typescript
import { ItineraireServiceApi } from './services/itineraire.service';

constructor(private itineraireService: ItineraireServiceApi) {}

searchItineraires() {
  this.itineraireService.search('Dakar', 'Saint-Louis').subscribe({
    next: (itineraires) => {
      console.log('Itinéraires trouvés:', itineraires);
    }
  });
}
```

### Exemple: Télécharger un PDF

```typescript
downloadPdf(trackingId: string) {
  this.billetService.downloadPdf(trackingId).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `billet-${trackingId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  });
}
```

---

**Total: 50+ endpoints disponibles**

Pour plus d'informations, consultez:
- `INTEGRATION_GUIDE.md` - Guide complet avec exemples
- `angular.md` - Spécifications complètes des modèles et services
