import React, { useState, useEffect } from 'react';
import { EventSchema, FieldOption, FormField } from '../types';
import { generateEventXML, wrapInBatch, getRootTag } from '../services/xmlGenerator';
import { transmitEvent } from '../services/api';
import { Save, Code, CheckCircle, AlertCircle, HelpCircle, Upload, X, Loader2, Send, FileText } from 'lucide-react';

interface EventFormProps {
  schema: EventSchema;
}

export const EventForm: React.FC<EventFormProps> = ({ schema }) => {
  const [formData, setFormData] = useState<any>(schema.defaultState);
  const [generatedXml, setGeneratedXml] = useState<string>('');
  const [batchXml, setBatchXml] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'form' | 'xml'>('form');

  // Transmission State
  const [isTransmitModalOpen, setIsTransmitModalOpen] = useState(false);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certPassword, setCertPassword] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitResult, setTransmitResult] = useState<any>(null);

  // Reset form when schema changes
  useEffect(() => {
    setFormData(schema.defaultState);
    setGeneratedXml('');
    setBatchXml('');
    setActiveTab('form');
  }, [schema]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      const newData = { ...prev, [name]: value };

      // Auto-save common fields to localStorage for auto-fill in other events
      if (['tpAmb', 'tpInsc', 'nrInsc'].includes(name)) {
        localStorage.setItem(`esocial_common_${name}`, value);
      }

      return newData;
    });
  };

  // Auto-fill common fields from localStorage
  useEffect(() => {
    const commonFields = ['tpAmb', 'tpInsc', 'nrInsc'];
    const updates: Record<string, any> = {};
    let hasUpdates = false;

    commonFields.forEach(field => {
      // Only auto-fill if the field is empty in the current form data
      if (!formData[field]) {
        const storedValue = localStorage.getItem(`esocial_common_${field}`);
        if (storedValue) {
          updates[field] = storedValue;
          hasUpdates = true;
        }
      }
    });

    if (hasUpdates) {
      setFormData((prev: any) => ({ ...prev, ...updates }));
    }
  }, [schema.id]); // Run when schema changes (new form loaded)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic required check
    const missing = schema.fields
      .filter(f => f.required && !formData[f.name])
      .map(f => f.label);

    if (missing.length > 0) {
      alert(`Campos obrigatórios faltando: ${missing.join(', ')}`);
      return;
    }

    const eventXml = generateEventXML(schema.id, formData);
    const nrInsc = formData.nrInsc ? formData.nrInsc.replace(/\D/g, '') : '00000000000000';
    const batch = wrapInBatch(eventXml, 1, nrInsc, formData.tpInsc || 1);

    setGeneratedXml(eventXml);
    setBatchXml(batch);
    setActiveTab('xml');
  };

  const handleTransmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certFile || !certPassword) return;

    setIsTransmitting(true);
    setTransmitResult(null);

    try {
      const tagToSign = getRootTag(schema.id);
      const result = await transmitEvent(generatedXml, certFile, certPassword, tagToSign);
      setTransmitResult(result);
    } catch (error) {
      setTransmitResult({ success: false, error: (error as Error).message });
    } finally {
      setIsTransmitting(false);
    }
  };

  // Group fields
  const groupedFields = schema.fields.reduce((acc, field) => {
    const group = field.group || 'Geral';
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {} as Record<string, FormField[]>);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-esocial-600 text-white text-xs px-2 py-1 rounded">{schema.id}</span>
            {schema.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{schema.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'form' ? 'bg-esocial-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}
          >
            Formulário
          </button>
          <button
            onClick={() => setActiveTab('xml')}
            disabled={!generatedXml}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'xml' ? 'bg-esocial-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'}`}
          >
            <Code size={16} />
            XML
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'form' ? (
          <form onSubmit={handleGenerate} className="space-y-8">
            {Object.entries(groupedFields).map(([groupName, fields]: [string, FormField[]], idx) => (
              <div key={groupName}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-esocial-100 text-esocial-700 flex items-center justify-center text-xs">{idx + 1}</div>
                  {groupName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fields.map(field => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                        >
                          {field.options?.map((opt: FieldOption) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          maxLength={field.maxLength}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                        />
                      )}
                      {field.description && <p className="text-xs text-gray-500 mt-1">{field.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="bg-esocial-600 text-white px-6 py-3 rounded-lg hover:bg-esocial-700 transition-colors shadow-lg shadow-esocial-200 flex items-center gap-2 font-medium"
              >
                <Save size={20} />
                Gerar XML do Evento
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-yellow-800">Pronto para Assinatura</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  O XML foi gerado com sucesso. Para transmitir ao eSocial, o envelope deve ser assinado digitalmente.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-700">Evento (Payload)</h3>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 font-mono">ID...</span>
                </div>
                <div className="relative group">
                  <textarea
                    readOnly
                    className="w-full h-96 bg-slate-900 text-slate-50 font-mono text-sm p-4 rounded-lg focus:outline-none resize-none"
                    value={generatedXml}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedXml)}
                    className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-700">Lote (Envelope)</h3>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 font-mono">envioLoteEventos</span>
                </div>
                <div className="relative group">
                  <textarea
                    readOnly
                    className="w-full h-96 bg-slate-900 text-slate-50 font-mono text-sm p-4 rounded-lg focus:outline-none resize-none"
                    value={batchXml}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(batchXml)}
                    className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button className="text-esocial-700 hover:bg-esocial-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2">
                <HelpCircle size={18} /> Documentação
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium">
                <CheckCircle size={18} />
                Validar XSD
              </button>
              <button
                onClick={() => setIsTransmitModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium"
              >
                <Send size={18} />
                Transmitir ao eSocial
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transmission Modal */}
      {isTransmitModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Transmitir Evento</h3>
              <button onClick={() => setIsTransmitModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {!transmitResult ? (
                <form onSubmit={handleTransmit} className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
                    <p>Ambiente: <strong>Produção Restrita (Teste)</strong></p>
                    <p>Evento: <strong>{schema.id}</strong></p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certificado Digital (A1 .pfx)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept=".pfx"
                        onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {certFile ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <FileText size={20} />
                          <span className="font-medium truncate">{certFile.name}</span>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <Upload className="mx-auto mb-2" size={24} />
                          <span className="text-sm">Clique para selecionar o arquivo .pfx</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha do Certificado</label>
                    <input
                      type="password"
                      value={certPassword}
                      onChange={(e) => setCertPassword(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                      placeholder="Digite a senha..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!certFile || !certPassword || isTransmitting}
                    className="w-full bg-esocial-600 text-white py-3 rounded-lg font-medium hover:bg-esocial-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isTransmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Assinar e Transmitir
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  {transmitResult.success ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                      </div>
                      <h4 className="text-xl font-bold text-green-700 mb-2">Sucesso!</h4>
                      <p className="text-gray-600 mb-4">O evento foi assinado e enviado ao eSocial.</p>

                      <div className="bg-gray-100 p-4 rounded text-left text-xs font-mono overflow-auto max-h-40 mb-4">
                        <p className="font-bold mb-1">Resposta do eSocial:</p>
                        {JSON.stringify(transmitResult.esocialResponse, null, 2)}
                      </div>

                      {transmitResult.soapEnvelope && (
                        <div className="bg-slate-900 p-4 rounded text-left text-xs font-mono overflow-auto max-h-60 text-slate-50">
                          <p className="font-bold mb-1 text-slate-300">XML Enviado (Envelope SOAP):</p>
                          <pre>{transmitResult.soapEnvelope}</pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} />
                      </div>
                      <h4 className="text-xl font-bold text-red-700 mb-2">Erro no Envio</h4>
                      <p className="text-gray-600 mb-4">{transmitResult.error}</p>
                    </div>
                  )}

                  <button
                    onClick={() => setTransmitResult(null)}
                    className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300"
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};