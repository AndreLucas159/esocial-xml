import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'esocial-dp-secret-key';

export class AuthController {
    // Registro de nova organização e usuário admin
    static async register(req: Request, res: Response) {
        try {
            const { organizacao, usuario } = req.body;

            // Verificar se CNPJ já existe
            const existingOrg = await prisma.organizacao.findUnique({
                where: { cnpj: organizacao.cnpj }
            });

            if (existingOrg) {
                return res.status(400).json({ error: 'CNPJ já cadastrado' });
            }

            // Verificar se email já existe
            const existingUser = await prisma.usuario.findUnique({
                where: { email: usuario.email }
            });

            if (existingUser) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }

            // Hash da senha
            const senhaHash = await bcrypt.hash(usuario.senha, 10);

            // Criar organização e usuário
            const novaOrganizacao = await prisma.organizacao.create({
                data: {
                    nome: organizacao.nome,
                    cnpj: organizacao.cnpj,
                    email: organizacao.email,
                    telefone: organizacao.telefone,
                    usuarios: {
                        create: {
                            nome: usuario.nome,
                            email: usuario.email,
                            senhaHash,
                            role: 'admin'
                        }
                    }
                },
                include: {
                    usuarios: true
                }
            });

            res.status(201).json({
                message: 'Organização criada com sucesso',
                organizacao: {
                    id: novaOrganizacao.id,
                    nome: novaOrganizacao.nome,
                    cnpj: novaOrganizacao.cnpj
                }
            });
        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({ error: 'Erro ao criar organização' });
        }
    }

    // Login
    static async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;

            // Buscar usuário
            const usuario = await prisma.usuario.findUnique({
                where: { email },
                include: { organizacao: true }
            });

            if (!usuario) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            // Verificar senha
            const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

            if (!senhaValida) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            // Atualizar último acesso
            await prisma.usuario.update({
                where: { id: usuario.id },
                data: { ultimoAcesso: new Date() }
            });

            // Gerar token
            const token = jwt.sign(
                {
                    userId: usuario.id,
                    organizacaoId: usuario.organizacaoId,
                    role: usuario.role
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    role: usuario.role,
                    organizacao: {
                        id: usuario.organizacao.id,
                        nome: usuario.organizacao.nome
                    }
                }
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ error: 'Erro ao fazer login' });
        }
    }

    // Verificar token
    static async verifyToken(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({ error: 'Token não fornecido' });
            }

            const decoded = jwt.verify(token, JWT_SECRET) as {
                userId: string;
                organizacaoId: string;
                role: string;
            };

            const usuario = await prisma.usuario.findUnique({
                where: { id: decoded.userId },
                include: { organizacao: true }
            });

            if (!usuario) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            res.json({
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    role: usuario.role,
                    organizacao: {
                        id: usuario.organizacao.id,
                        nome: usuario.organizacao.nome
                    }
                }
            });
        } catch (error) {
            res.status(401).json({ error: 'Token inválido' });
        }
    }
}
