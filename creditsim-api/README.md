# 🔧 CreditSim API

> API REST con FastAPI, arquitectura hexagonal y procesamiento asíncrono de auditorías de riesgo

[![FastAPI](https://img.shields.io/badge/FastAPI-0.128.0-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red?logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
[![Celery](https://img.shields.io/badge/Celery-5.4.0-37814A?logo=celery&logoColor=white)](https://docs.celeryproject.org/)

---

## 📖 Descripción

API para simulación de créditos con sistema de amortización francesa que incluye:

- ✅ **Cálculo preciso** de amortización con `Decimal` (sin errores de redondeo)
- ✅ **Persistencia** en PostgreSQL con migraciones Alembic
- ✅ **Auditoría asíncrona** de riesgo con Celery + Redis
- ✅ **Cache opcional** con Redis para optimización de performance
- ✅ **Multilenguaje** (ES/EN) con Babel
- ✅ **Arquitectura hexagonal** (Clean Architecture)

---

## 🚀 Stack Tecnológico

| Componente              | Tecnología                  | Versión  | Propósito                                      |
|-------------------------|-----------------------------|----------|------------------------------------------------|
| **Framework Web**       | FastAPI                     | 0.128.0  | API REST moderna con validación automática     |
| **Lenguaje**            | Python                      | 3.11     | Performance + type hints                       |
| **ORM**                 | SQLAlchemy                  | 2.0      | Mapeo objeto-relacional con async support      |
| **Migraciones**         | Alembic                     | 1.15.1   | Versionado de esquema de base de datos         |
| **Base de Datos**       | PostgreSQL                  | 16       | Transacciones ACID + tipos avanzados           |
| **Queue/Cache**         | Redis                       | 7        | Message broker + cache layer                   |
| **Task Queue**          | Celery                      | 5.4.0    | Procesamiento asíncrono distribuido            |
| **Server ASGI**         | Uvicorn                     | 0.34.0   | Servidor async de alta performance             |
| **Validación**          | Pydantic                    | 2.10     | Schemas con validación automática              |
| **Testing**             | Pytest                      | 9.0.2    | Testing framework con fixtures                 |
| **i18n**                | Babel                       | 2.14.0   | Internacionalización de mensajes               |

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
creditsim-api/
├── app/
│   ├── main.py                 # Entry point FastAPI
│   ├── api/                    # Capa de presentación
│   │   ├── deps.py             # Dependency injection
│   │   ├── errors.py           # Exception handlers
│   │   ├── middleware/         # CORS, logging
│   │   ├── routes/             # Endpoints REST
│   │   │   ├── simulate.py     # POST /simulate
│   │   │   ├── verify.py       # POST /simulations/{id}/verify
│   │   │   ├── list.py         # GET /simulations
│   │   │   └── benchmark.py    # POST /benchmark/compare
│   │   └── schemas/            # Pydantic models (DTOs)
│   │
│   ├── application/            # Casos de uso (orquestación)
│   │   ├── use_cases/
│   │   │   ├── simulate_credit.py      # Orquesta: calcular → persistir → auditar
│   │   │   ├── verify_simulation.py    # Reproduce y valida cálculo
│   │   │   └── benchmark.py            # Compara arquitecturas
│   │   ├── dtos/               # Data Transfer Objects internos
│   │   └── ports.py            # Interfaces abstractas (Repository, Cache, Audit)
│   │
│   ├── domain/                 # Lógica de negocio pura (sin dependencias)
│   │   └── amortization/
│   │       ├── calculator.py   # Algoritmo francés con Decimal
│   │       └── models.py       # Entidades de dominio
│   │
│   ├── infrastructure/         # Adaptadores (implementaciones concretas)
│   │   ├── db/
│   │   │   ├── models.py       # SQLAlchemy models
│   │   │   └── session.py      # Database session factory
│   │   ├── repositories/       # Implementación de puertos
│   │   │   └── simulation_repository.py
│   │   ├── amortization_cache/
│   │   │   ├── redis_cache.py  # Cache con Redis
│   │   │   └── disabled_cache.py  # Fallback sin cache
│   │   ├── risk_audit/
│   │   │   ├── tasks.py        # Celery tasks
│   │   │   ├── celery_audit.py # Auditoría asíncrona
│   │   │   └── disabled_audit.py  # Fallback síncrono
│   │   ├── celery_app.py       # Configuración Celery
│   │   └── serializers.py      # Custom JSON encoders (Decimal)
│   │
│   ├── core/
│   │   ├── config.py           # Settings (env vars)
│   │   ├── i18n.py             # Traducciones
│   │   └── logging.py          # Configuración de logs
│   │
│   └── static/                 # Archivos estáticos (swagger-dark.css)
│
├── alembic/                    # Migraciones de base de datos
│   ├── env.py
│   └── versions/
│       ├── 136f36b4b18c_create_simulations_table.py
│       └── ...
│
├── locale/                     # Traducciones
│   ├── en/LC_MESSAGES/
│   └── es/LC_MESSAGES/
│
├── tests/                      # Tests unitarios + integración
│   ├── conftest.py             # Fixtures compartidos
│   ├── test_simulate_endpoint.py
│   ├── test_amortization_french.py
│   └── ...
│
├── Dockerfile                  # Multi-stage build
├── alembic.ini                 # Configuración Alembic
├── pyproject.toml              # Dependencias + metadata
└── README.md                   # Este archivo
```

### Principios de Diseño

1. **Arquitectura Hexagonal (Ports & Adapters)**  
   - **Domain:** Lógica de negocio pura (sin dependencias externas)
   - **Application:** Casos de uso que orquestan domain + ports
   - **Infrastructure:** Adaptadores concretos (PostgreSQL, Redis, Celery)
   - **API:** Controllers + DTOs (FastAPI)

2. **Dependency Inversion Principle**  
   - Domain define interfaces (`ports.py`)
   - Infrastructure implementa adaptadores
   - Fácil cambiar de Redis a Memcached sin tocar domain

3. **Feature Toggles**  
   - `CACHE_ENABLED=false` → Usa `DisabledCache` (no Redis)
   - `RISK_AUDIT_ENABLED=false` → Usa `DisabledRiskAudit` (no Celery)
   - Permite testing y desarrollo sin infraestructura completa

4. **Precision Decimal**  
   - Todo cálculo financiero usa `Decimal` (no `float`)
   - Redondeo controlado con `ROUND_HALF_UP`
   - Tests verifican totales exactos ($0.00 diferencia)

---

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```bash
# API
API_PORT=8105

# Database
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/creditsim
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secret
POSTGRES_DB=creditsim

# Redis (opcional)
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Feature Flags
CACHE_ENABLED=true
RISK_AUDIT_ENABLED=true

# Misc
ENV=development
LOG_LEVEL=INFO
```

---

## 🚦 Quick Start

### Opción 1: Docker (Recomendado)

```bash
# Desde la raíz del proyecto
cd creditsim

# Levantar todos los servicios
make up

# Ver logs
make logs

# Acceder a la API
open http://localhost:8105/docs
```

### Opción 2: Desarrollo Local

```bash
cd creditsim-api

# Crear entorno virtual
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Instalar dependencias
pip install -e ".[dev]"

# Compilar traducciones
pip install babel
pybabel compile -d locale -D messages

# Configurar .env
cp .env.example .env
# Editar DATABASE_URL, etc.

# Aplicar migraciones
alembic upgrade head

# Ejecutar servidor
uvicorn app.main:app --reload --port 8105
```

**URLs:**
- Swagger UI: http://localhost:8105/docs
- ReDoc: http://localhost:8105/redoc
- OpenAPI Spec: http://localhost:8105/openapi.json

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
pytest

# Con cobertura
pytest --cov=app --cov-report=term-missing

# Ejecutar test específico
pytest tests/test_simulate_endpoint.py -v

# Con Docker Compose
make test-compose
```

**Coverage actual:** ~92%

---

## 📡 Endpoints Principales

### 1. POST `/simulate` - Simular crédito

**Request:**
```json
{
  "principal": 100000,
  "term_months": 12,
  "annual_rate": 18.5,
  "borrower": "Juan Pérez"
}
```

**Response:**
```json
{
  "id": 1,
  "folio": "SIM-2026-00001",
  "principal": 100000,
  "term_months": 12,
  "annual_rate": 18.5,
  "borrower": "Juan Pérez",
  "schedule": [
    {
      "month": 1,
      "payment": 9168.37,
      "interest": 1541.67,
      "principal": 7626.70,
      "balance": 92373.30
    }
    // ...
  ],
  "totals": {
    "total_payment": 110020.44,
    "total_interest": 10020.44,
    "total_principal": 100000.00
  },
  "created_at": "2026-02-04T12:00:00Z"
}
```

### 2. POST `/simulations/{id}/verify` - Verificar simulación

Reproduce el cálculo y compara con el guardado para auditoría.

### 3. GET `/simulations` - Listar simulaciones

Query params: `?skip=0&limit=10&borrower=Juan`

### 4. POST `/benchmark/compare` - Comparar arquitecturas

Compara performance de:
- Full stack (cache + async audit)
- Cache only
- Minimal (sin optimizaciones)

---

## 🔄 Flujo de Auditoría Asíncrona

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB
    participant Redis
    participant Worker

    Client->>API: POST /simulate
    API->>DB: Guardar simulación
    API->>Redis: Encolar tarea audit
    API-->>Client: Response (< 200ms)
    
    Worker->>Redis: Consumir tarea
    Worker->>Worker: Mock 1-3s + 10% fail
    Worker->>DB: Actualizar audit_status
```

**Key Points:**
- Cliente recibe respuesta inmediata
- Auditoría se ejecuta en background
- Worker puede escalarse horizontalmente

---

## 🗄️ Migraciones de Base de Datos

```bash
# Crear nueva migración
alembic revision --autogenerate -m "descripción"

# Aplicar migraciones
alembic upgrade head

# Rollback
alembic downgrade -1

# Ver historial
alembic history
```

---

## 🌍 Internacionalización

```bash
# Extraer strings traducibles
pybabel extract -F babel.cfg -o locale/messages.pot .

# Actualizar traducciones
pybabel update -i locale/messages.pot -d locale

# Compilar (ya se hace en Dockerfile)
pybabel compile -d locale -D messages
```

**Idiomas soportados:** ES, EN

---

## 📦 Build & Deploy

### Docker Build

```bash
# Build imagen
docker build -t creditsim-api:latest .

# Multi-stage build optimizado
# - Stage 1 (builder): Instala deps + compila traducciones
# - Stage 2 (runtime): Solo runtime + código
```

### CI/CD

Ver `.github/workflows/`:
- `build.yml` - Build en push a develop
- `deploy.yml` - Deploy automático en push a main

---

## 🔒 Seguridad

- **No-root user** en Docker (usuario `appuser`)
- **SQL Injection:** Prevención con SQLAlchemy ORM
- **CORS:** Configurado en middleware
- **Secrets:** Gestionados con Doppler (nunca en código)

---

## 📚 Referencias

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 Tutorial](https://docs.sqlalchemy.org/en/20/)
- [Celery Best Practices](https://docs.celeryproject.org/en/stable/userguide/tasks.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Alembic Tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)

---

## 👤 Autor

**Irving Ayala**  
Backend Developer & DevOps Engineer

*Proyecto desarrollado como prueba técnica - Feb 2026*
