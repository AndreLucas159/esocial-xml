import { Router, Request, Response } from 'express';
import multer from 'multer';
import { SignerService } from './services/signer';
import { SoapService } from './services/soap';
import { DashboardService } from './services/dashboard';

const router = Router();

// Configure Multer to store file in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post('/transmit', upload.single('certificate'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { xml, password, tagToSign } = req.body;
        const file = req.file;

        if (!file) {
            res.status(400).json({ error: 'Certificate file (.pfx) is required' });
            return;
        }

        if (!xml || !password || !tagToSign) {
            res.status(400).json({ error: 'XML, password, and tagToSign are required' });
            return;
        }

        console.log('Received request to sign and transmit...');

        // 1. Sign the XML
        const signedXml = SignerService.signXml(xml, file.buffer, password, tagToSign);
        console.log('XML Signed successfully.');

        // 2. Send to eSocial
        const { response: esocialResponse, soapEnvelope } = await SoapService.sendToEsocial(signedXml, file.buffer, password);
        console.log('Response received from eSocial.');

        // 3. Return response
        res.json({
            success: true,
            signedXml,
            soapEnvelope,
            esocialResponse
        });

    } catch (error) {
        console.error('Error in /transmit:', error);
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});

// Dashboard Routes
router.get('/dashboard/stats/:empregadorId', async (req: Request, res: Response) => {
    try {
        const { empregadorId } = req.params;
        const stats = await DashboardService.getStats(empregadorId);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/dashboard/recent-events/:empregadorId', async (req: Request, res: Response) => {
    try {
        const { empregadorId } = req.params;
        const limit = parseInt(req.query.limit as string) || 10;
        const events = await DashboardService.getRecentEvents(empregadorId, limit);
        res.json(events);
    } catch (error) {
        console.error('Error fetching recent events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
