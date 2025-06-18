# 🚀 Frontend LogoDouman - Next.js 14

## 📋 Structure du Projet Frontend

```
frontend/
├── 📁 app/                     # App Router Next.js 14
│   ├── (auth)/                 # Route groups pour auth
│   ├── (shop)/                 # Route groups pour boutique
│   ├── admin/                  # Interface d'administration
│   ├── api/                    # API routes
│   ├── globals.css             # Styles globaux
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Page d'accueil
├── 📁 components/              # Composants réutilisables
│   ├── ui/                     # Composants UI de base
│   ├── forms/                  # Formulaires
│   ├── layout/                 # Composants de layout
│   └── ecommerce/              # Composants e-commerce
├── 📁 lib/                     # Utilitaires et configurations
│   ├── auth.ts                 # Configuration auth
│   ├── db.ts                   # Configuration base de données
│   ├── stripe.ts               # Configuration Stripe
│   └── utils.ts                # Fonctions utilitaires
├── 📁 hooks/                   # Hooks personnalisés
├── 📁 stores/                  # Stores Zustand
├── 📁 types/                   # Types TypeScript
├── 📁 public/                  # Assets statiques
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useState } from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error: any) => {
              // Ne pas retry sur les erreurs 4xx
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              return failureCount < 3;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

---

**Cette structure frontend complète de LogoDouman offre une base solide pour une expérience e-commerce moderne, performante et scalable avec Next.js 14.**
