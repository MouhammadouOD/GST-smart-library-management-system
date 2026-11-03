# Smart Library Management System

GoMyCode checkpoint — *Low Level Design: Object-Oriented Design*.

Système de gestion de bibliothèque appliquant les principes OOD : classes abstraites, héritage, encapsulation, et 3 design patterns.

## Project structure

| File | Role |
|---|---|
| `user.js` | `User` (abstraite), `Student` (max 3 livres), `Teacher` (max 10 livres) |
| `userFactory.js` | **Factory Pattern** : `UserFactory.createUser(type, id, name)` |
| `book.js` | `Book` — titre, auteur, ISBN, disponibilité, flag `overdue` |
| `borrowTransaction.js` | `BorrowTransaction` — trace un emprunt/retour |
| `notificationService.js` | **Observer Pattern** : abonnement des users, notification en cas de retard |
| `librarySystem.js` | **Singleton Pattern** : `LibrarySystem.getInstance()`, orchestre users/books/transactions |
| `tests.js` | 12 tests : abstraction, factory, singleton, emprunt/retour, limites, notifications |

## How to run

```bash
npm test
```

## Résultats

```
12/12 tests passent
```
Exécution réelle vérifiée le 03/11/2026. Test de mutation effectué (retrait du garde-fou anti-double-emprunt) : le test correspondant échoue bien dans ce cas, confirmant qu'il est discriminant.

## Choix d'implémentation

- `User` bloque son propre `new` direct via `new.target === User` — seules les sous-classes (ou la `UserFactory`) peuvent construire un user concret.
- `LibrarySystem` bloque toute 2e instanciation directe en plus d'exposer `getInstance()`, pour que le pattern Singleton soit vérifiable par un test (pas juste déclaré).
- `NotificationService` ne notifie que les users qui ont réellement emprunté le livre concerné — testé explicitement pour éviter qu'un faux Observer notifie tout le monde.
