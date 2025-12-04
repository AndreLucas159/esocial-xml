import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { EventForm } from './components/EventForm';
import { Dashboard } from './components/Dashboard';
import { EVENT_SCHEMAS } from './services/eventLibrary';
import { EventType } from './types';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string>('DASHBOARD');
  const [empregadorId] = useState<string>('default-empregador-id'); // TODO: Get from auth context

  const selectedSchema = EVENT_SCHEMAS[selectedEventId];
  const isDashboard = selectedEventId === 'DASHBOARD';

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
      <Sidebar
        onSelectEvent={setSelectedEventId}
        selectedEventId={selectedEventId}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {isDashboard ? (
            <Dashboard
              empregadorId={empregadorId}
              onNavigateToEvents={() => console.log('Navigate to events')}
              onNavigateToWorkers={() => console.log('Navigate to workers')}
              onNavigateToCompetencias={() => console.log('Navigate to competencias')}
              onSelectEvent={(eventType) => setSelectedEventId(eventType)}
            />
          ) : (
            <>
              <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Gerador de Eventos eSocial</h1>
                <p className="text-gray-500">Manual de Orientação do Desenvolvedor v1.15 - Abril 2025</p>
              </header>

              <div className="grid grid-cols-1 gap-8">
                {selectedSchema ? (
                  <EventForm schema={selectedSchema} />
                ) : (
                  <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-gray-200">
                    <div className="inline-flex bg-yellow-100 p-4 rounded-full mb-4 text-yellow-600">
                      <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Evento {selectedEventId} não implementado</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Este evento consta na documentação mas o formulário específico ainda não foi criado nesta versão de demonstração.
                      Tente os eventos S-1000, S-1005, S-2200 ou S-1200.
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-blue-800 font-semibold mb-2">Fluxo de Envio</h3>
                  <ol className="list-decimal list-inside text-sm text-blue-700 space-y-2">
                    <li>Preencha os dados do evento selecionado.</li>
                    <li>Gere o XML do Evento e o Envelope de Lote.</li>
                    <li>Utilize um assinador digital (ex: ReceitaNet) para assinar o nodo &lt;evento&gt; com e-CNPJ.</li>
                    <li>Envie para o WebService de Recepção (https://webservices.esocial.gov.br/...).</li>
                  </ol>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;