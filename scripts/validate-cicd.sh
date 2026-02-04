#!/bin/bash
# Validador rápido de configuración CI/CD

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}CI/CD Configuration Check${NC}\n"

ERRORS=0
WARNINGS=0

# Archivos necesarios
for file in .env.example .github/workflows/deploy.yml scripts/deploy.sh scripts/setup-server.sh; do
  if [ -f "$file" ]; then
    echo -e "  ${GREEN}✓${NC} $file"
  else
    echo -e "  ${RED}✗${NC} $file"
    ((ERRORS++))
  fi
done

echo ""

# Variables en .env.example
for var in DATABASE_URL REDIS_URL SERVICE_DOMAIN SSH_HOST; do
  if grep -q "^$var=" .env.example 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} $var"
  else
    echo -e "  ${YELLOW}⚠${NC} $var"
    ((WARNINGS++))
  fi
done

echo ""

# SSH connectivity
SSH_HOST=${SSH_HOST:-18.221.67.173}
SSH_USER=${SSH_USER:-ubuntu}
SSH_KEY=${SSH_KEY:-$HOME/.ssh/astrohub-dev-lightsail.pem}

if [ -f "$SSH_KEY" ] && timeout 5 ssh -i "$SSH_KEY" -o ConnectTimeout=5 -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST} "echo ok" &>/dev/null; then
  echo -e "  ${GREEN}✓${NC} SSH connection to ${SSH_HOST}"
else
  echo -e "  ${YELLOW}⚠${NC} SSH connection (optional)"
  ((WARNINGS++))
fi

echo ""

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ Ready for deployment!${NC}"
  [ $WARNINGS -gt 0 ] && echo -e "${YELLOW}⚠ $WARNINGS warnings (non-critical)${NC}"
  exit 0
else
  echo -e "${RED}✗ $ERRORS errors found${NC}"
  exit 1
fi

