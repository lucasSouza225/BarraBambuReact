const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Dashboard stats
router.get('/dashboard', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Estatísticas
    const [menuCount] = await db.query('SELECT COUNT(*) as count FROM menu_items');
    const [categoryCount] = await db.query('SELECT COUNT(*) as count FROM categories');
    const [bannerCount] = await db.query('SELECT COUNT(*) as count FROM banners');
    const [galleryCount] = await db.query('SELECT COUNT(*) as count FROM gallery');
    const [reservationCount] = await db.query('SELECT COUNT(*) as count FROM reservations');
    const [orderCount] = await db.query('SELECT COUNT(*) as count FROM orders');

    res.json({
      stats: {
        menuItems: menuCount[0].count,
        categories: categoryCount[0].count,
        banners: bannerCount[0].count,
        galleryItems: galleryCount[0].count,
        reservations: reservationCount[0].count,
        orders: orderCount[0].count
      },
      recentActivity: {
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro no dashboard:', error);
    res.status(500).json({ error: 'Erro ao carregar dashboard' });
  }
});

module.exports = router;