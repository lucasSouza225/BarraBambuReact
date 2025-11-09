const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
 
// Middleware de Autenticação Simples (para rotas protegidas)
const authenticate = (req, res, next) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        next(); // Autenticado
    } else {
        res.status(401).json({ message: 'Não autorizado' });
    }
};
 
// --- Rotas Públicas (Frontend) ---
router.get('/menu', dataController.getMenu);
router.get('/banners', dataController.getBanners);
router.get('/gallery', dataController.getGallery);
 
// --- Rotas de Autenticação (Admin) ---
router.post('/login', authenticate, (req, res) => {
    // Se o middleware passar, o login é bem-sucedido
    res.status(200).json({ message: 'Login bem-sucedido' });
});
 
// --- Rotas Protegidas (Admin CRUD) ---
router.post('/admin/menu', authenticate, dataController.addMenuItem);
router.delete('/admin/menu/:id', authenticate, dataController.deleteMenuItem);
// ... Adicionar rotas para banners e galeria (POST/DELETE)
 
module.exports = router;
