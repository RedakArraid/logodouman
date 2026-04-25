-- AlterTable: Ajouter la marque aux produits (style Amazon)
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "brand" TEXT;
