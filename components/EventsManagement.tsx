import React, { useState, useEffect } from 'react';
import { EventsList } from './EventsList';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, FileText, AlertCircle } from 'lucide-react';

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

interface EventsResponse {
    eventos: Event[];
    total: number;
    page: number;
    totalPages: number;
}

interface EventsManagementProps {
    empregadorId?: string;
    onBack?: () => void;
}

export const EventsManagement: React.FC<EventsManagementProps> = ({
    empregadorId = 'default-empregador-id',
    onBack
}) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [tipoEventoFilter, setTipoEventoFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const loadEvents = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20'
            });

            if (statusFilter) params.append('status', statusFilter);
            if (tipoEventoFilter) params.append('tipoEvento', tipoEventoFilter);
            if (searchTerm) params.append('search', searchTerm);

            const response = await fetch(`/api/v1/dashboard/events/${empregadorId}?${params}`);
            if (!response.ok) throw new Error('Erro ao carregar eventos');

            const data: EventsResponse = await response.json();
            setEvents(data.eventos);
            setTotal(data.total);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error('Erro ao carregar eventos:', err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, [empregadorId, page, statusFilter, tipoEventoFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        loadEvents();
    };

    const handleClearFilters = () => {
        setStatusFilter('');
        setTipoEventoFilter('');
        setSearchTerm('');
        setPage(1);
    };

    if (loading && events.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw size={48} className="animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Carregando eventos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Voltar"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Eventos</h1>
                            <p className="text-gray-500 mt-1">
                                {total} {total === 1 ? 'evento encontrado' : 'eventos encontrados'}
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={loadEvents}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Atualizar
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter size={20} className="text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                </div>

                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar
                        </label>
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Protocolo, recibo ou tipo..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Todos</option>
                            <option value="pendente">Pendente</option>
                            <option value="enviado">Enviado</option>
                            <option value="processado">Processado</option>
                            <option value="erro">Erro</option>
                            <option value="rejeitado">Rejeitado</option>
                        </select>
                    </div>

                    {/* Tipo Evento Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Evento
                        </label>
                        <select
                            value={tipoEventoFilter}
                            onChange={(e) => { setTipoEventoFilter(e.target.value); setPage(1); }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Todos</option>
                            <option value="S-1000">S-1000 - Informações do Empregador</option>
                            <option value="S-1010">S-1010 - Tabela de Rubricas</option>
                            <option value="S-1200">S-1200 - Remuneração</option>
                            <option value="S-1299">S-1299 - Fechamento</option>
                            <option value="S-2200">S-2200 - Admissão</option>
                            <option value="S-2206">S-2206 - Alteração Contratual</option>
                            <option value="S-2299">S-2299 - Desligamento</option>
                        </select>
                    </div>
                </form>

                <div className="flex gap-2 mt-4">
                    <button
                        type="submit"
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                        Buscar
                    </button>
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                        Limpar Filtros
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar eventos</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={loadEvents}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Tentar Novamente
                    </button>
                </div>
            )}

            {/* Events List */}
            {!error && (
                <>
                    <EventsList
                        events={events}
                        onView={(eventId) => console.log('View event:', eventId)}
                        onResend={(eventId) => console.log('Resend event:', eventId)}
                        onDelete={(eventId) => console.log('Delete event:', eventId)}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
                            <div className="text-sm text-gray-600">
                                Página {page} de {totalPages} ({total} eventos no total)
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Próxima
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-blue-900 font-semibold mb-3 flex items-center gap-2">
                    <FileText size={20} />
                    Sobre os Eventos eSocial
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                    Esta página exibe todos os eventos eSocial gerados pelo sistema. Você pode filtrar por status,
                    tipo de evento ou buscar por protocolo/recibo. Use as ações disponíveis para visualizar detalhes,
                    reenviar eventos com erro ou excluir eventos desnecessários.
                </p>
            </div>
        </div>
    );
};
