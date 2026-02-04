# ---- builder ----
FROM python:3.11-slim AS builder

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN pip install --no-cache-dir -U pip

COPY pyproject.toml /app/pyproject.toml
COPY app /app/app
COPY locale /app/locale

RUN pip install --no-cache-dir .

# Compile translation catalogs (.po -> .mo)
RUN pip install --no-cache-dir babel && \
    pybabel compile -d locale -D messages

# ---- runtime ----
FROM python:3.11-slim AS runtime

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/home/appuser/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# Instalar curl para healthchecks y crear usuario NO root
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/* && \
    useradd -m appuser

# Copiar dependencias instaladas
COPY --from=builder /usr/local /usr/local

# Copiar código, migraciones y traducciones compiladas
COPY --chown=appuser:appuser app /app/app
COPY --chown=appuser:appuser alembic /app/alembic
COPY --chown=appuser:appuser alembic.ini /app/alembic.ini
COPY --from=builder --chown=appuser:appuser /app/locale /app/locale

# Cambiar a usuario no root
USER appuser

EXPOSE ${API_PORT:-8105}

CMD uvicorn app.main:app --host=0.0.0.0 --port=${API_PORT:-8105}
