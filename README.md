# 📚 Ma Biblio — Application de Recherche de Livres

**Projet :** Ma Biblio — Application de Recherche de Livres (React)  
**Date :** 31 Janvier 2026  
**Présenté par :** Abdoul Gamiyou, Abdoul Rahim

---

## Description

**Ma Biblio** est une application web moderne développée avec **React + TypeScript** qui permet de rechercher, filtrer et consulter les détails de millions de livres. Elle s'appuie sur deux sources de données publiques :

- **[OpenLibrary](https://openlibrary.org/)** — catalogue de livres, couvertures et informations bibliographiques.
- **[Wikipedia](https://www.wikipedia.org/)** — résumés encyclopédiques pour enrichir les fiches détaillées.

Ce projet a été réalisé dans le cadre du module **Frontend**.

---

## Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🏠 **Page d'accueil** | Affichage des livres « Tendances du jour » via l'API OpenLibrary |
| 🔍 **Recherche rapide** | Barre de recherche avec autocomplétion instantanée (Debounce) |
| 🔎 **Recherche avancée** | Filtres par Titre, Auteur, Sujet (Genre) et ISBN |
| 📖 **Fiche détaillée** | Couverture, informations bibliographiques et résumé Wikipedia |
| ⚡ **Performance** | Cache intelligent avec TanStack Query pour éviter les rechargements inutiles |

---

## Technologies Utilisées

- **[React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)** — via [Vite](https://vitejs.dev/) pour la robustesse et la rapidité
- **[TanStack Query (React Query)](https://tanstack.com/query)** — gestion du cache serveur et des états de chargement
- **[React Router DOM v7](https://reactrouter.com/)** — navigation SPA
- **[Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)** — tests unitaires et d'intégration
- **API OpenLibrary & Wikipedia** — sources de données

---

## Installation et Lancement

### Prérequis

- **[Node.js](https://nodejs.org/)** (version LTS recommandée)

### Étapes

1. **Extraire le projet** depuis l'archive `library_react_project-main.zip`, puis ouvrir un terminal à la racine du dossier extrait.

2. **Installer les dépendances :**

   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement :**

   ```bash
   npm run dev
   ```

   L'application sera accessible à l'adresse [http://localhost:5173](http://localhost:5173).

4. **Construire pour la production :**

   ```bash
   npm run build
   ```

---

## Tests

Le projet inclut des **tests d'intégration** pour valider le fonctionnement des composants critiques sans dépendre de la connexion internet. Les appels API sont mockés avec `vi.mock`.

**Lancer les tests :**

```bash
npm run test
```

**Ce qui est testé :**

- Affichage de l'état de chargement (*Loading state*).
- Récupération et affichage des données du livre (mock OpenLibrary).
- Récupération séquentielle et affichage de la description (mock Wikipedia).

---

## Structure du Projet

```
src/
├── api.ts               # Fonctions de communication avec OpenLibrary et Wikipedia
├── App.tsx              # Composant principal et configuration des routes
├── components/
│   └── Layout.tsx       # Mise en page commune (header, navigation)
└── pages/
    ├── HomePage.tsx     # Page d'accueil — livres tendances
    ├── SearchPage.tsx   # Page de recherche avancée
    └── BookPage.tsx     # Fiche détaillée d'un livre
```

---

## Auteurs

- **Abdoul Gamiyou**
- **Abdoul Rahim**
