@echo off
echo Testing API endpoints...
echo.

echo 1. Health check:
curl -s http://localhost:3001/api/health
echo.
echo.

echo 2. Login:
curl -s -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@restaurante.com\",\"password\":\"admin123\"}"
echo.
echo.

echo 3. Sin auth (debe fallar con 401):
curl -s http://localhost:3001/api/usuarios
echo.

pause