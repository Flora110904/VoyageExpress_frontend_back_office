# Guide d'Intégration VoyageExpress Frontend Backoffice

## ✅ Mise à jour effectuée

Tous les modèles et services ont été mis à jour selon les spécifications du fichier `angular.md`.

### Modèles mis à jour

1. **user.model.ts** - Types corrigés (Role enum)
2. **compagnie.model.ts** - TypeCompagnie enum appliqué
3. **etablissement.model.ts** - Champs supplémentaires retirés
4. **itineraire.model.ts** - Structure simplifiée
5. **reservation.model.ts** - Nommage corrigé (userTrackingId)
6. **billet.model.ts** - Tous les champs ajoutés (numeroSiege, classeVoyage, nomPassager, prenomPassager, numeroIdentite, qrCode, etc.)

### Services mis à jour

1. **user.service.ts** - findByRole accepte maintenant Role enum
2. **local.service.ts** - create utilise etablissementTrackingId
3. **vehicule-itineraire.service.ts** - URL corrigée

### Fonctionnalités disponibles

✅ **Authentification complète**
- Login/Logout
- Gestion des tokens JWT (avec interceptor HTTP)
- Protection automatique des routes
- Gestion des sessions

✅ **Services API complets**
- AuthService
- UserServiceApi
- CompagnieServiceApi
- EtablissementServiceApi
- ItineraireServiceApi
- LocalServiceApi
- ReservationServiceApi
- VehiculeServiceApi
- VehiculeItineraireServiceApi
- BilletServiceApi

✅ **Intercepteur HTTP**
- Ajout automatique du token JWT dans les headers
- Gestion des erreurs 401 (déconnexion automatique)
- Redirection vers login si non authentifié

## 🔧 Configuration de l'environnement

### Vérifier l'URL de l'API

Ouvrez `src/environments/environment.ts` et vérifiez que l'URL correspond à votre backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'  // Vérifiez cette URL!
};
```

**Important:** 
- Si votre API est sur `http://localhost:8080/api/v1/auth`, utilisez `http://localhost:8080/api/v1`
- Si votre API est sur `http://localhost:8080/auth`, utilisez `http://localhost:8080`

Les services ajouteront automatiquement les endpoints corrects (ex: `/auth`, `/users`, `/billets`, etc.)

### Structure des endpoints

Avec `apiUrl: 'http://localhost:8080/api/v1'`, les endpoints seront:

```
POST   http://localhost:8080/api/v1/auth/login
POST   http://localhost:8080/api/v1/auth/logout
GET    http://localhost:8080/api/v1/users/all
POST   http://localhost:8080/api/v1/users/inscription
GET    http://localhost:8080/api/v1/compagnies/all
POST   http://localhost:8080/api/v1/compagnies/create
GET    http://localhost:8080/api/v1/billets
POST   http://localhost:8080/api/v1/billets
... etc
```

## 🚀 Utilisation des services

### Exemple 1: Authentification

```typescript
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LoginRequest } from './models';

export class LoginComponent {
  constructor(private authService: AuthService) {}

  login() {
    const credentials: LoginRequest = {
      email: 'admin@example.com',
      password: 'password123'
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login réussi', response);
        // Le token est automatiquement stocké
        // Redirection automatique possible
      },
      error: (error) => {
        console.error('Erreur de connexion', error);
      }
    });
  }

  logout() {
    this.authService.logout();
    // Déconnexion et redirection automatique vers /login
  }
}
```

### Exemple 2: Gestion des utilisateurs

```typescript
import { Component, OnInit } from '@angular/core';
import { UserServiceApi } from './services/user.service';
import { UserRequest, UserResponse, Role } from './models';

export class UserManagementComponent implements OnInit {
  users: UserResponse[] = [];

  constructor(private userService: UserServiceApi) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.list().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Erreur chargement utilisateurs', error);
      }
    });
  }

  createUser() {
    const newUser: UserRequest = {
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      password: 'securePassword123',
      role: Role.CLIENT,
      telephone: '+221 77 123 45 67'
    };

    this.userService.inscription(newUser).subscribe({
      next: (user) => {
        console.log('Utilisateur créé', user);
        this.loadUsers();
      },
      error: (error) => {
        console.error('Erreur création utilisateur', error);
      }
    });
  }

  getUsersByRole(role: Role) {
    this.userService.findByRole(role).subscribe({
      next: (users) => {
        console.log(`Utilisateurs avec rôle ${role}:`, users);
      }
    });
  }
}
```

### Exemple 3: Gestion des billets

