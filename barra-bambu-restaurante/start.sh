#!/bin/bash
echo "🚀 Iniciando Barra Bambu Restaurante..."

# Iniciar MySQL (Ubuntu/Debian)
sudo service mysql start

# Abrir terminal para backend
gnome-terminal --tab --title="Backend" --command="bash -c 'cd backend && npm run dev; exec bash'"

# Aguardar backend iniciar
sleep 3

# Abrir terminal para frontend
gnome-terminal --tab --title="Frontend" --command="bash -c 'cd frontend && npm run dev; exec bash'"

# Abrir navegador
sleep 5
xdg-open http://localhost:5173

echo "✅ Sistema iniciado! Acesse:"
echo "   Frontend: http://localhost:5173"
echo "   Backend: http://localhost:5000"