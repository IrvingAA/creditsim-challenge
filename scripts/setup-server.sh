#!/bin/bash
set -e

# ============================================================================
# creditsim - Server Initial Setup
# Prepara el servidor para recibir deployments automáticos
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   creditsim - Server Setup                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Verificar que estamos en el servidor
if [ ! -f "/etc/lsb-release" ]; then
    echo -e "${RED}✗ Este script debe ejecutarse en el servidor Ubuntu${NC}"
    exit 1
fi

echo -e "${BLUE}[1/6]${NC} Actualizando sistema..."
sudo apt update -qq
sudo apt upgrade -y -qq

echo -e "${BLUE}[2/6]${NC} Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
    sudo sh /tmp/get-docker.sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✓${NC} Docker instalado"
else
    echo -e "${YELLOW}→${NC} Docker ya está instalado"
fi

echo -e "${BLUE}[3/6]${NC} Instalando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
    sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✓${NC} Docker Compose instalado"
else
    echo -e "${YELLOW}→${NC} Docker Compose ya está instalado"
fi

echo -e "${BLUE}[4/6]${NC} Configurando firewall..."
sudo ufw status | grep -q "Status: active" || sudo ufw --force enable
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 88/tcp   # Custom nginx port
echo -e "${GREEN}✓${NC} Firewall configurado"

echo -e "${BLUE}[5/6]${NC} Creando directorios..."
mkdir -p ~/creditsim
mkdir -p ~/backups
echo -e "${GREEN}✓${NC} Directorios creados"

echo -e "${BLUE}[6/6]${NC} Instalando utilidades..."
sudo apt install -y curl wget git vim htop certbot -qq
echo -e "${GREEN}✓${NC} Utilidades instaladas"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       ✓ Server Setup Completo! 🚀         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Pasos siguientes:${NC}"
echo "1. Logout y login de nuevo para aplicar grupo docker:"
echo "   exit"
echo ""
echo "2. Configurar SSH key para deployment:"
echo "   ssh-copy-id -i ~/.ssh/deploy_key.pub $(whoami)@$(hostname -I | awk '{print $1}')"
echo ""
echo "3. Configurar secrets en GitHub Actions"
echo "   - Ver docs/GITHUB_SECRETS.md"
echo ""
echo -e "${BLUE}Versiones instaladas:${NC}"
docker --version
docker-compose --version
echo ""
