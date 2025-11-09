const pool = require('../config/db');
 
// --- Funções Públicas (GET) ---
 
exports.getMenu = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT mi.id, mi.nome, mi.descricao, mi.preco, c.nome as categoria
            FROM menu_item mi
            JOIN categoria c ON mi.categoria_id = c.id
            ORDER BY c.id, mi.id
        `);
 
        // Agrupar por categoria (como no JSON original)
        const menuAgrupado = rows.reduce((acc, item) => {
            const { categoria, ...rest } = item;
            if (!acc[categoria]) {
                acc[categoria] = [];
            }
            acc[categoria].push(rest);
            return acc;
        }, {});
 
        res.json(menuAgrupado);
    } catch (error) {
        console.error('Erro ao buscar menu:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
 
exports.getBanners = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, path, alt, title, subtitle FROM banner');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar banners:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
 
exports.getGallery = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, path, alt FROM galeria');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar galeria:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
 
// --- Funções Protegidas (CRUD Admin) ---
 
exports.addMenuItem = async (req, res) => {
    const { nome, descricao, preco, categoria_id } = req.body;
    if (!nome || !preco || !categoria_id) {
        return res.status(400).json({ message: 'Dados incompletos' });
    }
 
    try {
        const [result] = await pool.query(
            'INSERT INTO menu_item (nome, descricao, preco, categoria_id) VALUES (?, ?, ?, ?)',
            [nome, descricao, preco, categoria_id]
        );
        res.status(201).json({ id: result.insertId, message: 'Item adicionado com sucesso' });
    } catch (error) {
        console.error('Erro ao adicionar item do menu:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
 
exports.deleteMenuItem = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM menu_item WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }
        res.status(200).json({ message: 'Item excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir item do menu:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
 
// ... Adicionar funções para CRUD de banners e galeria
