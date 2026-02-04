#!/bin/bash
set -e

# ============================================================================
# creditsim - Deploy Script (Simplificado)
# Usa compose.production.yml en lugar de generar el archivo dinámicamente
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables (con defaults)
SSH_USER="${SSH_USER:-ubuntu}"
SSH_HOST="${SSH_HOST:-localhost}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_rsa}"
SERVICE_TAG="${SERVICE_TAG:-latest}"
REGISTRY="${REGISTRY:-ghcr.io}"
IMAGE_OWNER="${IMAGE_OWNER:-$(git config user.name 2>/dev/null || echo 'iayala')}"

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   creditsim - Deploy                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}→ Target:${NC} ${SSH_USER}@${SSH_HOST}"
echo -e "${BLUE}→ Tag:${NC} ${SERVICE_TAG}"
echo -e "${BLUE}→ Registry:${NC} ${REGISTRY}/${IMAGE_OWNER}"
echo ""

# Copiar archivo compose al servidor
echo -e "${BLUE}[1/3]${NC} Copiando archivos de configuración..."
scp -i "$SSH_KEY" compose.production.yml ${SSH_USER}@${SSH_HOST}:~/creditsim/docker-compose.yml
echo -e "${GREEN}✓${NC} Archivos copiados"

# Desplegar
echo -e "${BLUE}[2/3]${NC} Desplegando en servidor..."
ssh -i "$SSH_KEY" ${SSH_USER}@${SSH_HOST} bash << ENDSSH
set -e
cd ~/creditsim

# Exportar variables para docker-compose
export REGISTRY="${REGISTRY}"
export IMAGE_OWNER="${IMAGE_OWNER}"
export SERVICE_TAG="${SERVICE_TAG}"

echo "→ Pulling images..."
docker compose pull

echo "→ Stopping old containers..."
docker compose down

echo "→ Starting new containers..."
docker compose up -d

echo "→ Waiting for services..."
sleep 10

echo "→ Service status:"
docker compose ps
ENDSSH

echo -e "${GREEN}✓${NC} Deployment completo"

# Health check
echo -e "${BLUE}[3/3]${NC} Health check..."
sleep 5
if curl -f -s "http://${SSH_HOST}:88/api/health" > /dev/null; then
  echo -e "${GREEN}✓${NC} API is healthy"
else
  echo -e "${RED}✗${NC} API health check failed (puede estar iniciando, verifica manualmente)"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       ✓ Deployment Successful! 🚀         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}URL:${NC} http://${SSH_HOST}:88"
echo -e "${BLUE}API Health:${NC} http://${SSH_HOST}:88/api/health"
echo ""
