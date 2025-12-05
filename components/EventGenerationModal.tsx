import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { EVENT_SCHEMAS } from '../services/eventLibrary';
import { EventGenerationService } from '../services/eventGenerationService';

interface EventGenerationModalProps {
    eventType: string | null;
    empregadorId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const EventGenerationModal: React.FC<EventGenerationModalProps> = ({
    eventType,
    empregadorId,
    isOpen,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen || !eventType) return null;

    const schema = EVENT_SCHEMAS[eventType];
    if (!schema) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Merge default state with form data
            const completeFormData = {
                ...schema.defaultState,
                ...formData
            };

            await EventGenerationService.generateEvent(eventType, completeFormData, empregadorId);

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao gerar evento');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (path: string, value: any) => {
        setFormData((prev: any) => {
            const newData = { ...prev };
            const keys = path.split('.');
            let current = newData;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const getValueFromPath = (path: string) => {
        const keys = path.split('.');
        let value = formData;
        for (const key of keys) {
            value = value?.[key];
        }
        return value ?? '';
    };

    // Group fields by group
    const groupedFields = schema.fields.reduce((acc, field) => {
        const group = field.group || 'Geral';
        if (!acc[group]) acc[group] = [];
        acc[group].push(field);
        return acc;
    }, {} as Record<string, typeof schema.fields>);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">{schema.title}</h2>
                        <p className="text-blue-100 text-sm mt-1">{schema.description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    {Object.entries(groupedFields).map(([group, fields]) => (
                        <div key={group} className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                {group}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {fields.map((field) => (
                                    <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {field.label}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        {field.type === 'select' ? (
                                            <select
                                                value={getValueFromPath(field.path)}
                                                onChange={(e) => handleInputChange(field.path, field.options?.[0]?.value === 'string' ? e.target.value : Number(e.target.value))}
                                                required={field.required}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Selecione...</option>
                                                {field.options?.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : field.type === 'textarea' ? (
                                            <textarea
                                                value={getValueFromPath(field.path)}
                                                onChange={(e) => handleInputChange(field.path, e.target.value)}
                                                required={field.required}
                                                placeholder={field.placeholder}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <input
                                                type={field.type}
                                                value={getValueFromPath(field.path)}
                                                onChange={(e) => handleInputChange(field.path, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                                                required={field.required}
                                                maxLength={field.maxLength}
                                                placeholder={field.placeholder}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-4">
                            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-red-800">Erro ao gerar evento</h4>
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 mb-4">
                            <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-green-800">Evento gerado com sucesso!</h4>
                                <p className="text-green-600 text-sm">O evento foi criado e está disponível na lista de eventos.</p>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading || success}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                Gerando...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Gerar Evento
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
