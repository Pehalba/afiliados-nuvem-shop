@echo off
echo ========================================
echo    UPLOAD PARA GITHUB
echo ========================================
echo.

echo 1. Adicionando todos os arquivos...
git add -A

echo.
echo 2. Fazendo commit...
git commit -m "Primeira versão da plataforma de afiliados - Nuvemshop"

echo.
echo 3. Enviando para o GitHub...
git push -u origin main

echo.
echo ✅ Upload concluído!
echo 🌐 Acesse: https://github.com/Pehalba/afiliados-nuvem-shop
echo.

pause
