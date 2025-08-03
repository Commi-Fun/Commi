#!/bin/bash
set -e

# Cron-based backup scheduler for PostgreSQL database
# This script runs as a container and executes backups on schedule

# Install cron
apk add --no-cache dcron

# Create cron job
echo "${BACKUP_SCHEDULE} /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1" > /etc/crontabs/root

# Create log file
touch /var/log/backup.log

# Create the actual backup script
cat > /usr/local/bin/backup.sh << 'EOF'
#!/bin/bash
set -e

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATABASE="${POSTGRES_DB}"
HOST="postgres-prod"
PORT="5432"
USER="${POSTGRES_USER}"

mkdir -p "${BACKUP_DIR}/daily"

echo "[$(date)] Starting backup of database: ${DATABASE}"

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

gzip "${BACKUP_DIR}/daily/backup_${DATABASE}_${TIMESTAMP}.sql"

# Clean up old backups
find "${BACKUP_DIR}/daily" -name "backup_${DATABASE}_*.sql.gz" -mtime +${BACKUP_RETENTION_DAYS} -delete

echo "[$(date)] Backup completed: backup_${DATABASE}_${TIMESTAMP}.sql.gz"
EOF

chmod +x /usr/local/bin/backup.sh

# Start cron in foreground and tail logs
echo "Starting backup scheduler with schedule: ${BACKUP_SCHEDULE}"
crond -f -l 2 &
tail -f /var/log/backup.log