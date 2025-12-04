import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
}

const colorClasses = {
    blue: {
        bg: 'bg-blue-50',
        icon: 'bg-blue-500',
        text: 'text-blue-600',
        border: 'border-blue-200'
    },
    green: {
        bg: 'bg-green-50',
        icon: 'bg-green-500',
        text: 'text-green-600',
        border: 'border-green-200'
    },
    yellow: {
        bg: 'bg-yellow-50',
        icon: 'bg-yellow-500',
        text: 'text-yellow-600',
        border: 'border-yellow-200'
    },
    red: {
        bg: 'bg-red-50',
        icon: 'bg-red-500',
        text: 'text-red-600',
        border: 'border-red-200'
    },
    purple: {
        bg: 'bg-purple-50',
        icon: 'bg-purple-500',
        text: 'text-purple-600',
        border: 'border-purple-200'
    },
    indigo: {
        bg: 'bg-indigo-50',
        icon: 'bg-indigo-500',
        text: 'text-indigo-600',
        border: 'border-indigo-200'
    }
};

const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus
};

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    trendValue,
    color = 'blue'
}) => {
    const colors = colorClasses[color];
    const TrendIcon = trend ? trendIcons[trend] : null;

    return (
        <div className={`${colors.bg} border ${colors.border} rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className={`text-3xl font-bold ${colors.text} mb-2`}>{value}</p>

                    {trend && trendValue && TrendIcon && (
                        <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' :
                                trend === 'down' ? 'text-red-600' :
                                    'text-gray-600'
                            }`}>
                            <TrendIcon size={16} className="mr-1" />
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>

                <div className={`${colors.icon} p-3 rounded-lg text-white`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};
