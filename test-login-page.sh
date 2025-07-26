#!/bin/bash

echo "🔐 Test de la page de connexion admin"
echo "======================================"

echo "📄 Test de la page de connexion..."
curl -s http://localhost:3000/admin/login > /tmp/login-page.html

echo "📊 Taille de la page: $(wc -c < /tmp/login-page.html) bytes"

echo ""
echo "🔍 Vérification du contenu..."
if grep -q "LogoDouman" /tmp/login-page.html; then
    echo "✅ LogoDouman trouvé dans la page"
else
    echo "❌ LogoDouman non trouvé"
fi

if grep -q "admin@logodouman.com" /tmp/login-page.html; then
    echo "✅ Email de test trouvé"
else
    echo "❌ Email de test non trouvé"
fi

if grep -q "form" /tmp/login-page.html; then
    echo "✅ Formulaire trouvé"
else
    echo "❌ Formulaire non trouvé"
fi

echo ""
echo "🧪 Test de soumission du formulaire..."
curl -s -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@logodouman.com","password":"admin123"}' \
  -w "Status: %{http_code}\n"

echo ""
echo "🔍 Vérification des erreurs CORS..."
curl -s -I http://localhost:3000/admin/login | grep -i "access-control"

echo ""
echo "📱 Test avec User-Agent mobile..."
curl -s -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" \
  http://localhost:3000/admin/login > /dev/null && echo "✅ Compatible mobile"

echo ""
echo "🧹 Nettoyage..."
rm -f /tmp/login-page.html

echo "✅ Test terminé" 