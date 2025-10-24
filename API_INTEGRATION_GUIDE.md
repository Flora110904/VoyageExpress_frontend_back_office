# 🔧 GUIDE D'INTÉGRATION API - VoyageExpress

## ⚠️ PROBLÈME: L'Application ne Communique Pas avec l'API

### 📋 **Checklist de Diagnostic:**

#### **1. Le Backend est-il démarré?** ❓

Vérifiez que votre backend Spring Boot tourne sur **http://localhost:8080**

**Pour démarrer le backend:**
```bash
# Dans votre projet backend Spring Boot
./mvnw spring-boot:run
# OU
java -jar target/votre-backend.jar
```

**Vérification:**
- Ouvrez votre navigateur
- Allez sur: `http://localhost:8080/api/health` (ou une autre route)
- Vous devriez voir une réponse JSON

#### **2. CORS est-il configuré sur le Backend?** 🔒

Votre backend Spring Boot DOIT autoriser les requêtes depuis `http://localhost:4200`

**Configuration CORS requise dans Spring Boot:**

```java
// Dans votre backend: WebConfig.java ou CorsConfig.java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:4200", "http://localhost:4201")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

**OU avec annotation sur les controllers:**
```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class YourController {
    // ...
}
```

#### **3. L'URL de l'API est-elle correcte?** ✅

**Fichier actuel:** `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // ✅ Correct
};
```

#### **4. Vérifier les Appels API dans la Console du Navigateur** 🔍

1. Ouvrez votre application dans le navigateur (`http://localhost:4200`)
2. Ouvrez les **DevTools** (F12)
3. Allez dans l'onglet **Network**
4. Rechargez la page
5. Cherchez les requêtes vers `localhost:8080`

**Erreurs possibles:**

##### **Erreur CORS:**
```
Access to XMLHttpRequest at 'http://localhost:8080/api/users' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```
➡️ **Solution:** Configurez CORS sur le backend (voir étape 2)

##### **Erreur 404 Not Found:**
```
GET http://localhost:8080/api/users 404 (Not Found)
```
➡️ **Solution:** Vérifiez que vos endpoints backend correspondent aux URLs du frontend

##### **Erreur Connection Refused:**
```
GET http://localhost:8080/api/users net::ERR_CONNECTION_REFUSED
```
➡️ **Solution:** Le backend n'est pas démarré (voir étape 1)

---

## 🔄 **Routes API Utilisées par le Frontend:**

Voici toutes les routes que votre backend DOIT exposer:

### **Users:**
- `GET /api/users` - Liste
- `GET /api/users/{id}` - Détails
- `POST /api/users` - Créer
- `PUT /api/users/{id}` - Modifier
- `DELETE /api/users/{id}` - Supprimer

### **Compagnies:**
- `GET /api/compagnies` - Liste
- `GET /api/compagnies/{id}` - Détails
- `POST /api/compagnies` - Créer
- `PUT /api/compagnies/{id}` - Modifier
- `DELETE /api/compagnies/{id}` - Supprimer

### **Établissements:**
- `GET /api/etablissements` - Liste
- `GET /api/etablissements/{id}` - Détails
- `POST /api/etablissements` - Créer
- `PUT /api/etablissements/{id}` - Modifier
- `DELETE /api/etablissements/{id}` - Supprimer

### **Réservations:**
- `GET /api/reservations` - Liste
- `GET /api/reservations/{id}` - Détails
- `POST /api/reservations` - Créer
- `PUT /api/reservations/{id}` - Modifier
- `DELETE /api/reservations/{id}` - Supprimer

### **Itinéraires:**
- `GET /api/itineraires` - Liste
- `GET /api/itineraires/{id}` - Détails
- `POST /api/itineraires` - Créer
- `PUT /api/itineraires/{id}` - Modifier
- `DELETE /api/itineraires/{id}` - Supprimer

### **Véhicules:**
- `GET /api/vehicules` - Liste
- `GET /api/vehicules/{id}` - Détails
- `POST /api/vehicules` - Créer
- `PUT /api/vehicules/{id}` - Modifier
- `DELETE /api/vehicules/{id}` - Supprimer

---

## 🧪 **Test Manuel de l'API:**

### **Avec Postman/Insomnia:**

1. **Tester la liste des utilisateurs:**
   ```
   GET http://localhost:8080/api/users
   ```

2. **Tester la création d'un utilisateur:**
   ```
   POST http://localhost:8080/api/users
   Content-Type: application/json
   
   {
     "nom": "Diop",
     "prenom": "Amadou",
     "email": "amadou@example.com",
     "motDePasse": "password123",
     "role": "ADMIN"
   }
   ```

### **Avec curl:**

```bash
# Test GET
curl http://localhost:8080/api/users

# Test avec CORS headers
curl -H "Origin: http://localhost:4200" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:8080/api/users
```

---

## 🔧 **Solutions Rapides:**

### **Solution 1: Proxy Angular (Contourner CORS en développement)**

Créez le fichier `proxy.conf.json` à la racine du projet:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

Modifiez `angular.json`:
```json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

Modifiez `environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: '/api'  // Utilisez le proxy
};
```

Redémarrez: `ng serve`

### **Solution 2: Vérifier le Backend avec Swagger**

Si votre backend a Swagger UI:
- Ouvrez: `http://localhost:8080/swagger-ui.html`
- Testez toutes vos routes directement

---

## 📊 **État Actuel de l'Intégration Frontend:**

✅ **Services Créés (10):**
- `user.service.ts`
- `compagnie.service.ts`
- `etablissement.service.ts`
- `reservation.service.ts`
- `itineraire.service.ts`
- `vehicule.service.ts`
- `billet.service.ts`
- `local.service.ts`
- `vehicule-itineraire.service.ts`
- `auth.service.ts`

✅ **Pages Intégrées (8):**
- Users
- Compagnies
- Établissements
- Stations
- Réservations
- Trajets
- Véhicules
- Dashboard

✅ **Configuration:**
- `environment.apiUrl`: `http://localhost:8080/api`
- `HttpClient`: Configuré avec `provideHttpClient()`

---

## 🚀 **Démarrage Complet:**

### **1. Démarrer le Backend:**
```bash
cd /path/to/backend
./mvnw spring-boot:run
```

### **2. Démarrer le Frontend:**
```bash
cd /path/to/VoyageExpress_Frontend_Backoffice
ng serve
```

### **3. Ouvrir dans le Navigateur:**
```
http://localhost:4200
```

### **4. Ouvrir la Console (F12):**
- Onglet **Network** pour voir les requêtes
- Onglet **Console** pour voir les erreurs

---

## 📝 **Checklist Finale:**

- [ ] Backend démarré sur port 8080
- [ ] CORS configuré sur le backend
- [ ] Frontend démarré sur port 4200
- [ ] Aucune erreur CORS dans la console
- [ ] Les requêtes apparaissent dans l'onglet Network
- [ ] Les données s'affichent dans l'interface

---

## 💡 **Besoin d'Aide?**

**Si rien ne fonctionne:**
1. Vérifiez les logs du backend
2. Vérifiez la console du navigateur (F12)
3. Testez l'API avec Postman
4. Vérifiez que le port 8080 n'est pas bloqué par un firewall
