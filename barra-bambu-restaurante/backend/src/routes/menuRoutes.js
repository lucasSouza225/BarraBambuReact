const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

// GET todas as categorias
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.query(
      'SELECT * FROM categories ORDER BY display_order'
    );
    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// GET todos os itens com categorias
router.get('/items', async (req, res) => {
  try {
    const [items] = await db.query(`
      SELECT m.*, c.name as category_name 
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE m.is_available = 1
      ORDER BY c.display_order, m.display_order
    `);
    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ error: 'Erro ao buscar itens do menu' });
  }
});

// GET itens por categoria
router.get('/category/:categoryId', async (req, res) => {
  try {
    const [items] = await db.query(`
      SELECT m.*, c.name as category_name 
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE m.category_id = ? AND m.is_available = 1
      ORDER BY m.display_order
    `, [req.params.categoryId]);
    
    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar itens por categoria:', error);
    res.status(500).json({ error: 'Erro ao buscar itens' });
  }
});

// GET item específico
router.get('/item/:id', async (req, res) => {
  try {
    const [items] = await db.query(
      'SELECT * FROM menu_items WHERE id = ?',
      [req.params.id]
    );
    
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    res.json(items[0]);
  } catch (error) {
    console.error('Erro ao buscar item:', error);
    res.status(500).json({ error: 'Erro ao buscar item' });
  }
});

// POST criar novo item (admin)
router.post('/item', authenticateToken, isAdmin, [
  body('name').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  body('category_id').isInt()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, category_id, image_url } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO menu_items 
       (name, description, price, category_id, image_url) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, description || '', price, category_id, image_url || null]
    );

    res.status(201).json({
      message: 'Item criado com sucesso',
      id: result.insertId,
      item: { id: result.insertId, name, description, price, category_id, image_url }
    });
  } catch (error) {
    console.error('Erro ao criar item:', error);
    res.status(500).json({ error: 'Erro ao criar item' });
  }
});

// PUT atualizar item (admin)
router.put('/item/:id', authenticateToken, isAdmin, async (req, res) => {
  const { name, description, price, category_id, image_url, is_available } = req.body;
  
  try {
    const [result] = await db.query(
      `UPDATE menu_items 
       SET name = ?, description = ?, price = ?, category_id = ?, 
           image_url = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, description, price, category_id, image_url, is_available, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    res.json({ message: 'Item atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
});

// DELETE item (admin)
router.delete('/item/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM menu_items WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    res.json({ message: 'Item excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir item:', error);
    res.status(500).json({ error: 'Erro ao excluir item' });
  }
});

module.exports = router;