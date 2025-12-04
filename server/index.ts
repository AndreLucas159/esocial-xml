import express from 'express';
import cors from 'cors';
import routes from './routes';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas existentes (XML)
app.use('/api', routes);

// Novas rotas (API REST)
app.use('/api/v1', apiRoutes);

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`📡 API REST: http://localhost:${PORT}/api/v1`);
    console.log(`📄 API XML: http://localhost:${PORT}/api`);
});
