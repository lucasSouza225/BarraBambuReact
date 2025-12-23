const bcrypt = require('bcryptjs');
const db = require('../config/database');
require('dotenv').config();

async function seedDatabase() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Criar admin
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    
    await db.query(`
      INSERT INTO admins (username, password) 
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE password = ?
    `, [process.env.ADMIN_USERNAME, hashedPassword, hashedPassword]);

    console.log('✅ Admin criado/atualizado');

    // Inserir categorias
    const categories = [
      { name: 'Bebidas alcoólicas', order: 1 },
      { name: 'Bebidas não alcoólicas', order: 2 },
      { name: 'Caipirinhas', order: 3 },
      { name: 'Carnes', order: 4 },
      { name: 'Peixes & Frutos do Mar', order: 5 },
      { name: 'Petiscos', order: 6 },
      { name: 'Pratos Executivos', order: 7 },
      { name: 'Sobremesas', order: 8 },
      { name: 'Drinks Tradicionais', order: 9 }
    ];

    for (const category of categories) {
      await db.query(`
        INSERT INTO categories (name, display_order) 
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE display_order = ?
      `, [category.name, category.order, category.order]);
    }

    console.log('✅ Categorias inseridas');

    // Inserir itens de exemplo
    const sampleItems = [
      {
        name: 'SMIRNOFF ICE',
        description: '',
        price: 45.00,
        category_id: 1
      },
      {
        name: 'ÁGUA MINERAL',
        description: 'Com ou sem gás',
        price: 8.00,
        category_id: 2
      },
      {
        name: 'CAIPIRINHA DE LIMÃO',
        description: 'Tradicional brasileira',
        price: 25.00,
        category_id: 3
      },
      {
        name: 'PICANHA NA CHAPA',
        description: 'Acompanha arroz, farofa e vinagrete',
        price: 89.90,
        category_id: 4
      },
      {
        name: 'SALMÃO GRELHADO',
        description: 'Com legumes salteados',
        price: 75.00,
        category_id: 5
      }
    ];

    for (const item of sampleItems) {
      await db.query(`
        INSERT INTO menu_items (name, description, price, category_id) 
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE price = ?
      `, [item.name, item.description, item.price, item.category_id, item.price]);
    }

    console.log('✅ Itens de exemplo inseridos');

    // Inserir banners de exemplo
    const sampleBanners = [
      {
        image_url: '/static/banner1.jpg',
        title: 'Salmão Grelhado',
        subtitle: 'Fresco e saboroso'
      },
      {
        image_url: '/static/banner2.jpg',
        title: 'Happy Hour',
        subtitle: 'Todos os dias das 17h às 19h'
      }
    ];

    for (const banner of sampleBanners) {
      await db.query(`
        INSERT INTO banners (image_url, title, subtitle) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE title = ?, subtitle = ?
      `, [banner.image_url, banner.title, banner.subtitle, banner.title, banner.subtitle]);
    }

    console.log('✅ Banners de exemplo inseridos');

    console.log('🎉 Seed completado com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    process.exit();
  }
}

seedDatabase();