import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with test data...');

    // Create organization
    const org = await prisma.organizacao.upsert({
        where: { cnpj: '12345678000190' },
        update: {},
        create: {
            nome: 'Empresa Teste LTDA',
            cnpj: '12345678000190',
            email: 'contato@empresateste.com.br',
            telefone: '1133334444'
        }
    });
    console.log('✅ Organization created:', org.nome);

    // Create user
    const user = await prisma.usuario.upsert({
        where: { email: 'admin@empresateste.com.br' },
        update: {},
        create: {
            organizacaoId: org.id,
            nome: 'Administrador',
            email: 'admin@empresateste.com.br',
            senhaHash: '$2b$10$abcdefghijklmnopqrstuvwxyz123456', // dummy hash
            role: 'admin'
        }
    });
    console.log('✅ User created:', user.nome);

    // Create employer
    const empregador = await prisma.empregador.upsert({
        where: { cnpj: '98765432000100' },
        update: {},
        create: {
            organizacaoId: org.id,
            razaoSocial: 'Empregador Teste S.A.',
            nomeFantasia: 'Empregador Teste',
            cnpj: '98765432000100',
            email: 'rh@empregadorteste.com.br',
            telefone: '1144445555',
            ambienteEsocial: 2 // Produção Restrita
        }
    });
    console.log('✅ Employer created:', empregador.razaoSocial);

    // Create test events
    const eventos = [
        {
            empregadorId: empregador.id,
            tipoEvento: 'S-1000',
            status: 'enviado',
            numeroRecibo: 'REC-2024-001',
            protocolo: 'PROT-2024-001',
            xmlGerado: '<eSocial>...</eSocial>',
            usuarioId: user.id,
            dataEnvio: new Date('2024-12-01T10:00:00')
        },
        {
            empregadorId: empregador.id,
            tipoEvento: 'S-1010',
            status: 'processado',
            numeroRecibo: 'REC-2024-002',
            protocolo: 'PROT-2024-002',
            xmlGerado: '<eSocial>...</eSocial>',
            usuarioId: user.id,
            dataEnvio: new Date('2024-12-01T11:00:00'),
            dataProcessamento: new Date('2024-12-01T11:05:00')
        },
        {
            empregadorId: empregador.id,
            tipoEvento: 'S-2200',
            status: 'pendente',
            xmlGerado: '<eSocial>...</eSocial>',
            usuarioId: user.id
        },
        {
            empregadorId: empregador.id,
            tipoEvento: 'S-1200',
            status: 'erro',
            xmlGerado: '<eSocial>...</eSocial>',
            mensagemRetorno: 'Erro de validação: campo obrigatório não preenchido',
            codigoRetorno: 'ERR-001',
            usuarioId: user.id,
            dataEnvio: new Date('2024-12-02T09:00:00')
        },
        {
            empregadorId: empregador.id,
            tipoEvento: 'S-1299',
            status: 'enviado',
            numeroRecibo: 'REC-2024-003',
            protocolo: 'PROT-2024-003',
            xmlGerado: '<eSocial>...</eSocial>',
            usuarioId: user.id,
            dataEnvio: new Date('2024-12-03T14:00:00')
        }
    ];

    for (const evento of eventos) {
        await prisma.eventoEsocial.create({ data: evento });
    }
    console.log(`✅ Created ${eventos.length} test events`);

    // Create worker
    const trabalhador = await prisma.trabalhador.create({
        data: {
            empregadorId: empregador.id,
            cpf: '12345678901',
            nome: 'João da Silva',
            dataNascimento: new Date('1990-01-15'),
            sexo: 'M'
        }
    });
    console.log('✅ Worker created:', trabalhador.nome);

    // Create contract
    const contrato = await prisma.contrato.create({
        data: {
            trabalhadorId: trabalhador.id,
            empregadorId: empregador.id,
            matricula: 'MAT-001',
            categoria: 101,
            dataAdmissao: new Date('2024-01-01'),
            salario: 3000.00,
            status: 'ativo'
        }
    });
    console.log('✅ Contract created: MAT-001');

    // Create competencia
    const competencia = await prisma.competencia.create({
        data: {
            empregadorId: empregador.id,
            ano: 2024,
            mes: 12,
            status: 'aberta'
        }
    });
    console.log('✅ Competencia created: 12/2024');

    console.log('\n🎉 Seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - 1 Organization`);
    console.log(`   - 1 User`);
    console.log(`   - 1 Employer`);
    console.log(`   - ${eventos.length} Events`);
    console.log(`   - 1 Worker`);
    console.log(`   - 1 Contract`);
    console.log(`   - 1 Competencia`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
