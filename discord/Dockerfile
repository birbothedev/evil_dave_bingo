# Use a Python base image. 'slim-bookworm' is usually good for smaller size.
FROM python:3.13.1-slim


ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1


WORKDIR /discord

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python main.py"]