```typescript
import { Component } from '@angular/core';
import { BilletServiceApi } from './services/billet.service';
import { BilletRequest, BilletResponse } from './models';

export class BilletComponent {
  billets: BilletResponse[] = [];

  constructor(private billetService: BilletServiceApi) {}

  loadBillets() {
    this.billetService.list().subscribe({
      next: (billets) => {
        this.billets = billets;
      }
    });
  }

  createBillet() {
    const billet: BilletRequest = {
      montant: 25000,
      statut: 'ACTIF',
      numeroSiege: 'A12',
      classeVoyage: 'ECONOMIQUE',
      nomPassager: 'Diop',
      prenomPassager: 'Amadou',
      numeroIdentite: '1234567890123',
      itineraireTrackingId: 'uuid-itineraire',
      reservationTrackingId: 'uuid-reservation' // optionnel
    };

    this.billetService.create(billet).subscribe({
      next: (response) => {
        console.log('Billet créé:', response);
        // Le QR code et PDF sont générés automatiquement
        console.log('QR Code:', response.qrCode);
        console.log('PDF URL:', response.pdfUrl);
      }
    });
  }

  downloadPdf(trackingId: string) {
    this.billetService.downloadPdf(trackingId).subscribe({
      next: (blob) => {
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `billet-${trackingId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
}
```

### Exemple 4: Gestion des itinéraires

```typescript
import { Component } from '@angular/core';
import { ItineraireServiceApi } from './services/itineraire.service';
import { ItineraireRequest } from './models';

export class ItineraireComponent {
  constructor(private itineraireService: ItineraireServiceApi) {}

  createItineraire() {
    const itineraire: ItineraireRequest = {
      villeDepart: 'Dakar',
      villeArrivee: 'Saint-Louis',
      dateDepart: '2025-12-01', // Format YYYY-MM-DD
      heureDepart: '08:00',
      prix: 5000,
      placeDisponible: 45,
      compagnieId: 'uuid-compagnie'
    };

    this.itineraireService.create(itineraire).subscribe({
      next: (response) => {
        console.log('Itinéraire créé:', response);
      }
    });
  }

  searchItineraires() {
    this.itineraireService.search('Dakar', 'Saint-Louis').subscribe({
      next: (itineraires) => {
        console.log('Itinéraires trouvés:', itineraires);
      }
    });
  }
}
```

## 📋 Checklist de vérification

### Backend API
- [ ] L'API backend est démarrée et accessible
- [ ] L'URL de l'API est correcte dans `environment.ts`
- [ ] Les endpoints correspondent à ceux définis dans `angular.md`
- [ ] CORS est configuré sur le backend pour accepter les requêtes du frontend

### Frontend
- [ ] Tous les packages npm sont installés (`npm install`)
- [ ] L'application démarre sans erreur (`ng serve`)
- [ ] L'interceptor HTTP est configuré dans `app.config.ts`
- [ ] Les routes sont protégées par les guards si nécessaire

### Tests de connexion
- [ ] Le login fonctionne et retourne un token
- [ ] Le token est stocké dans localStorage
- [ ] Les requêtes suivantes incluent le header Authorization
- [ ] La déconnexion fonctionne correctement

## 🐛 Résolution des problèmes courants

### Erreur CORS
**Symptôme:** `Access to XMLHttpRequest ... has been blocked by CORS policy`

**Solution:** Configurer CORS sur votre backend Spring Boot:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

### Erreur 401 (Unauthorized)
**Symptôme:** Toutes les requêtes retournent 401

**Causes possibles:**
1. Token expiré → Reconnectez-vous
2. Token invalide → Vérifiez le format du token
3. Backend ne reconnaît pas le token → Vérifiez la configuration JWT du backend

### Erreur 404 (Not Found)
**Symptôme:** Endpoint non trouvé

**Solutions:**
1. Vérifiez l'URL dans `environment.ts`
2. Vérifiez que le backend utilise bien le préfixe `/api/v1`
3. Vérifiez les logs du backend pour voir l'URL attendue

### Problèmes de typage TypeScript
**Symptôme:** Erreurs de compilation TypeScript

**Solution:** Les modèles sont maintenant strictement typés. Assurez-vous d'utiliser les bons types:
- `role: Role.ADMIN` (pas `role: 'ADMIN'`)
- `type: TypeCompagnie.AEROPORT` (pas `type: 'AEROPORT'`)

## 📚 Ressources

- **Models:** `src/app/models/` - Tous les types TypeScript
- **Services:** `src/app/services/` - Tous les services API
- **Enums:** `src/app/models/enums.model.ts` - Tous les enums (Role, TypeCompagnie, etc.)
- **Environment:** `src/environments/environment.ts` - Configuration de l'API

## 🎯 Prochaines étapes recommandées

1. **Tests E2E**: Tester chaque endpoint avec l'API backend
2. **Gestion des erreurs**: Ajouter un service de notification pour afficher les erreurs
3. **Loading states**: Ajouter des indicateurs de chargement
4. **Validation**: Ajouter la validation des formulaires côté frontend
5. **Guards**: Protéger les routes selon les rôles utilisateurs

---

**Note:** Ce guide suppose que votre backend Spring Boot utilise les mêmes DTOs et endpoints que ceux définis dans `angular.md`. Si votre backend diffère, ajustez les modèles et services en conséquence.
