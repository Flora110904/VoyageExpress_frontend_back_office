# 🔐 GUIDE D'AUTHENTIFICATION - VoyageExpress

## ✅ AUTHENTIFICATION COMPLÈTEMENT INTÉGRÉE!

L'authentification JWT a été intégrée dans toute l'application avec:
- Page de login sécurisée
- Protection des routes admin
- Intercepteur HTTP pour ajouter le token
- Gestion du stockage local
- Bouton de déconnexion

---

## 🏗️ **Architecture d'Authentification**

### **1. AuthService** (`src/app/services/auth.service.ts`)

Service principal gérant:
- ✅ **Login/Logout**
- ✅ **Stockage du token JWT** (localStorage)
- ✅ **Informations utilisateur** (BehaviorSubject)
- ✅ **Vérification d'authentification**
- ✅ **Vérification des rôles** (Admin)

```typescript
// Méthodes principales:
login(credentials): Observable<LoginResponse>
logout(): void
getToken(): string | null
getCurrentUser(): LoginResponse | null
isAuthenticated(): boolean
isAdmin(): boolean
getUserFullName(): string
```

### **2. LoginComponent** (`src/app/auth/login.component.ts`)

Page de connexion avec:
- ✅ **Formulaire réactif** avec validation
- ✅ **Gestion des erreurs** détaillée
- ✅ **Loading state** pendant la connexion
- ✅ **Design moderne** avec gradients
- ✅ **Redirection automatique** si déjà connecté
- ✅ **Credentials de démo** affichés

**Credentials de test:**
- Email: `admin@voyageexpress.com`
- Mot de passe: `admin123`

### **3. AuthGuard** (`src/app/guards/auth.guard.ts`)

Protection des routes:
- ✅ **authGuard**: Vérifie l'authentification
- ✅ **adminGuard**: Vérifie le rôle admin
- ✅ **Redirection automatique** vers /login si non authentifié

```typescript
// Utilisation dans les routes:
{
  path: 'admin',
  canActivate: [authGuard],
  children: [...]
}
```

### **4. AuthInterceptor** (`src/app/interceptors/auth.interceptor.ts`)

Intercepteur HTTP automatique:
- ✅ **Ajoute le token** `Bearer` à chaque requête
- ✅ **Gère les erreurs 401** (token expiré)
- ✅ **Déconnexion automatique** si token invalide

```typescript
// Ajouté automatiquement aux headers:
Authorization: Bearer <token>
```

---

## 🔄 **Flux d'Authentification**

### **1. Login:**
```
1. Utilisateur entre email/password
2. AuthService.login() → POST /api/auth/login
3. Backend retourne { token, user info }
4. Token stocké dans localStorage
5. User info stocké dans BehaviorSubject
6. Redirection vers /admin/dashboard
```

### **2. Navigation Protégée:**
```
1. Utilisateur navigue vers /admin/*
2. authGuard vérifie isAuthenticated()
3. Si token existe → Accès autorisé
4. Si pas de token → Redirection vers /login
```

### **3. Requêtes API:**
```
1. Composant fait une requête HTTP
2. authInterceptor ajoute header Authorization
3. Backend vérifie le token JWT
4. Si valide → Données retournées
5. Si invalide (401) → Déconnexion automatique
```

### **4. Logout:**
```
1. Utilisateur clique "Déconnexion"
2. Confirmation demandée
3. AuthService.logout():
   - Efface localStorage
   - Reset currentUser$
   - Appelle /api/auth/logout (optionnel)
   - Redirection vers /login
```

---

## 📂 **Fichiers Créés/Modifiés**

### **Nouveaux Fichiers:**
```
src/app/auth/login.component.ts          - Page de connexion
src/app/guards/auth.guard.ts             - Protection des routes
src/app/interceptors/auth.interceptor.ts - Injection du token
```

### **Fichiers Modifiés:**
```
src/app/services/auth.service.ts         - Gestion complète auth
src/app/app.config.ts                    - Ajout intercepteur
src/app/app.routes.ts                    - Route login + guards
src/app/admin/layout/layout.component.ts - Infos user réelles
src/app/admin/layout/layout.component.html - Affichage user + logout
```

---

## 🎨 **Interface Utilisateur**

### **Page de Login:**
- Design moderne avec gradient bleu
- Logo VoyageExpress en haut
- Formulaire centré avec validation
- Messages d'erreur clairs
- Bouton de loading animé
- Credentials de démo affichés
- Responsive mobile

### **Layout Admin:**
- Nom et email de l'utilisateur dans sidebar
- Avatar généré automatiquement
- Bouton de déconnexion avec icône
- Confirmation avant logout

---

## 🔒 **Sécurité Implémentée**

### **1. Stockage Sécurisé:**
- Token stocké dans localStorage (clé: `auth_token`)
- User info stocké (clé: `auth_user`)
- Nettoyage automatique au logout

### **2. Protection des Routes:**
- Toutes les routes `/admin/*` protégées
- Redirection automatique si non authentifié
- returnUrl sauvegardé pour redirection post-login

