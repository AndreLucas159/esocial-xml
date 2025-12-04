import React from 'react';
import { UserPlus, Calendar, Building2, FileText, List, ArrowRight } from 'lucide-react';

interface QuickAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
}

interface QuickActionsProps {
    onNewWorker?: () => void;
    onNewCompetencia?: () => void;
    onGenerateS1000?: () => void;
    onGenerateS1200?: () => void;
    onViewAllEvents?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    onNewWorker,
    onNewCompetencia,
    onGenerateS1000,
    onGenerateS1200,
    onViewAllEvents
}) => {
    const actions: QuickAction[] = [
        {
            id: 'new-worker',
            label: 'Novo Trabalhador',
            icon: <UserPlus size={24} />,
            color: 'bg-blue-500 hover:bg-blue-600',
            onClick: onNewWorker || (() => { })
        },
        {
            id: 'new-competencia',
            label: 'Nova Competência',
            icon: <Calendar size={24} />,
            color: 'bg-green-500 hover:bg-green-600',
            onClick: onNewCompetencia || (() => { })
        },
        {
            id: 'generate-s1000',
            label: 'Gerar S-1000',
            icon: <Building2 size={24} />,
            color: 'bg-purple-500 hover:bg-purple-600',
            onClick: onGenerateS1000 || (() => { })
        },
        {
            id: 'generate-s1200',
            label: 'Gerar S-1200',
            icon: <FileText size={24} />,
            color: 'bg-indigo-500 hover:bg-indigo-600',
            onClick: onGenerateS1200 || (() => { })
        },
        {
            id: 'view-events',
            label: 'Ver Todos os Eventos',
            icon: <List size={24} />,
            color: 'bg-gray-700 hover:bg-gray-800',
            onClick: onViewAllEvents || (() => { })
        }
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={action.onClick}
                        className={`${action.color} text-white rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:scale-105 flex flex-col items-center justify-center gap-2 group`}
                    >
                        <div className="transition-transform group-hover:scale-110">
                            {action.icon}
                        </div>
                        <span className="text-sm font-medium text-center">{action.label}</span>
                        <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
            </div>
        </div>
    );
};
