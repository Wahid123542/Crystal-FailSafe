# Crystal FailSafe - Backend API

Django REST Framework backend for the Crystal FailSafe IT Support Ticketing System.

## 🎯 Overview

This backend provides:
- RESTful API for frontend
- Email monitoring (IMAP)
- AI-powered ticket classification
- User authentication
- Database management
- Email sending capabilities

## 🛠️ Tech Stack

- **Django 4.2** - Web framework
- **Django REST Framework** - API
- **PostgreSQL 14+** - Database
- **Python 3.10+** - Language
- **IMAPClient** - Email monitoring
- **Claude AI / OpenAI** - Ticket classification
- **python-decouple** - Environment variables

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL 14+
- Gmail account (for development)
- Claude API key or OpenAI API key

### Installation

1. **Create backend folder:**
```bash
cd crystal-FailSafe
mkdir backend
cd backend
```

2. **Create virtual environment:**
```bash
# Mac/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

3. **Install Django:**
```bash
pip install django djangorestframework django-cors-headers
pip install psycopg2-binary python-decouple
pip install imapclient
pip install anthropic  # For Claude
# OR
pip install openai     # For OpenAI
```

4. **Create Django project:**
```bash
django-admin startproject config .
```

5. **Create apps:**
```bash
python manage.py startapp tickets
python manage.py startapp emails
python manage.py startapp chatbot
python manage.py startapp users
```

## 📁 Project Structure
```
backend/
├── config/
│   ├── __init__.py
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL config
│   └── wsgi.py
├── tickets/
│   ├── models.py            # Ticket, TicketNote
│   ├── serializers.py       # DRF serializers
│   ├── views.py             # API views
│   └── urls.py
├── emails/
│   ├── models.py            # EmailLog
│   ├── email_monitor.py     # IMAP monitoring
│   └── views.py
├── chatbot/
│   ├── ai_service.py        # Claude/OpenAI
│   ├── views.py             # Chatbot endpoints
│   └── urls.py
├── users/
│   ├── models.py            # CustomUser
│   ├── serializers.py
│   ├── views.py             # Auth endpoints
│   └── urls.py
├── manage.py
├── requirements.txt
├── .env                     # Create this
└── README.md                # This file
```

## 🔧 Configuration

### 1. PostgreSQL Setup

**Install PostgreSQL:**
```bash
# Mac
brew install postgresql

# Ubuntu/Debian  
sudo apt-get install postgresql

# Windows
# Download from postgresql.org
```

**Create database:**
```bash
psql postgres
CREATE DATABASE crystal_failsafe;
CREATE USER failsafe_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE crystal_failsafe TO failsafe_user;
\q
```

### 2. Environment Variables

Create `.env` file in backend root:
```env
# Django
SECRET_KEY=your-django-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=crystal_failsafe
DB_USER=failsafe_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Email (Gmail for dev)
EMAIL_HOST=imap.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_SUPPORT=itsupport@crystalbridges.org

# AI (choose one)
CLAUDE_API_KEY=your-claude-api-key
# OR
OPENAI_API_KEY=your-openai-api-key

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 3. Update settings.py
```python
from decouple import config

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)

INSTALLED_APPS = [
    # Django defaults...
    'rest_framework',
    'corsheaders',
    'tickets',
    'emails',
    'chatbot',
    'users',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
    }
}
```

## 📊 Database Models

### Ticket Model
```python
class Ticket(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    subject = models.CharField(max_length=255)
    sender_email = models.EmailField()
    description = models.TextField()
    category = models.CharField(max_length=50)
    priority = models.CharField(max_length=50)
    status = models.CharField(max_length=50, default='new')
    assigned_to = models.ForeignKey(User, null=True)
    original_email_body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### CustomUser Model
```python
class CustomUser(AbstractUser):
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100)
    is_approved = models.BooleanField(default=False)
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login/          # Login
POST   /api/auth/signup/         # Request access
POST   /api/auth/logout/         # Logout
GET    /api/auth/user/           # Current user
GET    /api/auth/pending/        # Pending approvals
POST   /api/auth/approve/:id/    # Approve user
```

### Tickets
```
GET    /api/tickets/             # List all
POST   /api/tickets/             # Create
GET    /api/tickets/:id/         # Get one
PATCH  /api/tickets/:id/         # Update
DELETE /api/tickets/:id/         # Delete
POST   /api/tickets/:id/reply/   # Send reply
```

### Analytics
```
GET    /api/analytics/stats/     # Statistics
GET    /api/analytics/trends/    # Trend data
```

### Chatbot
```
POST   /api/chatbot/search/      # Search tickets
POST   /api/chatbot/chat/        # Chat with AI
```

## 📧 Email Monitoring

### Gmail App Password Setup

1. Enable 2FA in Google Account
2. Generate App Password
3. Add to `.env` file

### Monitor Service
```python
# emails/email_monitor.py
import imapclient

def monitor_inbox():
    client = imapclient.IMAPClient('imap.gmail.com', ssl=True)
    client.login(EMAIL_USER, EMAIL_PASSWORD)
    client.select_folder('INBOX')
    
    messages = client.search(['UNSEEN'])
    for uid in messages:
        # Process email
        # Create ticket
        pass
```

## 🤖 AI Integration

### Claude Example
```python
import anthropic

def classify_ticket(email_body):
    client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)
    
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Classify this IT ticket: {email_body}"
        }]
    )
    
    return parse_response(message.content)
```

## 🏃 Running the Backend

### Development
```bash
# Activate venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs on: **http://localhost:8000**

### Admin Panel
Access at: **http://localhost:8000/admin**

## 📦 Dependencies

**requirements.txt:**
```txt
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
psycopg2-binary==2.9.9
python-decouple==3.8
imapclient==2.3.1
anthropic==0.7.0
```

Install all:
```bash
pip install -r requirements.txt
```

## 🧪 Testing
```bash
# Run tests
python manage.py test

# Specific app
python manage.py test tickets

# With coverage
pip install coverage
coverage run manage.py test
coverage report
```

## 🚀 Deployment

### Heroku
```bash
# Install Heroku CLI
# Create Procfile
web: gunicorn config.wsgi

# Deploy
heroku create crystal-failsafe-api
git push heroku main
heroku run python manage.py migrate
```

### Railway/Render

Similar process - check their docs.

## 📝 Next Steps

1. ✅ Set up Django project
2. ✅ Configure PostgreSQL
3. ✅ Create models
4. ✅ Build API endpoints
5. ✅ Implement email monitoring
6. ✅ Integrate AI classification
7. ✅ Add authentication
8. ✅ Test with frontend
9. ✅ Deploy

## 👨‍💻 Development Notes

- Use Django REST Framework serializers
- Implement proper error handling
- Add logging for debugging
- Write tests for critical functions
- Document all API endpoints

## 📞 Support

Questions about the backend?
- Check main [README](../README.md)
- Django docs: https://docs.djangoproject.com
- DRF docs: https://www.django-rest-framework.org

---

**Backend Status:** 🚧 To Be Built

**Timeline:** 2-3 weeks#Backend files 
