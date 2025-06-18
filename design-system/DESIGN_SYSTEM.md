# 🎨 Design System - LogoDouman

## 🎯 Philosophie de Design

**"Simplicité élégante, conversion maximale"**

Notre design system s'appuie sur les principes de :
- **Clarté** : Chaque élément a un objectif précis
- **Consistance** : Expérience cohérente sur tous les touchpoints
- **Accessibilité** : WCAG 2.1 AA compliance
- **Performance** : Optimisé pour la vitesse et la conversion
- **Émotionnel** : Inspire confiance et désir d'achat

## 🎨 Palette de Couleurs

### Couleurs Primaires
```css
:root {
  /* Primaire - Bleu premium */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6; /* Couleur principale */
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
  
  /* Secondaire - Orange énergie */
  --secondary-50: #fff7ed;
  --secondary-100: #ffedd5;
  --secondary-200: #fed7aa;
  --secondary-300: #fdba74;
  --secondary-400: #fb923c;
  --secondary-500: #f97316; /* Couleur secondaire */
  --secondary-600: #ea580c;
  --secondary-700: #c2410c;
  --secondary-800: #9a3412;
  --secondary-900: #7c2d12;
}
```

## ♿ Accessibilité

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### États d'Interaction
```css
/* États des boutons */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Indicateurs de chargement */
.loading-state {
  position: relative;
  pointer-events: none;
}

.loading-state::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid var(--primary-500);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}
```

## 🎨 Thèmes & Variations

### Mode Sombre
```css
[data-theme="dark"] {
  --bg-primary: var(--neutral-900);
  --bg-secondary: var(--neutral-800);
  --bg-tertiary: var(--neutral-700);
  --text-primary: var(--neutral-100);
  --text-secondary: var(--neutral-300);
  --text-tertiary: var(--neutral-400);
  
  /* Adaptations des couleurs primaires */
  --primary-500: #60a5fa;
  --secondary-500: #fb923c;
}

/* Transition fluide entre thèmes */
* {
  transition: background-color var(--duration-normal) var(--ease-in-out),
              color var(--duration-normal) var(--ease-in-out),
              border-color var(--duration-normal) var(--ease-in-out);
}
```

### Thèmes Régionaux
```css
/* Thème Moyen-Orient */
[data-region="middle-east"] {
  --primary-500: #059669; /* Vert émeraude */
  --secondary-500: #dc2626; /* Rouge profond */
  direction: rtl;
}

/* Thème Afrique */
[data-region="africa"] {
  --primary-500: #ea580c; /* Orange terre */
  --secondary-500: #16a34a; /* Vert nature */
}

/* Thème Europe */
[data-region="europe"] {
  --primary-500: #3b82f6; /* Bleu classique */
  --secondary-500: #8b5cf6; /* Violet élégant */
}
```

## 🧩 Composants Avancés

### Cards Premium
```css
.card-premium {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-2xl);
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  transition: all var(--duration-normal) var(--ease-out);
}

.card-premium:hover {
  transform: translateY(-8px) rotateX(5deg);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.15),
    0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Effet glassmorphism */
.card-glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-2xl);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
```

### Navigation Adaptive
```css
.nav-primary {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: all var(--duration-normal) var(--ease-out);
}

.nav-primary.scrolled {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.nav-item {
  position: relative;
  padding: var(--space-4) var(--space-6);
  color: var(--neutral-700);
  font-weight: var(--font-medium);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--primary-500);
  transform: translateX(-50%);
  transition: width var(--duration-normal) var(--ease-out);
}

.nav-item:hover::after,
.nav-item.active::after {
  width: 100%;
}
```

---

**Ce design system garantit une cohérence visuelle parfaite, une accessibilité maximale et des performances optimales sur tous les appareils et toutes les régions du monde.**
