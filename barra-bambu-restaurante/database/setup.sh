#!/bin/bash

echo "🔧 Configurando banco de dados Barra Bambu..."

# Verificar se MySQL está instalado
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL não encontrado. Instale o MySQL primeiro."
    exit 1
fi

# Solicitar senha do MySQL
echo -n "🔐 Digite a senha do MySQL (root): "
read -s mysql_password
echo

# Executar script SQL
echo "📦 Criando banco de dados e tabelas..."
mysql -u root -p$mysql_password < schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Banco de dados criado com sucesso!"
    echo ""
    echo "📊 Estrutura criada:"
    echo "   - admins (administradores)"
    echo "   - categories (categorias)"
    echo "   - menu_items (itens do cardápio)"
    echo "   - banners (carrossel)"
    echo "   - gallery (galeria)"
    echo "   - reservations (reservas)"
    echo "   - orders (pedidos)"
    echo "   - settings (configurações)"
    echo ""
    echo "🔑 Admin padrão:"
    echo "   Usuário: bambuAdmin"
    echo "   Senha: 123456"
    echo ""
    echo "🚀 Próximo passo:"
    echo "   1. cd ../backend"
    echo "   2. npm run seed (para dados iniciais)"
    echo "   3. npm run dev (para iniciar API)"
else
    echo "❌ Erro ao criar banco de dados."
    exit 1
fi