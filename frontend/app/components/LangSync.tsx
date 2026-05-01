'use client';

import { useEffect } from 'react';
import { useRegion } from '../contexts/RegionContext';

// Met à jour <html lang="…"> dès que l'utilisateur change de langue,
// ce qui aide les lecteurs d'écran et les moteurs de recherche.
export default function LangSync() {
  const { lang } = useRegion();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
