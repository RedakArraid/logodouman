#!/bin/bash

# Script pour créer des images placeholder SVG pour LogoDouman
# Ce script génère des images temporaires en attendant les vraies photos

# Couleurs
ORANGE="#f97316"
DARK_ORANGE="#ea580c"

# Fonction pour créer une image SVG
create_placeholder() {
    local filename="$1"
    local text="$2"
    local icon="$3"
    local width="$4"
    local height="$5"
    
    cat > "$filename" << EOF
<svg width="$width" height="$height" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:$ORANGE;stop-opacity:1" />
      <stop offset="100%" style="stop-color:$DARK_ORANGE;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" rx="15"/>
  <text x="50%" y="35%" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" fill="white">$icon</text>
  <text x="50%" y="65%" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white" font-weight="bold">$text</text>
</svg>
EOF
}

# Créer le dossier s'il n'existe pas
mkdir -p "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/products"
mkdir -p "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/categories"

echo "🎨 Création des images placeholder pour LogoDouman..."

# Images des produits
create_placeholder "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/products/sac-main-luxe.svg" "Sac de Luxe" "👜" "800" "800"
create_placeholder "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/products/robe-ete-elegante.svg" "Robe Élégante" "👗" "800" "800"
create_placeholder "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/products/ecouteurs-sans-fil.svg" "Écouteurs" "🎧" "800" "800"
create_placeholder "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/products/coussin-decoratif.svg" "Coussin Déco" "🛋️" "800" "800"
create_placeholder "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/products/montre-connectee.svg" "Smartwatch" "⌚" "800" "800"
create_placeholder "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/products/echarpe-soie.svg" "Écharpe Soie" "🧣" "800" "800"
create_placeholder "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/products/lampe-design.svg" "Lampe Design" "💡" "800" "800"
create_placeholder "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/products/portefeuille-cuir.svg" "Portefeuille" "💳" "800" "800"

# Images des catégories
create_placeholder "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/categories/fashion.svg" "Mode & Style" "👗" "600" "400"
create_placeholder "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/categories/bags.svg" "Sacs & Maroquinerie" "👜" "600" "400"
create_placeholder "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/categories/electronics.svg" "Électronique" "📱" "600" "400"
create_placeholder "/Users/kader/Desktop/projet-en-cours/logodouman/frontend/public/images/categories/home.svg" "Maison & Déco" "🏠" "600" "400"

echo "✅ Images placeholder créées avec succès !"
echo "📂 Emplacement : public/images/"
echo "💡 Remplacez ces fichiers SVG par de vraies photos JPG/PNG quand vous les aurez"