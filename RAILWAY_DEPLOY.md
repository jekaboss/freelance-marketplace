# Розгортання на Railway

## Крок 1: Зареєструватися на Railway
1. Перейти на https://railway.app
2. Натиснути "Sign Up"
3. Ввійти через GitHub

## Крок 2: Розгорнути PostgreSQL базу

1. На Railway Dashboard натиснути **"+ New"**
2. Вибрати **"Database"** → **"PostgreSQL"**
3. Railway автоматично створить базу
4. Натиснути на створену базу і копіювати `DATABASE_URL` з змінних

Приклад:
```
postgresql://user:password@host:5432/database
```

## Крок 3: Розгорнути FastAPI Backend

### Варіант A: Через Git (рекомендується)
1. На Railway натиснути **"+ New"** → **"GitHub Repo"**
2. Виберіть репо `jekaboss/freelance-marketplace`
3. Залиште поле пусте (Railway автоматично виявить Dockerfile)
4. Натиснути **"Deploy"**

### Варіант B: Через CLI
```bash
# Встановити Railway CLI
npm i -g @railway/cli

# Увійти
railway login

# Перейти в папку backend
cd backend-fastapi

# Ініціалізувати проект
railway init

# Розгорнути
railway up
```

## Крок 4: Налаштувати Environment Variables на Railway

На Railway Dashboard для Backend сервісу додайте:

```
PORT=4002
JWT_SECRET=ваш_секретний_ключ_тут
JWT_EXPIRES_MINUTES=10080
```

`DATABASE_URL` Railway автоматично підтягне з PostgreSQL сервісу.

## Крок 5: Отримати Production URL Backend

1. На Railway Dashboard натиснути на Backend сервіс
2. Перейти на вкладку **"Settings"**
3. Скопіювати **"Public URL"** (щось типу: `https://freelance-backend-production-xxx.railway.app`)

## Крок 6: Налаштувати Vercel

1. Перейти на Vercel Dashboard → Project Settings
2. Перейти на **"Environment Variables"**
3. Додайте:
   - **Name:** `NEXT_PUBLIC_API_FASTAPI_BASE`
   - **Value:** `https://ваш-railway-url/api` (без зайвого слеша)
   - **Environments:** Production
4. Натиснути **"Save"**
5. На Vercel натиснути **"Deployments"** → Перегорнути останній deploy

## Крок 7: Запустити міграції на Railway (якщо потрібно)

```bash
# Локально перевірити міграції
cd backend-fastapi
python -m alembic upgrade head
```

## Перевірка

1. Перейти на https://ваш-vercel-url/login
2. Спробувати увійти
3. Якщо помилка, перевіртіть:
   - Railway Backend запущений (Dashboard → Logs)
   - PostgreSQL та Backend пов'язані через DATABASE_URL
   - NEXT_PUBLIC_API_FASTAPI_BASE встановлена на Vercel

## Корисні команди Railway CLI

```bash
# Логи backend
railway logs

# Список сервісів у проекті
railway services

# Налаштування змінних
railway variables
```

## Допомога

Якщо виникають проблеми з підключенням до БД на Railway:
- Перевірте DATABASE_URL форму (має бути `postgresql://...`)
- Убедитесь що PostgreSQL сервіс запущений
- Спробуйте перезавантажити Backend сервісе на Railway
