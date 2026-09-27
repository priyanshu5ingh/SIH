# Deployment Guide

## Overview
This document provides instructions for deploying the Ultimate 3D ULPIN Generation and Vertical Property Mapping System in various environments.

## Prerequisites
- Docker 20.10+ and Docker Compose 2.0+ (for containerized deployment)
- OR
- Python 3.9+, Node.js 16+, PostgreSQL 13+ with PostGIS 3.1+ (for manual deployment)
- Git
- Minimum 4GB RAM, 20GB disk space

## Deployment Options

### 1. Local Development (Docker Compose)
Recommended for development and testing.

#### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/sih-ulpin-system.git
   cd sih-ulpin-system
   ```

2. Copy environment template:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` file with your configuration:
   - Adjust database credentials if needed
   - Modify CORS origins if frontend will be on different port/domain
   - Set secret key for JWT tokens

4. Start the services:
   ```bash
   docker-compose up --build
   ```

5. Wait for containers to start (approximately 30-60 seconds):
   - Backend API: http://localhost:8000
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:8000/docs
   - Database: localhost:5432

6. Initialize database (first time only):
   ```bash
   docker-compose exec backend python scripts/init_db.py
   ```

7. To stop the services:
   ```bash
   docker-compose down
   ```

### 2. Production Deployment (Docker Swarm/Kubernetes)
For production environments requiring scaling and high availability.

#### Docker Swarm:
1. Initialize swarm (if not already):
   ```bash
   docker swarm init
   ```

2. Deploy stack:
   ```bash
   docker stack deploy -c docker-compose.yml sihulpin
   ```

3. Check services:
   ```bash
   docker service ls
   ```

4. To remove stack:
   ```bash
   docker stack remove sihulpin
   ```

#### Kubernetes:
1. Create namespace:
   ```bash
   kubectl create namespace sihulpin
   ```

2. Apply secrets:
   ```bash
   kubectl create secret generic db-secret \
     --from-literal=POSTGRES_USER=postgres \
     --from-literal=POSTGRES_PASSWORD=secure-password \
     --namespace sihulpin
   ```

3. Deploy using Helm or direct manifests:
   ```bash
   kubectl apply -f k8s/ -n sihulpin
   ```

4. Check status:
   ```bash
   kubectl get all -n sihulpin
   ```

### 3. Manual Deployment (Without Docker)
For environments where containerization is not preferred.

#### Backend Deployment:
1. Install Python dependencies:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Initialize database:
   ```bash
   python scripts/init_db.py
   ```

4. Start the server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

#### Frontend Deployment:
1. Install Node.js dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Set environment variable (create .env file):
   ```bash
   echo "REACT_APP_API_URL=http://your-backend-domain.com/api/v1" > .env
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Serve the build (using any static file server):
   ```bash
   npm install -g serve
   serve -s build -l 3000
   ```

#### Database Setup:
1. Install PostgreSQL with PostGIS extension:
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install postgresql postgresql-contrib postgis

   # CentOS/RHEL
   sudo yum install postgresql-server postgresql-contrib postgis

   # macOS (with Homebrew)
   brew install postgis
   ```

2. Create database and user:
   ```bash
   sudo -u postgres psql
   CREATE USER postgres WITH PASSWORD 'postgres';
   CREATE DATABASE sih_ulpin;
   GRANT ALL PRIVILEGES ON DATABASE sih_ulpin TO postgres;
   \c sih_ulpin
   CREATE EXTENSION postgis;
   \q
   ```

3. Update `.env` file with database credentials.

## Configuration

### Environment Variables
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| POSTGRES_SERVER | Database hostname | localhost | Yes |
| POSTGRES_PORT | Database port | 5432 | No |
| POSTGRES_USER | Database username | postgres | Yes |
| POSTGRES_PASSWORD | Database password | postgres | Yes |
| POSTGRES_DB | Database name | sih_ulpin | Yes |
| SECRET_KEY | JWT secret key | Randomly generated | Yes |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiration time | 480 (8 hours) | No |
| BACKEND_CORS_ORIGINS | Comma-separated list of allowed origins | "*" | No |
| DEBUG | Enable debug mode | False | No |

### Docker Compose Overrides
Create `docker-compose.override.yml` for environment-specific configurations:
```yaml
version: '3.8'

services:
  backend:
    environment:
      - DEBUG=true  # Enable debug mode in development
    volumes:
      - ./logs:/app/logs  # Mount logs directory

  frontend:
    environment:
      - REACT_APP_API_URL=http://localhost:8000/api/v1
```

## Scaling Considerations

### Horizontal Scaling (Backend)
- Run multiple backend instances behind a load balancer
- Use sticky sessions if WebSocket connections are implemented
- Ensure shared storage for file uploads (use S3, NFS, or similar)
- Database connection pooling is essential

