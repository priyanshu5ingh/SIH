# Contributing to Ultimate 3D ULPIN System

Thank you for your interest in contributing to our project! Whether you're fixing a bug, adding a new feature, or improving documentation, we appreciate your help.

## How to Contribute

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/sih-ulpin-system.git
   ```
3. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature-or-fix-name
   ```
4. **Make your changes** and commit them with descriptive messages
5. **Push your changes** to your fork:
   ```bash
   git push origin feature-or-fix-name
   ```
6. **Submit a pull request** to the main repository's `main` branch

## Development Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL with PostGIS extension
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-username/sih-ulpin-system.git
cd sih-ulpin-system

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
python scripts/init_db.py

# Start the backend server
uvicorn backend.app.main:app --reload
```

### Frontend Setup
```bash
# In a new terminal window
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

## Code Style

- **Python**: Follow PEP 8 guidelines
- **JavaScript/React**: Follow Airbnb JavaScript style guide with React extensions
- **Commits**: Use conventional commits format (feat:, fix:, docs:, etc.)
- **Documentation**: Docstrings for functions and classes, JSDoc for JavaScript

## Reporting Issues

Please use the GitHub issue tracker to report bugs or request features. When reporting a bug, include:
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or error logs if applicable
- Environment details (OS, Python version, etc.)

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.