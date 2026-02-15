# FastAPI Backend

## Setup
1. Create a PostgreSQL database.
2. Copy `.env.example` to `.env` and set values.
3. Create venv, install deps, run:

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 4002
```

API base: `http://localhost:4002/api`
