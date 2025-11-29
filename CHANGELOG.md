# Changelog - Mise à jour des Services et Modèles

## Date: 2025-11-05

### ✨ Nouvelles fonctionnalités

#### Modèles TypeScript complets
- ✅ Tous les modèles alignés avec le backend selon `angular.md`
- ✅ Typage fort avec enums (Role, TypeCompagnie, TypeEtablissement, TypeLocal, TypeVehicule)
- ✅ Interfaces Request/Response pour tous les endpoints

#### Services API complets
- ✅ 10 services API disponibles avec toutes les méthodes CRUD
- ✅ Support complet des endpoints backend
- ✅ Gestion des fichiers (upload/download PDF, images, tickets)

### 🔄 Modifications apportées

#### Modèles mis à jour

**user.model.ts**
- `role` maintenant typé avec l'enum `Role` (au lieu de `string`)
- Suppression des champs `actif`, `createdAt`, `updatedAt` de `UserResponse` pour correspondre au backend

**compagnie.model.ts**
- `type` maintenant typé avec l'enum `TypeCompagnie` (au lieu de `string`)

**etablissement.model.ts**
- Suppression des champs `actif`, `createdAt`, `updatedAt` de `EtablissementResponse`

**itineraire.model.ts**
- Suppression des champs `createdAt`, `updatedAt` de `ItineraireResponse`

**reservation.model.ts**
- Correction: `userTrakingId` → `userTrackingId` (orthographe)
- Suppression des champs `createdAt`, `updatedAt` de `ReservationResponse`
- `ticketHebergementUrl` n'est plus optionnel

**billet.model.ts** (Refonte complète)
- Ajout de tous les champs manquants:
  - `numeroSiege`, `classeVoyage`
  - `nomPassager`, `prenomPassager`, `numeroIdentite`
  - `itineraireTrackingId`, `reservationTrackingId`
- Ajout dans `BilletResponse`:
  - `numeroBillet`, `qrCode`
  - `dateEmission`, `dateExpiration`
  - `utilisateurTrackingId`

#### Services mis à jour

**user.service.ts**
- `findByRole()` accepte maintenant `Role` enum au lieu de `string`

**local.service.ts**
- `create()` utilise maintenant le paramètre `etablissementTrackingId` (au lieu de `trackingId`)
- Correspondance avec l'API backend

**vehicule-itineraire.service.ts**
- Correction de l'URL: `/vehicule-itineraires` (au lieu de `/vehicules-itineraires`)

**environment.ts**
- Correction de l'URL API: `http://localhost:8080/api/v1` (suppression du `/api` en double)

### 📁 Fichiers créés

1. **INTEGRATION_GUIDE.md**
   - Guide complet d'intégration avec l'API
   - Exemples de code pour chaque service
   - Checklist de vérification
   - Résolution des problèmes courants

2. **CHANGELOG.md** (ce fichier)
   - Historique des modifications

### 🎯 Endpoints API disponibles

