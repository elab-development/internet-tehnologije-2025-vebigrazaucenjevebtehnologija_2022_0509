#!/bin/bash

# Čekamo malo da se Postgres kontejner skroz digne
echo "Čekam bazu podataka..."
sleep 3

# 1. Prvo nivoi
echo "Punim bazu nivoima (seed_levels)..."
uv run python -m app.scripts.seed_levels

# 2. Onda admin korisnik
echo "Pravim admin korisnika (create_admin)..."
uv run python -m app.scripts.create_admin

# 3. Na kraju palimo FastAPI
echo "Sve je spremno! Pokrećem FastAPI server..."
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000