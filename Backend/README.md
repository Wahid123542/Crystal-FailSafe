# Crystal FailSafe - Backend

Django REST API for Crystal FailSafe IT ticketing system.

## 🛠️ Tech Stack

- Django 4.2
- Django REST Framework
- PostgreSQL 14+
- Claude AI / OpenAI
- IMAPClient (email monitoring)
- Python 3.10+

## 🚀 Quick Start
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install Django
pip install django djangorestframework django-cors-headers
pip install psycopg2-binary python-decouple imapclient anthropic

# Create project
django-admin startproject config .
python manage.py startapp tickets
python manage.py startapp emails
python manage.py startapp chatbot
python manage.py startapp users

# Setup database (see below)
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
# Open http://localhost:8000
```

## 📁 Structure
```
backend/
├── config/           # Django settings
├── tickets/          # Ticket models & API
├── emails/           # Email monitoring
├── chatbot/          # AI integration
├── users/            # Authentication
├── manage.py
├── requirements.txt
└── .env             # Create this
```

## 🔧 Configuration

### PostgreSQL Setup
```bash
psql postgres
CREATE DATABASE crystal_failsafe;
CREATE USER failsafe_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE crystal_failsafe TO failsafe_user;
\q
```

### .env File
```env
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=crystal_failsafe
DB_USER=failsafe_user
DB_PASSWORD=your_password
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLAUDE_API_KEY=your-claude-key
```

### settings.py
```python
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'corsheaders',
    'tickets',
    'emails',
    'chatbot',
    'users',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
```

## 🔌 API Endpoints
```
POST   /api/auth/login/
POST   /api/auth/signup/
GET    /api/tickets/
PATCH  /api/tickets/:id/
POST   /api/tickets/:id/reply/
GET    /api/analytics/stats/
POST   /api/chatbot/search/
```

## 📊 Models
```python
class Ticket(models.Model):
    subject = models.CharField(max_length=255)
    sender_email = models.EmailField()
    description = models.TextField()
    category = models.CharField(max_length=50)
    priority = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    assigned_to = models.ForeignKey(User, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

## 📦 Requirements
```txt
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
psycopg2-binary==2.9.9
python-decouple==3.8
imapclient==2.3.1
anthropic==0.7.0
```

## 👨‍💻 Author

**Wahid** - University of Arkansas
- Django REST API with AI integration
- PostgreSQL database design

---

**Status:** 🚧 To Be Built (2-3 weeks)
