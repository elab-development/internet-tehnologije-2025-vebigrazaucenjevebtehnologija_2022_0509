FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY . .

# Dajemo dozvolu za izvršavanje skripte
RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD ["./entrypoint.sh"]