#### Authentification
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`

#### Utilisateurs
- `POST /api/v1/users/inscription`
- `GET /api/v1/users/all`
- `GET /api/v1/users/{trackingId}`
- `GET /api/v1/users/role/{role}`
- `GET /api/v1/users/non-actifs`
- `PUT /api/v1/users/update/{trackingId}`
- `DELETE /api/v1/users/delete/{trackingId}`
- `POST /api/v1/users/activer/{trackingId}`
- `POST /api/v1/users/desactiver/{trackingId}`
- `POST /api/v1/users/modifier-mot-de-passe`
- `POST /api/v1/users/nouveau-mot-de-passe`

#### Compagnies
- `POST /api/v1/compagnies/create`
- `GET /api/v1/compagnies/all`
- `GET /api/v1/compagnies/{trackingId}`
- `PUT /api/v1/compagnies/update/{trackingId}`
- `DELETE /api/v1/compagnies/delete/{trackingId}`
- `PUT /api/v1/compagnies/activer/{trackingId}`

#### Établissements
- `POST /api/v1/etablissements/create`
- `GET /api/v1/etablissements/all`
- `GET /api/v1/etablissements/{trackingId}`
- `PUT /api/v1/etablissements/update/{trackingId}`
- `DELETE /api/v1/etablissements/delete/{trackingId}`
- `PUT /api/v1/etablissements/activer/{trackingId}`
- `PUT /api/v1/etablissements/desactiver/{trackingId}`
- `GET /api/v1/etablissements/search?ville={ville}`

#### Itinéraires
- `POST /api/v1/itineraires/create`
- `GET /api/v1/itineraires/all`
- `GET /api/v1/itineraires/{trackingId}`
- `PUT /api/v1/itineraires/update/{trackingId}`
- `DELETE /api/v1/itineraires/delete/{trackingId}`
- `GET /api/v1/itineraires/search?depart={depart}&arrivee={arrivee}`

#### Locaux
- `POST /api/v1/locaux/create?etablissementTrackingId={id}`
- `GET /api/v1/locaux/all`
- `GET /api/v1/locaux/{trackingId}`
- `PUT /api/v1/locaux/update/{trackingId}`
- `DELETE /api/v1/locaux/delete/{trackingId}`
- `POST /api/v1/locaux/{trackingId}/image` (FormData)

#### Réservations
- `POST /api/v1/reservations/create`
- `GET /api/v1/reservations/all?page={page}&size={size}`
- `GET /api/v1/reservations/{trackingId}`
- `PUT /api/v1/reservations/update/{trackingId}`
- `DELETE /api/v1/reservations/delete/{trackingId}`
- `POST /api/v1/reservations/{trackingId}/generate-ticket-hebergement`
- `GET /api/v1/reservations/{trackingId}/download-ticket-hebergement` (Blob)

#### Véhicules
- `POST /api/v1/vehicules`
- `GET /api/v1/vehicules`
- `GET /api/v1/vehicules/{trackingId}`
- `PUT /api/v1/vehicules/{trackingId}`
- `DELETE /api/v1/vehicules/{trackingId}`

#### Véhicule-Itinéraires
- `POST /api/v1/vehicule-itineraires`
- `GET /api/v1/vehicule-itineraires`
- `GET /api/v1/vehicule-itineraires/{trackingId}`
- `PUT /api/v1/vehicule-itineraires/{trackingId}`
- `DELETE /api/v1/vehicule-itineraires/{trackingId}`

#### Billets
- `POST /api/v1/billets`
- `GET /api/v1/billets`
- `GET /api/v1/billets/{trackingId}`
- `PUT /api/v1/billets/{trackingId}`
- `DELETE /api/v1/billets/{trackingId}`
- `POST /api/v1/billets/{trackingId}/fichier` (FormData)
- `POST /api/v1/billets/{trackingId}/generate-pdf`
- `GET /api/v1/billets/{trackingId}/download-pdf` (Blob)

### 🔒 Sécurité

- ✅ Intercepteur HTTP configuré
- ✅ Token JWT automatiquement ajouté aux requêtes
- ✅ Gestion automatique des erreurs 401
- ✅ Déconnexion automatique si token invalide
- ✅ Stockage sécurisé du token dans localStorage

### 📊 Structure du projet

```
src/app/
├── models/
│   ├── index.ts                    # Export centralisé
│   ├── enums.model.ts              # Tous les enums
│   ├── login.model.ts              # Auth models
│   ├── user.model.ts               # User models
│   ├── compagnie.model.ts          # Compagnie models
│   ├── etablissement.model.ts      # Etablissement models
│   ├── itineraire.model.ts         # Itineraire models
│   ├── local.model.ts              # Local models
│   ├── reservation.model.ts        # Reservation models
│   ├── vehicule.model.ts           # Vehicule models
│   ├── vehicule-itineraire.model.ts# VehiculeItineraire models
│   └── billet.model.ts             # Billet models
│
├── services/
│   ├── auth.service.ts             # Authentification
│   ├── user.service.ts             # Gestion utilisateurs
│   ├── compagnie.service.ts        # Gestion compagnies
│   ├── etablissement.service.ts    # Gestion établissements
│   ├── itineraire.service.ts       # Gestion itinéraires
│   ├── local.service.ts            # Gestion locaux
│   ├── reservation.service.ts      # Gestion réservations
│   ├── vehicule.service.ts         # Gestion véhicules
│   ├── vehicule-itineraire.service.ts # Gestion associations
│   └── billet.service.ts           # Gestion billets
│
├── interceptors/
│   └── auth.interceptor.ts         # Intercepteur JWT
│
└── environments/
    ├── environment.ts              # Config développement
    └── environment.prod.ts         # Config production
```

### 🚀 Prochaines étapes

1. **Tester l'intégration avec le backend**
   ```bash
   # Démarrer le backend
   # Puis démarrer le frontend
   ng serve
   ```

2. **Vérifier les endpoints**
   - Tester le login
   - Vérifier que les tokens sont bien envoyés
   - Tester la création/lecture/mise à jour/suppression

3. **Compléter l'interface utilisateur**
   - Utiliser les services dans les composants
   - Ajouter la gestion des erreurs
   - Ajouter les indicateurs de chargement

4. **Optimisations**
   - Ajouter un système de cache si nécessaire
   - Implémenter la pagination
   - Ajouter des notifications utilisateur

### ⚠️ Points d'attention

1. **Format des dates**
   - Les dates doivent être au format `YYYY-MM-DD` pour les LocalDate
   - Les dates/heures au format ISO 8601 pour les LocalDateTime

2. **UUIDs**
   - Tous les `trackingId` sont des UUID sous forme de string
   - Vérifier que le backend génère bien des UUID valides

3. **CORS**
   - S'assurer que le backend accepte les requêtes depuis `http://localhost:4200`

4. **Validation**
   - Ajouter la validation côté frontend pour une meilleure UX
   - Ne pas se fier uniquement à la validation backend

### 📝 Notes

- Tous les services utilisent `Observable` de RxJS
- Les erreurs HTTP sont gérées automatiquement par l'intercepteur
- Le token est stocké dans `localStorage` avec la clé `auth_token`
- L'utilisateur connecté est stocké avec la clé `auth_user`

---

**Développé selon les spécifications du fichier `angular.md`**