### Database Scaling
- **Read Replicas**: Use PostgreSQL streaming replication for read-heavy workloads
- **Connection Pooling**: Use PgBouncer to manage database connections
- **Partitioning**: Partition large tables by date or geographic region
- **Caching**: Add Redis layer for frequently accessed data

### Frontend Scaling
- Serve static assets via CDN (Cloudflare, AWS CloudFront, etc.)
- Use HTTP caching headers effectively
- Implement service workers for offline capabilities (planned)

## Monitoring and Logging

### Logging
- Backend logs to stdout (captured by Docker)
- Frontend logs to browser console
- Configure log rotation for production
- Consider structured logging (JSON format) for log aggregation

### Metrics
- Prometheus metrics endpoint (planned)
- Health check endpoints:
  - `GET /health` - Basic liveness check
  - `GET /ready` - Readiness check (database connectivity, etc.)
- Business metrics: ULPINs generated, active parcels, etc.

### Health Checks
Include in load balancer or orchestration configurations:
```yaml
# Example for Docker Compose
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## Backup and Disaster Recovery

### Database Backups
```bash
# Logical backup (recommended for PostgreSQL)
pg_dump -U postgres -h localhost sih_ulpin > sih_ulpin_backup_$(date +%Y%m%d_%H%M%S).sql

# Or using Docker
docker-compose exec db pg_dump -U postgres sih_ulpin > backup.sql
```

### Restore Procedure
```bash
# Create database if not exists
createdb -U postgres sih_ulpin

# Restore from backup
psql -U postgres sih_ulpin < backup.sql

# Restore PostGIS extension (if needed)
psql -U postgres -d sih_ulpin -c "CREATE EXTENSION postgis;"
```

### File Backups
- Regular snapshots of uploads directory
- Version control for configuration files
- Consider cloud storage (S3, Google Cloud Storage) for production

## Security Considerations

### Network Security
- Use firewalls to restrict access to database port (5432)
- Enable HTTPS termination at load balancer or ingress
- Use VPN or private networks for inter-service communication
- Regular security scanning of container images

### Application Security
- Keep dependencies updated (use tools like Dependabot)
- Implement input validation and sanitization
- Use parameterized queries to prevent SQL injection
- Implement rate limiting and DDoS protection
- Regular security audits and penetration testing

### Data Protection
- Encrypt sensitive data at rest (consider PostgreSQL Transparent Data Encryption)
- Encrypt backups
- Implement data retention and deletion policies
- Regular security training for administrators

## Troubleshooting

### Common Issues

#### 1. Database Connection Failures
- Check if database container is running: `docker-compose ps`
- Verify database credentials in `.env`
- Check network connectivity: `docker-compose exec backend pg_isready -h db -U postgres`
- Ensure PostGIS extension is installed: `docker-compose exec db psql -U postgres -c "SELECT PostGIS_Version();"`

#### 2. Backend Startup Failures
- Check logs: `docker-compose logs backend`
- Verify Python dependencies are installed
- Check for syntax errors in configuration
- Ensure port 8000 is not already in use

#### 3. Frontend Cannot Connect to Backend
- Check backend is running and accessible
- Verify REACT_APP_API_URL in frontend build
- Check browser console for CORS errors
- Ensure backend CORS settings include frontend origin

#### 4. Performance Issues
- Monitor database queries: `docker-compose exec db pg_top`
- Check backend worker utilization
- Monitor memory and CPU usage
- Consider adding database indexes for frequent queries

### Logs Access
```bash
# Follow logs in real-time
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Get recent logs
docker-compose logs --tail=100 backend
```

## Version Updates

### Minor/Patch Updates
1. Pull latest changes:
   ```bash
   git pull origin main
   ```

2. Rebuild containers:
   ```bash
   docker-compose build
   ```

3. Restart services:
   ```bash
   docker-compose up -d
   ```

4. Run database migrations (if any):
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

### Major Updates
1. Review changelog and breaking changes
2. Backup data before updating
3. Test in staging environment first
4. Follow minor/patch update procedure
5. Verify functionality after update

## CI/CD Integration

### GitHub Actions Example
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.9'
        
    - name: Install backend dependencies
      run: |
        cd backend
        pip install -r requirements.txt
        
    - name: Run backend tests
      run: |
        cd backend
        python -m pytest
        
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm install
        
    - name: Run frontend tests
      run: |
        cd frontend
        npm test
        
    - name: Build Docker images
      run: |
        docker-compose build
        
    - name: Run containerized tests
      run: |
        docker-compose up -d
        sleep 30
        # Run integration tests here
        docker-compose down
```

## Support
For deployment issues or questions, please refer to:
- Troubleshooting section above
- Project documentation in `/docs`
- GitHub Issues: https://github.com/your-org/sih-ulpin-system/issues
- Contact the development team at sihulpin-dev@example.com