### **3. Gestion des Tokens:**
- Token ajouté automatiquement aux requêtes
- Format: `Bearer <token>`
- Déconnexion si token expiré (401)

### **4. Validation:**
- Email requis et format validé
- Mot de passe requis (min 6 caractères)
- Messages d'erreur contextuels

---

## 🧪 **Tests d'Authentification**

### **Test 1: Login Réussi**
```
1. Aller sur http://localhost:4200
2. Redirection automatique vers /login
3. Entrer: admin@voyageexpress.com / admin123
4. Clic "Se connecter"
5. ✅ Redirection vers /admin/dashboard
6. ✅ Token stocké dans localStorage
7. ✅ Nom utilisateur affiché dans sidebar
```

### **Test 2: Login Échoué**
```
1. Entrer mauvais credentials
2. ✅ Message d'erreur affiché
3. ✅ Pas de redirection
4. ✅ Formulaire reste rempli
```

### **Test 3: Accès Direct Admin**
```
1. Sans être connecté
2. Aller sur http://localhost:4200/admin/dashboard
3. ✅ Redirection vers /login
4. ✅ returnUrl=/admin/dashboard sauvegardé
```

### **Test 4: Token Expiré**
```
1. Connecté avec token
2. Backend retourne 401
3. ✅ Déconnexion automatique
4. ✅ Redirection vers /login
5. ✅ localStorage nettoyé
```

### **Test 5: Logout**
```
1. Clic bouton déconnexion
2. ✅ Confirmation demandée
3. ✅ Redirection vers /login
4. ✅ localStorage nettoyé
5. ✅ Impossible d'accéder aux routes admin
```

---

## 🔌 **Intégration Backend Requise**

Votre backend Spring Boot DOIT implémenter:

### **1. Endpoint Login:**
```java
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "admin@voyageexpress.com",
  "password": "admin123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "email": "admin@voyageexpress.com",
  "role": "ADMIN",
  "nom": "Dupont",
  "prenom": "Jean",
  "actif": true
}
```

### **2. Endpoint Logout (Optionnel):**
```java
POST /api/auth/logout
Authorization: Bearer <token>

Response: 200 OK
"Déconnexion réussie"
```

### **3. Validation du Token:**
```java
// Sur toutes les routes protégées:
Authorization: Bearer <token>

Si token invalide/expiré:
Response: 401 Unauthorized
{
  "message": "Token invalide ou expiré"
}
```

### **4. Configuration CORS:**
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:4200")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .exposedHeaders("Authorization")
                    .allowCredentials(true);
            }
        };
    }
}
```

---

## 📊 **État de l'Application**

### **✅ Authentification:**
- [x] Page de login moderne
- [x] Gestion JWT complète
- [x] Protection des routes
- [x] Intercepteur HTTP
- [x] Logout fonctionnel
- [x] Stockage persistant
- [x] Gestion d'erreurs
- [x] Loading states

### **✅ Intégration:**
- [x] Service AuthService complet
- [x] Guards implémentés
- [x] Intercepteur configuré
- [x] Layout avec user info
- [x] Routes protégées
- [x] Redirections automatiques

---

## 🚀 **Démarrage Complet**

### **1. Backend (Spring Boot):**
```bash
cd /path/to/backend
./mvnw spring-boot:run
```
Accessible sur: `http://localhost:8080`

### **2. Frontend (Angular):**
```bash
cd VoyageExpress_Frontend_Backoffice
ng serve
```
Accessible sur: `http://localhost:4200`

### **3. Test de l'Auth:**
1. Ouvrir `http://localhost:4200`
2. Voir la page de login
3. Entrer credentials de démo
4. Se connecter → Dashboard
5. Naviguer dans l'app
6. Se déconnecter

---

## 💡 **Fonctionnalités Bonus**

### **1. Remember Me:**
Token persiste dans localStorage, donc:
- Utilisateur reste connecté après fermeture du navigateur
- Pas besoin de se reconnecter à chaque visite

### **2. Profil Utilisateur:**
```typescript
// Accessible partout:
authService.currentUser$.subscribe(user => {
  console.log(user.nom, user.prenom, user.role);
});
```

### **3. Guard Admin:**
```typescript
// Pour restreindre certaines pages:
{
  path: 'admin/users',
  canActivate: [authGuard, adminGuard]
}
```

---

## ⚠️ **Points Importants**

1. **Token Expiration:**
   - Backend doit implémenter expiration JWT
   - Frontend gère automatiquement le logout si 401

2. **CORS:**
   - DOIT être configuré sur le backend
   - Autoriser `http://localhost:4200`

3. **HTTPS en Production:**
   - Utiliser HTTPS en production
   - Jamais de tokens en HTTP

4. **Refresh Token:**
   - Actuellement: simple token
   - Possibilité d'ajouter refresh token si besoin

---

**🎉 L'AUTHENTIFICATION EST COMPLÈTEMENT OPÉRATIONNELLE!**
