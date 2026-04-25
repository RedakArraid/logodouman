-- AlterTable: Produits polyvalents (sacs, alimentation, électronique, etc.)
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "productType" TEXT DEFAULT 'article';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "unit" TEXT DEFAULT 'piece';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "expiryDate" TIMESTAMP(3);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "attributes" JSONB;

-- Catégorie Alimentation si elle n'existe pas
INSERT INTO "Category" (id, name, slug, description, status, "displayOrder", "createdAt", "updatedAt")
SELECT 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Alimentation', 'alimentation', 'Produits alimentaires et denrées', 'active', 10, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'alimentation');
