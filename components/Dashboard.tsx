import React, { useState, useEffect } from 'react';
import { StatCard } from './StatCard';
import { EventsList } from './EventsList';
import { QuickActions } from './QuickActions';
import { EventGenerationModal } from './EventGenerationModal';
import { Users, FileText, Calendar, AlertCircle, RefreshCw, TrendingUp } from 'lucide-react';

interface DashboardStats {
    totalTrabalhadores: number;
    totalContratos: number;
    competenciasAbertas: number;
    eventosPendentes: number;
    eventosEnviados: number;
    eventosComErro: number;
}

interface Event {
    id: string;
    tipoEvento: string;
    status: string;
    createdAt: string;
    numeroRecibo?: string | null;
    protocolo?: string | null;
    usuario?: {
        nome: string;
    };
}

interface DashboardProps {
    empregadorId?: string;
    onNavigateToEvents?: () => void;
    onNavigateToWorkers?: () => void;
    onNavigateToCompetencias?: () => void;
    onSelectEvent?: (eventType: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    empregadorId = 'default-empregador-id',
    onNavigateToEvents,
    onNavigateToWorkers,
    onNavigateToCompetencias,
    onSelectEvent
}) => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentEvents, setRecentEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Event Generation Modal State
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEventType, setSelectedEventType] = useState<string | null>(null);

    const loadDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            const statsResponse = await fetch(`/api/v1/dashboard/stats/${empregadorId}`);
            if (!statsResponse.ok) throw new Error('Erro ao carregar estatísticas');
            const statsData = await statsResponse.json();
            setStats(statsData);

            const eventsResponse = await fetch(`/api/v1/dashboard/recent-events/${empregadorId}?limit=10`);
            if (!eventsResponse.ok) throw new Error('Erro ao carregar eventos');
            const eventsData = await eventsResponse.json();
            setRecentEvents(eventsData);
        } catch (err) {
            console.error('Erro ao carregar dashboard:', err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, [empregadorId]);

    const handleGenerateEvent = (eventType: string) => {
        setSelectedEventType(eventType);
        setShowEventModal(true);
    };

    const handleEventGenerationSuccess = () => {
        setShowEventModal(false);
        setSelectedEventType(null);
        loadDashboardData(); // Refresh dashboard data
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw size={48} className="animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar dashboard</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={loadDashboardData} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Visão geral do sistema eSocial</p>
                </div>
                <button onClick={loadDashboardData} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <RefreshCw size={18} />
                    Atualizar
                </button>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total de Trabalhadores" value={stats.totalTrabalhadores} icon={<Users size={24} />} color="blue" />
                    <StatCard title="Contratos Ativos" value={stats.totalContratos} icon={<FileText size={24} />} color="green" />
                    <StatCard title="Competências Abertas" value={stats.competenciasAbertas} icon={<Calendar size={24} />} color="purple" />
                    <StatCard title="Eventos Pendentes" value={stats.eventosPendentes} icon={<AlertCircle size={24} />} color="yellow" />
                    <StatCard title="Eventos Enviados (30d)" value={stats.eventosEnviados} icon={<TrendingUp size={24} />} color="indigo" trend="up" trendValue="Último mês" />
                    <StatCard title="Eventos com Erro" value={stats.eventosComErro} icon={<AlertCircle size={24} />} color="red" />
                </div>
            )}

            <QuickActions
                onNewWorker={onNavigateToWorkers}
                onNewCompetencia={onNavigateToCompetencias}
                onGenerateS1000={() => handleGenerateEvent('S-1000')}
                onGenerateS1200={() => handleGenerateEvent('S-1200')}
                onViewAllEvents={onNavigateToEvents}
            />

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Eventos Recentes</h2>
                    {onNavigateToEvents && (
                        <button onClick={onNavigateToEvents} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                            Ver todos →
                        </button>
                    )}
                </div>
                <EventsList
                    events={recentEvents}
                    onView={(eventId) => console.log('View event:', eventId)}
                    onResend={(eventId) => console.log('Resend event:', eventId)}
                    onDelete={(eventId) => console.log('Delete event:', eventId)}
                />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-blue-900 font-semibold mb-3 flex items-center gap-2">
                    <FileText size={20} />
                    Sobre o eSocial
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                    O eSocial é o Sistema de Escrituração Digital das Obrigações Fiscais, Previdenciárias e Trabalhistas.
                    Este dashboard fornece uma visão consolidada de todos os eventos gerados, trabalhadores cadastrados e
                    competências em processamento. Use as ações rápidas para agilizar seu trabalho diário.
                </p>
            </div>

            {/* Event Generation Modal */}
            <EventGenerationModal
                eventType={selectedEventType}
                empregadorId={empregadorId}
                isOpen={showEventModal}
                onClose={() => {
                    setShowEventModal(false);
                    setSelectedEventType(null);
                }}
                onSuccess={handleEventGenerationSuccess}
            />
        </div>
    );
};
