FROM python:3.10

ENV PYTHONBUFFERED=1

WORKDIR /django

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

CMD daphne --bind 0.0.0.0:8000 server.asgi:application 