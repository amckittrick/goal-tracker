FROM python:3.13-slim
WORKDIR /usr/src/app
COPY requirements.txt backend/requirements.txt
RUN pip install -r backend/requirements.txt
COPY . backend
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0"]