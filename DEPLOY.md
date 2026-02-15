# Deployment Guide / Інструкція з деплою

## Quick Start (English)

### Option 1: Deploy Frontend to Vercel (Free)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/freelance-marketplace.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Click "Add New..." → "Project"
   - Import your repository
   - In "Environment Variables", add:
     - `NEXT_PUBLIC_API_FASTAPI_BASE` = your FastAPI backend URL
     - `NEXT_PUBLIC_API_NEST_BASE` = your NestJS backend URL  
     - `NEXT_PUBLIC_API_MODE` = `fastapi`
   - Click "Deploy"

### Option 2: Deploy Backend to Render (Free)

1. **Deploy FastAPI**
   - Go to https://render.com
   - Sign up → "New" → "Web Service"
   - Connect your GitHub repo (backend-fastapi folder)
   - Settings:
     - Root Directory: `backend-fastapi`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Set Environment Variables:
     - `DATABASE_URL` = your PostgreSQL URL
     - `SECRET_KEY` = your secret key
   - Click "Create Web Service"

2. **Deploy NestJS (optional)**
   - Same steps as FastAPI
   - Root Directory: `backend-nest`
   - Build Command: `npm install`
   - Start Command: `npm run start:prod`

### Option 3: Full Stack with Docker

Use the included docker-compose.yml:

```bash
# Build and run
docker-compose up -d

# Or deploy to any VPS
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

---

## Швидкий старт (Українська)

### Варіант 1: Деплой фронтенду на Vercel (безкоштовно)

1. **Завантажте код на GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Створіть репозиторій на GitHub, потім:
   git remote add origin https://github.com/YOUR_USERNAME/freelance-marketplace.git
   git push -u origin main
   ```

2. **Деплой на Vercel**
   - Перейдіть на https://vercel.com
   - Зареєструйтесь через GitHub
   - Натисніть "Add New..." → "Project"
   - Імпортуйте ваш репозиторій
   - У "Environment Variables" додайте:
     - `NEXT_PUBLIC_API_FASTAPI_BASE` = URL вашого FastAPI бекенду
     - `NEXT_PUBLIC_API_NEST_BASE` = URL вашого NestJS бекенду
     - `NEXT_PUBLIC_API_MODE` = `fastapi`
   - Натисніть "Deploy"

### Варіант 2: Деплой бекенду на Render (безкоштовно)

1. **Деплой FastAPI**
   - Перейдіть на https://render.com
   - Зареєструйтесь → "New" → "Web Service"
   - Підключіть ваш GitHub репозиторій (папка backend-fastapi)
   - Налаштування:
     - Root Directory: `backend-fastapi`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Встановіть змінні середовища:
     - `DATABASE_URL` = ваш PostgreSQL URL
     - `SECRET_KEY` = ваш секретний ключ
   - Натисніть "Create Web Service"

### Варіант 3: Повний стек з Docker

Використайте включений docker-compose.yml:

```bash
# Збірка та запуск
docker-compose up -d

# Або деплой на будь-який VPS
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

---

## Demo Mode

The application includes a demo mode for the admin panel:
- Username: `admin`
- Password: (any)

This allows testing the admin interface without a backend.

## API Endpoints

### FastAPI (Primary)
- Base URL: `https://your-fastapi-backend.onrender.com/api`
- Auth: `/auth/login`, `/auth/register`
- Users: `/users`, `/users/{id}`
- Projects: `/projects`, `/projects/{id}`
- Freelancers: `/freelancers`, `/freelancers/{id}`

### NestJS (Secondary)
- Base URL: `https://your-nestjs-backend.onrender.com/api`
- Similar endpoints

---

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure your backend allows requests from your Vercel domain:
```python
# FastAPI
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Database Connection
Make sure your `DATABASE_URL` is correct and the database is accessible from the hosting platform.

### Environment Variables
All required variables:
- `NEXT_PUBLIC_API_FASTAPI_BASE` - FastAPI backend URL (required)
- `NEXT_PUBLIC_API_NEST_BASE` - NestJS backend URL (optional)
- `NEXT_PUBLIC_API_MODE` - Which API to use: "fastapi", "nest", or "auto"
