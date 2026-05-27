# Portfolio TUCOO v2 – Mathis TUCOO
## BTS SIO SISR – Lycée Saint John Perse, Pau – 2024/2026

---

## Structure du projet

```
Portfolio-TUCOO v2/
├── index.html         → Page d'accueil (hero animé + présentation + navigation)
├── cv.html            → Curriculum Vitae complet
├── ateliers.html      → Ateliers professionnels (à compléter)
├── stages.html        → Stages (OGFA, Safran, Orange, UPPA…)
├── veille.html        → Veille technologique (caméras IP)
├── competences.html   → Blocs de compétences BTS SIO (1, 2, 3)
├── style.css          → Styles communs (thème cyberpunk bleu)
├── index.css          → Styles spécifiques à l'accueil
├── nav.js             → Navigation injectée automatiquement sur toutes les pages
└── README.md          → Ce fichier
```

## Comment ouvrir le portfolio

1. Double-clique sur `index.html` pour ouvrir dans ton navigateur
2. Toutes les pages sont reliées par la barre de navigation

## Personnalisation

### Ajouter ta vraie photo (CV)
Dans `cv.html`, remplace l'emoji 🧑‍💻 par une balise `<img>` :
```html
<img src="photo.jpg" alt="Mathis TUCOO" class="cv-photo" style="font-size:0">
```
Dépose ton fichier photo dans le dossier à côté.

### Ajouter ton CV PDF
Dépose un fichier `cv_mathis_tucoo.pdf` dans ce dossier.
Le bouton "Télécharger mon CV" dans `cv.html` pointera automatiquement dessus.

### Ajouter les diapositives de veille
Dépose un fichier `veille_diapositives.pdf` dans ce dossier.
Le bouton dans `veille.html` pointera dessus.

### Compléter les ateliers
Dans `ateliers.html`, remplace les placeholders par tes vraies réalisations.
Utilise le modèle des `prod-card` de `productions.html`.

### Héberger en ligne
Options gratuites : GitHub Pages, Netlify, Vercel
→ Dépose simplement les fichiers dans ton repo / projet.

---
Design : cyberpunk bleu foncé | Orbitron + Exo 2 | Animations CSS
