# API de pour l'application read-books

- permettre à un utilisateur de créer un compte login + mot de passe

- pour sauvegarder en ligne sa liste de livre

- permettre l'utilisation multi-device de l'appli + backup de données si problème avec le stockage du navigateur

--

Ajout d'un nouvel état de l'application (qui doit rester en local first) : connecté 

=> token en localStorage ? 

API : 

- user :
  
  - créer un compte
  
  - authentifier un utilisateur via son login / mot de passe 
  
  - mot de passe oublié

- books :
  
  - stocker une liste de livre en DB
  
  - associer les livres à un utilisateur
  
  - enregistrer en DB une liste de livre au format JSON
  
  - délivrer une liste de livre au format JSON

- session : 
  
  - enregistrer le token de session d'un utilisateur pour valider ses requêtes

ROUTES : 

- GET : 

- POST : /books/save

| verb | parameters    | body                                | response                             | note                                                               |
| ---- | ------------- | ----------------------------------- | ------------------------------------ | ------------------------------------------------------------------ |
| GET  | user/*id/get  |                                     | Tableau détaillé des livres          |                                                                    |
| POST | user/*id/save | Tableau des la liste de livres      |                                      |                                                                    |
| POST | auth/login    | { email: string, password: string } | `{ user_id: stirng, token: string }` |                                                                    |
| POST | auth/signup   | `{email, password}`                 |                                      | Chiffre le mot de passe de l'utilisateur et l'ajoute à la DB_users |

## Base de données :

- users : 
  
  - id ; login ; password_hash

- sessions : 
  
  - id ; user_id ; token ; last_use 

- books : 
  
  - id ; user_id ; details 

**Verify request** : 

- le client envoie son id et son token dans la requête, et si elles correspondent à ceux enregistrées dans la base de donnée, la requête est valide

- si le token est supprimé du device ? 
  
  - => la personne n'est plus authentifiée, et doit se reconnecter avec login + mot de passe, et reçoit un nouveau token
  
  - 
