# Deployment Documentation

Production deployment guides for CreditSim.

## Files

- **[GITHUB_SECRETS.md](GITHUB_SECRETS.md)** - Environment and secrets configuration

## Architecture

```
┌─────────────┐
│   GitHub    │  Push to main
│   Actions   │─────────────────┐
└─────────────┘                 │
                                ▼
                    ┌──────────────────────┐
                    │  Build Docker Images │
                    │  Push to GHCR        │
                    └──────────┬───────────┘
                               │
                               ▼
┌─────────────┐    ┌──────────────────────┐
│   Doppler   │───▶│  Deploy to Server    │
│  (Secrets)  │    │  SSH + Docker        │
└─────────────┘    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  creditsim.iayala.dev│
                    │  Nginx + Docker      │
                    └──────────────────────┘
```

## Deployment Flow

1. **Commit to `develop`:** Builds and pushes images to GHCR
2. **Merge to `main`:** Triggers full deployment
3. **GitHub Actions:**
   - Builds API + Frontend Docker images
   - Pushes to GitHub Container Registry
   - SSH to production server
   - Pulls images + restarts services
4. **Health Checks:** Validates deployment success

## Quick Setup

### First Time

1. **Server Setup:**
   ```bash
   ./scripts/setup-server.sh
   ```

2. **GitHub Environment:**
   - Create `production` environment
   - Add variables: `SSH_USER`, `SSH_HOST`, `SERVICE_DOMAIN`
   - Add secrets: `SSH_PRIVATE_KEY`, `DOPPLER_SERVICE_TOKEN`

3. **Doppler:**
   - Create project `creditsim`
   - Environment: `production`
   - Add database and Redis secrets

See [GITHUB_SECRETS.md](GITHUB_SECRETS.md) for detailed steps.

### Manual Deployment

```bash
# From local machine
./scripts/deploy.sh
```

## Services

- **API:** Port 8000 (internal), proxied via Nginx
- **Frontend:** Port 80/443 via Nginx (88/8443 Docker)
- **PostgreSQL:** Port 5432 (internal)
- **Redis:** Port 6379 (internal)
- **Celery Worker:** Background tasks

## Monitoring

```bash
# SSH to server
ssh ubuntu@18.221.67.173

# Check services
cd ~/creditsim && docker compose ps

# View logs
docker logs creditsim-api -f
docker logs creditsim-nginx -f

# Health check
curl http://localhost:88/api/health
```

## Troubleshooting

See [GITHUB_SECRETS.md](GITHUB_SECRETS.md#troubleshooting) for common issues.
