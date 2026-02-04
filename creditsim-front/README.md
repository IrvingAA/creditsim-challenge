# 🎨 CreditSim Frontend

> Interfaz moderna para simulación de créditos con React 19, TypeScript y arquitectura de tipos centralizada

[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![i18next](https://img.shields.io/badge/i18next-23.10.0-26A69A?logo=i18next&logoColor=white)](https://www.i18next.com/)

---

## 📖 Descripción

Aplicación web Single Page Application (SPA) que consume la API de CreditSim para:

- ✅ **Simular créditos** con sistema de amortización francesa
- ✅ **Visualizar tablas** de amortización interactivas
- ✅ **Exportar PDF** de simulaciones
- ✅ **Verificar cotizaciones** por folio
- ✅ **Comparar performance** del backend (benchmarks arquitectónicos)
- ✅ **Soporte multilenguaje** (Español/English)

---

## 🚀 Stack Tecnológico

| Componente              | Tecnología                  | Versión  | Propósito                                      |
|-------------------------|-----------------------------|----------|------------------------------------------------|
| **Framework UI**        | React                       | 19.2.4   | Biblioteca de componentes reactivos            |
| **Lenguaje**            | TypeScript                  | 5.8.2    | Tipado estático y seguridad de tipos           |
| **Build Tool**          | Vite                        | 6.2.0    | Bundler ultra-rápido con HMR                   |
| **HTTP Client**         | Axios                       | 1.13.4   | Cliente HTTP con interceptors                  |
| **Internacionalización**| i18next + react-i18next     | 23.10.0  | Sistema de traducciones EN/ES                  |
| **Iconografía**         | Lucide React                | 0.563.0  | Iconos modernos y consistentes                 |
| **Exportación PDF**     | jsPDF + autotable           | 2.5.2    | Generación de PDFs de simulaciones             |

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
creditsim-front/
├── src/
│   ├── components/         # Componentes UI reutilizables
│   │   ├── layout/         # Layout principal, Header
│   │   └── ui/             # Botones, Cards, Badges, etc.
│   ├── features/           # Features por dominio (separation of concerns)
│   │   ├── simulator/      # Simulación de créditos
│   │   ├── search/         # Búsqueda/verificación de simulaciones
│   │   ├── benchmark/      # Performance tests (V1 + V2)
│   │   └── list/           # Listado de simulaciones
│   ├── lib/                # Utilidades y configuraciones
│   │   ├── i18n.ts         # Configuración de traducciones
│   │   └── pdf.ts          # Generación de PDFs
│   ├── services/           # Comunicación con APIs
│   │   └── api.ts          # Axios client + endpoints
│   ├── types/              # Definiciones de tipos TypeScript
│   │   ├── api.types.ts    # Tipos de respuestas API
│   │   ├── domain.types.ts # Modelos de dominio
│   │   ├── ui.types.ts     # Props de componentes
│   │   ├── search.types.ts # Búsqueda y verificación
│   │   ├── list.types.ts   # Listado paginado
│   │   ├── benchmark.types.ts  # Performance tests
│   │   └── i18n.types.ts   # Traducciones tipadas
│   ├── App.tsx             # Componente raíz (tabs)
│   └── main.tsx            # Entry point
├── public/                 # Assets estáticos
├── docker/
│   └── nginx/
│       ├── nginx.conf      # Configuración HTTP
│       └── nginx-ssl.conf  # Configuración HTTPS + SSL
├── Dockerfile              # Multi-stage build
├── package.json            # Dependencias npm
├── tsconfig.json           # Configuración TypeScript
├── vite.config.ts          # Configuración Vite
└── README.md               # Este archivo
```

### Principios de Diseño

1. **Feature-Based Organization**  
   Cada funcionalidad (simulator, search, benchmark) vive en su propia carpeta con componentes, tipos y lógica aislada.

2. **Type Safety First**  
   - **Zero `any` types** en todo el proyecto
   - Tipos centralizados en `/types/*.types.ts`
   - Props validadas en tiempo de compilación

3. **Separation of Concerns**  
   - **UI Components:** Presentacionales puros (no lógica de negocio)
   - **Features:** Orchestration + business logic
   - **Services:** Comunicación externa (API calls)

4. **Internationalization-Ready**  
   Todos los textos usan sistema de traducciones `t()`, sin strings hardcodeados.

---

## 🌍 Internacionalización (i18n)

La aplicación soporta **cambio dinámico de idioma** sin recargar la página.

**Idiomas disponibles:**
- 🇪🇸 Español (default)
- 🇬🇧 English

**Implementación:**
- Configuración centralizada en [`lib/i18n.ts`](src/lib/i18n.ts)
- Detección automática del idioma del navegador
- Persistencia de preferencia en `localStorage`
- Traducciones tipadas con TypeScript

**Ejemplo de uso:**
```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('simulator.title')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
    </div>
  );
}
```

**Estructura de traducciones:**
```typescript
// lib/i18n.ts
resources: {
  es: {
    translation: {
      simulator: { title: "Simulador de Crédito" },
      benchmark: { run_tests: "Ejecutar Tests" }
    }
  },
  en: {
    translation: {
      simulator: { title: "Credit Simulator" },
      benchmark: { run_tests: "Run Tests" }
    }
  }
}
```

---

## 📋 Features

### 1. Simulador de Crédito
- Formulario con validación de datos financieros
- Cálculo en tiempo real de cuota mensual
- Tabla de amortización interactiva
- Exportación a PDF con logo y formato profesional
- Soporte de solicitante (opcional: nombre, apellido, DNI)

### 2. Búsqueda de Simulaciones
- Verificación por folio + apellido + DNI
- Recuperación de simulaciones históricas
- Validación de identidad del solicitante

### 3. Listado de Simulaciones
- Vista paginada de todas las simulaciones
- Filtros y ordenamiento
- Vista previa de detalles

### 4. Benchmark de Arquitectura
- **Comparación de infraestructura:** Redis cache vs Sin cache
- **Tests de arquitectura:** Domain vs Async vs Sync
- **Visualización de performance:** Gráficos comparativos con badges de cumplimiento
- **Métricas en tiempo real:** Latencia, compliance con SLA (<100ms), speedup
- **Arquitectura V2:** Nueva UI con mejor UX y diseño modular

---

## 🚀 Quick Start

### Desarrollo Local

**Prerrequisitos:**
- Node.js 20+
- npm o yarn
- API backend corriendo en `http://localhost:8000` (ver [README principal](../README.md))

**Instalación:**
```bash
cd creditsim-front

# Instalar dependencias
npm install

# Configurar variable de entorno (opcional)
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

**Hot Module Replacement (HMR):**  
Vite recarga automáticamente los cambios sin perder el estado de React.

---

### Build de Producción

```bash
# Crear build optimizado
npm run build

# Vista previa del build
npm run preview
```

**Output:** `dist/` (archivos estáticos listos para servir)

**Optimizaciones automáticas:**
- Tree-shaking
- Minificación de JS/CSS
- Code splitting por rutas
- Compresión gzip
- Source maps para debugging

**Tamaño del bundle:**
```
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-C8zxR1Lh.css   11.54 kB │ gzip:  3.12 kB
dist/assets/index-DLNGz2UF.js   346.62 kB │ gzip: 107.49 kB
```

---

## 🐳 Docker

### Desarrollo

```bash
# Desde el directorio raíz del proyecto
make dev-up
```

Esto levanta:
- Frontend en http://localhost:3001 (Nginx)
- API en http://localhost:8000
- PostgreSQL, Redis, Celery

### Producción (con Nginx)

```bash
# Build de imagen
docker build -t creditsim-front:latest \
  --build-arg VITE_API_URL=/api \
  --target runner \
  -f Dockerfile .

# Run
docker run -p 80:80 creditsim-front:latest
```

**Nginx Configuration:**
- Reverse proxy: `/api/*` → Backend API
- SPA routing: Todas las rutas → `index.html`
- Gzip compression habilitada
- SSL/TLS ready (ver [`nginx-ssl.conf`](docker/nginx/nginx-ssl.conf))

---

## 🧪 Type Safety

Este proyecto mantiene **cobertura de tipos del 100%**:

```bash
# Verificar tipos (no compila si hay errores)
npx tsc --noEmit

# Build (falla si hay errores de tipo)
npm run build
```

**Configuración TypeScript:**
- `strict: true` (máxima seguridad)
- `noImplicitAny: true`
- `strictNullChecks: true`
- Path aliases configurados: `@/*` → `./src/*`

**Organización de tipos:**
```
types/
├── api.types.ts        # Contratos API (Request/Response)
├── domain.types.ts     # Entidades de negocio
├── ui.types.ts         # Props de componentes
├── search.types.ts     # Feature: Búsqueda
├── list.types.ts       # Feature: Listado
├── benchmark.types.ts  # Feature: Performance
└── i18n.types.ts       # Traducciones tipadas
```

---

## 🎨 Componentes UI

La aplicación usa un sistema de diseño custom con componentes reutilizables:

```tsx
// Button.tsx - Ejemplo de componente tipado
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', ... }: ButtonProps) {
  // Implementación
}
```

**Catálogo de componentes:**
- `Button` - Botones con variantes y estados
- `Card` - Contenedores de contenido
- `Badge` - Labels de estado
- `Tabs` - Navegación por pestañas
- `Table` - Tablas de datos
- `LanguageSwitch` - Selector de idioma

---

## 📦 Dependencias

### Producción

```json
{
  "axios": "^1.13.4",           // HTTP client
  "i18next": "23.10.0",         // i18n core
  "i18next-browser-languagedetector": "7.2.0",
  "jspdf": "^2.5.2",            // PDF generation
  "jspdf-autotable": "^3.8.3",  // PDF tables
  "lucide-react": "^0.563.0",   // Icons
  "react": "^19.2.4",           // UI library
  "react-dom": "^19.2.4",
  "react-i18next": "14.1.0"     // React bindings i18n
}
```

### Desarrollo

```json
{
  "@types/node": "^22.14.0",
  "@vitejs/plugin-react": "^5.0.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.0"
}
```

---

## 🔧 Variables de Entorno

**Desarrollo (`.env.local`):**
```bash
VITE_API_URL=http://localhost:8000
```

**Producción (build time):**
```bash
# Usado en docker build
VITE_API_URL=/api
```

> **Nota:** Variables `VITE_*` se exponen al cliente (bundle final).  
> No incluir secretos o tokens aquí.

---

## 📝 Convenciones de Código

### Naming
- **Componentes:** PascalCase (`SimulatorForm.tsx`)
- **Archivos de tipos:** `*.types.ts`
- **Hooks:** `use*` prefix (`useTranslation`)
- **Constantes:** UPPER_SNAKE_CASE
- **Funciones:** camelCase

### Imports
```tsx
// 1. React/libraries
import { useState } from 'react';
import axios from 'axios';

// 2. Types
import type { SimulationRequest } from '@/types/api.types';

// 3. Components
import { Button } from '@/components/ui/Button';

// 4. Services/lib
import { api } from '@/services/api';
```

### Props Typing
```tsx
// ✅ Bueno - Interface explícita
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) { }

// ❌ Evitar - any o tipos implícitos
export function Card(props: any) { }
```

---

## 🚀 Deployment

Ver [`../README.md`](../README.md) para instrucciones completas de deployment.

**Resumen:**
```bash
# Deploy usando script unificado
export SSH_HOST=3.145.78.90
export GHCR_TOKEN=ghp_xxxxx
export SERVICE_DOMAIN=creditsim.iayala.dev

# Deploy latest
./scripts/deploy.sh

# Deploy tag específico (desde GitHub Actions)
./scripts/deploy.sh --tag develop-abc1234-20260203120000

# Build local + deploy
./scripts/deploy.sh --build
```

**Resultado:**
- Frontend: https://creditsim.iayala.dev
- API: https://creditsim.iayala.dev/api
- Docs: https://creditsim.iayala.dev/api/docs

---

## 📊 Performance

**Métricas del build:**
- Total bundle size: ~346 KB (gzipped: ~107 KB)
- First Contentful Paint: <1s
- Time to Interactive: <2s
- Lighthouse Score: 95+

**Optimizaciones aplicadas:**
- Code splitting por features
- Lazy loading de componentes pesados
- Memoización de componentes (`React.memo`)
- Debounce en inputs de formularios

---

## 🤝 Contribución

Este es un proyecto de demostración técnica. Para cambios:

1. Mantener **100% type safety** (cero `any`)
2. Actualizar traducciones (ES + EN)
3. Validar build sin errores: `npm run build`
4. Seguir arquitectura feature-based

---

## 📖 Documentación Relacionada

- [README Principal](../README.md) - Arquitectura completa del proyecto
- [Docker Compose](../docs/DOCKER_COMPOSE.md) - Arquitectura de deployment

---

**Versión:** 0.1.0  
**Última actualización:** Febrero 2026
