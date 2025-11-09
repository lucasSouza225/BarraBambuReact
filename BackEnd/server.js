const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
require('dotenv').config();
 
const app = express();
const PORT = process.env.PORT || 3001;
 
// Middlewares
app.use(cors());
app.use(express.json());
 
// Rotas da API
app.use('/api', apiRoutes);
 
// Rota de Teste
app.get('/', (req, res) => {
    res.send('API do Barra Bambu está rodando!');
});
 
// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
