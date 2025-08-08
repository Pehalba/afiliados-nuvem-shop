#!/bin/bash

echo "========================================"
echo "   DEPLOYMENT - PLATAFORMA AFILIADOS"
echo "========================================"
echo

echo "1. Verificando arquivos..."
if [ ! -f "index.html" ]; then
    echo "ERRO: index.html não encontrado!"
    exit 1
fi

if [ ! -f "css/style.css" ]; then
    echo "ERRO: css/style.css não encontrado!"
    exit 1
fi

if [ ! -f "js/main.js" ]; then
    echo "ERRO: js/main.js não encontrado!"
    exit 1
fi

echo "✅ Todos os arquivos principais encontrados!"
echo

echo "2. Iniciando servidor local..."
echo
echo "🌐 Acesse: http://localhost:8000"
echo "📱 Para parar o servidor: Ctrl+C"
echo

python3 -m http.server 8000
