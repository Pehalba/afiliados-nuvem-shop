@echo off
echo ========================================
echo    DEPLOYMENT - PLATAFORMA AFILIADOS
echo ========================================
echo.

echo 1. Verificando arquivos...
if not exist "index.html" (
    echo ERRO: index.html nao encontrado!
    pause
    exit /b 1
)

if not exist "css\style.css" (
    echo ERRO: css\style.css nao encontrado!
    pause
    exit /b 1
)

if not exist "js\main.js" (
    echo ERRO: js\main.js nao encontrado!
    pause
    exit /b 1
)

echo ✅ Todos os arquivos principais encontrados!
echo.

echo 2. Iniciando servidor local...
echo.
echo 🌐 Acesse: http://localhost:8000
echo 📱 Para parar o servidor: Ctrl+C
echo.

python -m http.server 8000

pause
