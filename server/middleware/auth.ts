import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'esocial-dp-secret-key';

export interface AuthRequest extends Request {
    userId?: string;
    organizacaoId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            organizacaoId: string;
        };

        req.userId = decoded.userId;
        req.organizacaoId = decoded.organizacaoId;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};
