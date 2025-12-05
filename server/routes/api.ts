import express from 'express';
import { AuthController } from '../controllers/authController';
import { EmpregadorController } from '../controllers/empregadorController';
import { TrabalhadorController } from '../controllers/trabalhadorController';
import { FolhaController } from '../controllers/folhaController';
import { EventoController } from '../controllers/eventoController';
import { DashboardController } from '../controllers/dashboardController';
import { EventGenerationController } from '../controllers/eventGenerationController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// =====================================================
// ROTAS PÚBLICAS (Sem autenticação)
// =====================================================

// Autenticação
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/verify', AuthController.verifyToken);

// =====================================================
// ROTAS PROTEGIDAS (Requerem autenticação)
// =====================================================

// Empregadores
router.get('/empregadores', authMiddleware, EmpregadorController.list);
router.get('/empregadores/:id', authMiddleware, EmpregadorController.getById);
router.post('/empregadores', authMiddleware, EmpregadorController.create);
router.put('/empregadores/:id', authMiddleware, EmpregadorController.update);
router.delete('/empregadores/:id', authMiddleware, EmpregadorController.delete);

// Trabalhadores
router.get('/empregadores/:empregadorId/trabalhadores', authMiddleware, TrabalhadorController.list);
router.get('/trabalhadores/:id', authMiddleware, TrabalhadorController.getById);
router.post('/empregadores/:empregadorId/trabalhadores', authMiddleware, TrabalhadorController.create);
router.put('/trabalhadores/:id', authMiddleware, TrabalhadorController.update);
router.delete('/trabalhadores/:id', authMiddleware, TrabalhadorController.delete);

// Contratos
router.post('/trabalhadores/:trabalhadorId/contratos', authMiddleware, TrabalhadorController.createContrato);
router.get('/trabalhadores/:trabalhadorId/contratos', authMiddleware, TrabalhadorController.listContratos);

// Folha de Pagamento
router.post('/empregadores/:empregadorId/competencias', authMiddleware, FolhaController.createCompetencia);
router.get('/empregadores/:empregadorId/competencias', authMiddleware, FolhaController.listCompetencias);
router.post('/competencias/:competenciaId/lancamentos', authMiddleware, FolhaController.createLancamento);
router.get('/competencias/:competenciaId/lancamentos', authMiddleware, FolhaController.listLancamentos);
router.put('/competencias/:competenciaId/fechar', authMiddleware, FolhaController.fecharCompetencia);
router.put('/competencias/:competenciaId/reabrir', authMiddleware, FolhaController.reabrirCompetencia);

// Eventos eSocial - Tabelas
router.post('/empregadores/:empregadorId/eventos/s1000', authMiddleware, EventoController.generateS1000);
router.post('/empregadores/:empregadorId/eventos/s1010', authMiddleware, EventoController.generateS1010);

// Eventos eSocial - Trabalhadores
router.post('/contratos/:contratoId/eventos/s2200', authMiddleware, EventoController.generateS2200);
router.post('/contratos/:contratoId/eventos/s2206', authMiddleware, EventoController.generateS2206);
router.post('/contratos/:contratoId/eventos/s2299', authMiddleware, EventoController.generateS2299);

// Eventos eSocial - Folha
router.post('/competencias/:competenciaId/contratos/:contratoId/eventos/s1200', authMiddleware, EventoController.generateS1200);
router.post('/competencias/:competenciaId/eventos/s1299', authMiddleware, EventoController.generateS1299);

// Eventos eSocial - Gestão
router.get('/empregadores/:empregadorId/eventos', authMiddleware, EventoController.listEvents);
router.put('/eventos/:eventoId/status', authMiddleware, EventoController.updateEventStatus);

// Dashboard (sem autenticação para testes)
router.get('/dashboard/stats/:empregadorId', DashboardController.getStats);
router.get('/dashboard/recent-events/:empregadorId', DashboardController.getRecentEvents);
router.get('/dashboard/summary/:empregadorId', DashboardController.getSummary);
router.get('/dashboard/events/:empregadorId', DashboardController.getAllEvents);

// Event Generation from Forms (public for testing)
router.post('/events/generate/s1000', EventGenerationController.generateS1000FromForm);
router.post('/events/generate/s1010', EventGenerationController.generateS1010FromForm);
router.post('/events/generate/s1200', EventGenerationController.generateS1200FromForm);
router.post('/events/generate/:eventType', EventGenerationController.generateEvent);

export default router;
