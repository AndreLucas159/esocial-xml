/**
 * Script de teste para demonstrar a integração completa
 * Database → Generator → XML
 */

import prisma from './server/db/prisma';
import { S1000Generator } from './server/services/esocial/S1000Generator';
import { S1010Generator } from './server/services/esocial/S1010Generator';
import { EventQueueService } from './server/services/esocial/EventQueueService';

async function testIntegration() {
    console.log('🚀 Iniciando teste de integração...\n');

    try {
        // 1. Criar organização de teste
        console.log('1️⃣ Criando organização de teste...');
        const organizacao = await prisma.organizacao.create({
            data: {
                nome: 'Contabilidade Teste',
                cnpj: '12345678000190',
                email: 'teste@contabilidade.com'
            }
        });
        console.log(`✅ Organização criada: ${organizacao.nome}\n`);

        // 2. Criar empregador de teste
        console.log('2️⃣ Criando empregador de teste...');
        const empregador = await prisma.empregador.create({
            data: {
                organizacaoId: organizacao.id,
                razaoSocial: 'Empresa ABC Ltda',
                nomeFantasia: 'ABC',
                cnpj: '98765432000100',
                naturezaJuridica: '2062',
                cnaePrincipal: '6201500',
                classificacaoTributaria: 1,
                email: 'contato@empresaabc.com',
                telefone: '1133334444',
                logradouro: 'Rua Teste',
                numero: '123',
                bairro: 'Centro',
                cidade: 'São Paulo',
                uf: 'SP',
                cep: '01310100',
                ambienteEsocial: 2 // Teste
            }
        });
        console.log(`✅ Empregador criado: ${empregador.razaoSocial}\n`);

        // 3. Criar rubricas de teste
        console.log('3️⃣ Criando rubricas de teste...');
        const rubrica1 = await prisma.rubrica.create({
            data: {
                empregadorId: empregador.id,
                codigo: '1000',
                descricao: 'Salário Base',
                natureza: 1000,
                tipo: 1, // Vencimento
                incideCp: true,
                incideIrrf: true,
                incideFgts: true,
                vigenciaInicio: new Date('2024-01-01')
            }
        });

        const rubrica2 = await prisma.rubrica.create({
            data: {
                empregadorId: empregador.id,
                codigo: '1003',
                descricao: 'Horas Extras',
                natureza: 1003,
                tipo: 1,
                incideCp: true,
                incideIrrf: true,
                incideFgts: true,
                vigenciaInicio: new Date('2024-01-01')
            }
        });
        console.log(`✅ Rubricas criadas: ${rubrica1.descricao}, ${rubrica2.descricao}\n`);

        // 4. Gerar evento S-1000
        console.log('4️⃣ Gerando evento S-1000...');
        const s1000 = await S1000Generator.generate(empregador.id);
        console.log('✅ S-1000 gerado:');
        console.log(JSON.stringify(s1000, null, 2));
        console.log('\n');

        // 5. Gerar evento S-1010
        console.log('5️⃣ Gerando evento S-1010...');
        const s1010 = await S1010Generator.generate(empregador.id);
        console.log('✅ S-1010 gerado:');
        console.log(JSON.stringify(s1010, null, 2));
        console.log('\n');

        // 6. Enfileirar eventos
        console.log('6️⃣ Enfileirando eventos...');
        const evento1000 = await EventQueueService.generateS1000(empregador.id);
        const evento1010 = await EventQueueService.generateS1010(empregador.id);
        console.log(`✅ S-1000 enfileirado: ${evento1000.eventoId}`);
        console.log(`✅ S-1010 enfileirado: ${evento1010.eventoId}\n`);

        // 7. Listar eventos da fila
        console.log('7️⃣ Listando eventos da fila...');
        const eventos = await EventQueueService.listEvents(empregador.id);
        console.log(`✅ Total de eventos na fila: ${eventos.length}`);
        eventos.forEach(evt => {
            console.log(`   - ${evt.tipoEvento} | Status: ${evt.status} | ID: ${evt.id}`);
        });
        console.log('\n');

        console.log('✅ Teste de integração concluído com sucesso!\n');
        console.log('📊 Resumo:');
        console.log(`   - Organização: ${organizacao.nome}`);
        console.log(`   - Empregador: ${empregador.razaoSocial}`);
        console.log(`   - Rubricas: 2`);
        console.log(`   - Eventos gerados: ${eventos.length}`);

    } catch (error) {
        console.error('❌ Erro no teste:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Executar teste
testIntegration();
