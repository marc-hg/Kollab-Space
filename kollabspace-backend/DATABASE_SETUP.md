# Database Setup Guide

## Overview
This project uses PostgreSQL for persistent storage and Redis for distributed message brokering (Phase 8 scaling).

---

## Quick Start

### 1. Start Database Services
```bash
# Start PostgreSQL and Redis
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 2. Stop Services
```bash
# Stop containers (keeps data)
docker-compose stop

# Stop and remove containers (keeps data in volumes)
docker-compose down

# Stop, remove containers AND delete all data
docker-compose down -v  # ⚠️ DANGER: Deletes all database data!
```

---

## Services Included

### PostgreSQL (Port 5432)
- **Image:** `postgres:16-alpine`
- **Database:** `kollabspace`
- **User:** `kollabspace_user`
- **Password:** `kollabspace_dev_password` (dev only!)
- **Data:** Persisted in Docker volume `postgres_data`

**Connection String:**
```
jdbc:postgresql://localhost:5432/kollabspace
```

### Redis (Port 6379)
- **Image:** `redis:7-alpine`
- **Password:** `kollabspace_redis_password` (dev only!)
- **Data:** Persisted in Docker volume `redis_data`
- **Use:** Distributed message broker for scaling

### pgAdmin (Port 5050) - Optional
Web-based database UI for managing PostgreSQL.

**To enable:**
```bash
docker-compose --profile tools up -d
```

**Access:** http://localhost:5050
- **Email:** admin@kollabspace.local
- **Password:** admin

**Add PostgreSQL server in pgAdmin:**
- Host: `postgres` (container name)
- Port: `5432`
- Database: `kollabspace`
- Username: `kollabspace_user`
- Password: `kollabspace_dev_password`

---

## Environment Variables

Create `.env` file in project root (already created, modify as needed):

```bash
# PostgreSQL
POSTGRES_DB=kollabspace
POSTGRES_USER=kollabspace_user
POSTGRES_PASSWORD=kollabspace_dev_password
POSTGRES_PORT=5432

# Redis
REDIS_PASSWORD=kollabspace_redis_password
REDIS_PORT=6379

# pgAdmin
PGADMIN_EMAIL=admin@kollabspace.local
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050
```

**⚠️ IMPORTANT:** Never commit `.env` to Git! It's already in `.gitignore`.

---

## Production Configuration

### For Production Deployment:

1. **Use Strong Passwords:**
```bash
POSTGRES_PASSWORD=<generate-strong-password>
REDIS_PASSWORD=<generate-strong-redis-password>
```

2. **Use Environment Variables from Cloud Provider:**
- AWS: Parameter Store or Secrets Manager
- Azure: Key Vault
- GCP: Secret Manager

3. **Managed Database (Recommended):**
- AWS RDS PostgreSQL
- Azure Database for PostgreSQL
- GCP Cloud SQL
- DigitalOcean Managed Databases

4. **Managed Redis (Recommended):**
- AWS ElastiCache
- Azure Cache for Redis
- GCP Memorystore
- Redis Cloud

---

## Connecting from Spring Boot

### Development (localhost)

`application-dev.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/kollabspace
spring.datasource.username=kollabspace_user
spring.datasource.password=kollabspace_dev_password
spring.jpa.hibernate.ddl-auto=update
```

### Production

`application-prod.properties`:
```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
```

---

## Useful Commands

### PostgreSQL

**Connect to PostgreSQL CLI:**
```bash
docker-compose exec postgres psql -U kollabspace_user -d kollabspace
```

**Run SQL file:**
```bash
docker-compose exec -T postgres psql -U kollabspace_user -d kollabspace < schema.sql
```

**Backup database:**
```bash
docker-compose exec -T postgres pg_dump -U kollabspace_user kollabspace > backup.sql
```

**Restore database:**
```bash
docker-compose exec -T postgres psql -U kollabspace_user -d kollabspace < backup.sql
```

### Redis

**Connect to Redis CLI:**
```bash
docker-compose exec redis redis-cli -a kollabspace_redis_password
```

**Check Redis keys:**
```bash
docker-compose exec redis redis-cli -a kollabspace_redis_password KEYS '*'
```

**Monitor Redis commands:**
```bash
docker-compose exec redis redis-cli -a kollabspace_redis_password MONITOR
```

---

## Troubleshooting

### Port Already in Use

**Check what's using the port:**
```bash
# macOS/Linux
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Stop conflicting service or change port in .env
```

### Can't Connect to Database

1. **Check if containers are running:**
```bash
docker-compose ps
```

2. **Check logs:**
```bash
docker-compose logs postgres
docker-compose logs redis
```

3. **Restart containers:**
```bash
docker-compose restart
```

### Data Corruption

**Reset everything (DELETES ALL DATA):**
```bash
docker-compose down -v
docker-compose up -d
```

### Permission Issues

**Linux only - fix volume permissions:**
```bash
sudo chown -R $(id -u):$(id -g) $(docker volume inspect kollabspace-backend_postgres_data -f '{{.Mountpoint}}')
```

---

## Data Persistence

All data is stored in Docker volumes:
- `postgres_data` - PostgreSQL database files
- `redis_data` - Redis persistence files
- `pgadmin_data` - pgAdmin configuration

**View volumes:**
```bash
docker volume ls | grep kollabspace
```

**Backup volumes:**
```bash
docker run --rm -v kollabspace-backend_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

---

## Health Checks

Both PostgreSQL and Redis have health checks configured:

**Check health status:**
```bash
docker-compose ps
```

**Healthy containers show:** `Up (healthy)`

**Manual health check:**
```bash
# PostgreSQL
docker-compose exec postgres pg_isready -U kollabspace_user

# Redis
docker-compose exec redis redis-cli -a kollabspace_redis_password ping
```

---

## Next Steps

After starting the database:

1. ✅ Uncomment JPA dependencies in `pom.xml`
2. ✅ Add JPA annotations to entities (Document, ChatMessage, DrawingStroke)
3. ✅ Create JPA repository implementations
4. ✅ Update `application.properties` with database config
5. ✅ Run Spring Boot application
6. ✅ Verify tables are created automatically

---

## Reference

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Redis Docs: https://redis.io/docs/
- Spring Data JPA: https://spring.io/projects/spring-data-jpa
- Docker Compose: https://docs.docker.com/compose/