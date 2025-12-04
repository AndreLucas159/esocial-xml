import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Eye, RefreshCw, Trash2 } from 'lucide-react';

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

interface EventsListProps {
    events: Event[];
    onView?: (eventId: string) => void;
    onResend?: (eventId: string) => void;
    onDelete?: (eventId: string) => void;
}

const statusConfig = {
    pendente: {
        label: 'Pendente',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    enviado: {
        label: 'Enviado',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200'
    },
    processado: {
        label: 'Processado',
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    erro: {
        label: 'Erro',
        icon: XCircle,
        color: 'bg-red-100 text-red-800 border-red-200'
    },
    rejeitado: {
        label: 'Rejeitado',
        icon: AlertCircle,
        color: 'bg-orange-100 text-orange-800 border-orange-200'
    }
};

export const EventsList: React.FC<EventsListProps> = ({
    events,
    onView,
    onResend,
    onDelete
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (events.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <AlertCircle size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">Nenhum evento encontrado</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Usuário
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Protocolo
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {events.map((event) => {
                            const config = statusConfig[event.status as keyof typeof statusConfig] || statusConfig.pendente;
                            const StatusIcon = config.icon;

                            return (
                                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-medium text-gray-900">{event.tipoEvento}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                                            <StatusIcon size={14} className="mr-1" />
                                            {config.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDate(event.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {event.usuario?.nome || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {event.protocolo || event.numeroRecibo || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            {onView && (
                                                <button
                                                    onClick={() => onView(event.id)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded"
                                                    title="Visualizar"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            )}
                                            {onResend && event.status === 'erro' && (
                                                <button
                                                    onClick={() => onResend(event.id)}
                                                    className="text-green-600 hover:text-green-800 transition-colors p-1 hover:bg-green-50 rounded"
                                                    title="Reenviar"
                                                >
                                                    <RefreshCw size={18} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(event.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-50 rounded"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
