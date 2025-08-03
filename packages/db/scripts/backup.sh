#!/bin/bash
set -e

# Backup script for PostgreSQL database
# This script creates timestamped backups of the production database

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATABASE="${POSTGRES_DB:-ai_airdrop_prod}"
HOST="${POSTGRES_HOST:-postgres-prod}"
PORT="${POSTGRES_PORT:-5432}"
USER="${POSTGRES_USER:-prod_user}"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}/daily"

# Perform backup
echo "Starting backup of database: ${DATABASE}"
PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
    -h "${HOST}" \
    -p "${PORT}" \
    -U "${USER}" \
    -d "${DATABASE}" \
    -f "${BACKUP_DIR}/daily/backup_${DATABASE}_${TIMESTAMP}.sql" \
    --verbose \
    --clean \
    --create \
    --if-exists

# Compress the backup
echo "Compressing backup..."
gzip "${BACKUP_DIR}/daily/backup_${DATABASE}_${TIMESTAMP}.sql"

# Remove old backups (keep last 7 days)
echo "Cleaning up old backups..."
find "${BACKUP_DIR}/daily" -name "backup_${DATABASE}_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_${DATABASE}_${TIMESTAMP}.sql.gz"