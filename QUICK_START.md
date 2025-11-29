# 🚀 Quick Start - VoyageExpress

## Modifications effectuées ✅

Tous les **modèles** et **services** ont été mis à jour selon `angular.md` pour une communication optimale avec votre API.

## Démarrage rapide

### 1. Vérifier la configuration

```typescript
// src/environments/environment.ts
apiUrl: 'http://localhost:8080/api/v1'  // ✅ Déjà configuré
```

### 2. Démarrer l'application

```bash
# Backend (port 8080)
# Démarrez votre API Spring Boot

# Frontend (port 4200)
ng serve
```

### 3. Tester

```typescript
// Login
this.authService.login({ 
  email: 'admin@example.com', 
  password: 'password' 
}).subscribe(response => {
  console.log('Token:', response.token);
  // ✅ Token automatiquement stocké et ajouté aux requêtes suivantes
});

// Utiliser un service
this.billetService.list().subscribe(billets => {
  console.log('Billets:', billets);
});
```

## Services disponibles (10)

1. `AuthService` - Login/Logout
2. `UserServiceApi` - Gestion utilisateurs
3. `CompagnieServiceApi` - Gestion compagnies
4. `EtablissementServiceApi` - Gestion établissements
5. `ItineraireServiceApi` - Gestion itinéraires
6. `LocalServiceApi` - Gestion locaux
7. `ReservationServiceApi` - Gestion réservations
8. `VehiculeServiceApi` - Gestion véhicules
9. `VehiculeItineraireServiceApi` - Associations
10. `BilletServiceApi` - Gestion billets (avec PDF/QR)

## Exemples complets

Consultez le dossier `examples/` pour des composants prêts à l'emploi:
- `billet-management.component.example.ts`
- `itineraire-search.component.example.ts`
- `user-management.component.example.ts`

## Documentation complète

- **README_MISE_A_JOUR.md** - Vue d'ensemble
- **INTEGRATION_GUIDE.md** - Guide détaillé
- **CHANGELOG.md** - Historique des modifications

## Points clés

✅ **Interceptor HTTP** configuré (JWT automatique)  
✅ **Modèles typés** avec enums (Role, TypeCompagnie, etc.)  
✅ **50+ endpoints** API disponibles  
✅ **Gestion des erreurs** automatique (401 = déconnexion)  

**Tout est prêt! Commencez à développer.** 🎯
