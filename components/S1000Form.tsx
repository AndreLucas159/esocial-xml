import React, { useState } from 'react';
import { S1000Data, Environment, InscriptionType } from '../types';
import { generateEventXML, wrapInBatch } from '../services/xmlGenerator';
import { Save, Code, CheckCircle, AlertCircle } from 'lucide-react';

export const S1000Form: React.FC = () => {
  const [formData, setFormData] = useState<S1000Data>({
    tpAmb: Environment.ProductionRestricted,
    procEmi: 1,
    verProc: '1.0.0',
    tpInsc: InscriptionType.CNPJ,
    nrInsc: '',
    dtIni: new Date().toISOString().slice(0, 7), // YYYY-MM
    acao: 'inclusao',
    classTrib: '99',
    indCoop: 0,
    indConstr: 0,
    indDesFolha: 0,
    nmCtt: '',
    cpfCtt: '',
    email: ''
  });

  const [generatedXml, setGeneratedXml] = useState<string>('');
  const [batchXml, setBatchXml] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'form' | 'xml'>('form');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nrInsc || !formData.nmCtt) {
      alert("Por favor preencha os campos obrigatórios (CNPJ e Nome do Contato)");
      return;
    }

    const eventXml = generateEventXML('S-1000', formData);
    const batch = wrapInBatch(eventXml, 1, formData.nrInsc.replace(/\D/g, ''), Number(formData.tpInsc));
    
    setGeneratedXml(eventXml);
    setBatchXml(batch);
    setActiveTab('xml');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">S-1000 - Informações do Empregador</h2>
          <p className="text-sm text-gray-500 mt-1">Cadastro inicial para validação da estrutura da empresa.</p>
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
            Visualizar XML
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'form' ? (
          <form onSubmit={handleGenerate} className="space-y-8">
            {/* Section 1: Basic Config */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-esocial-100 text-esocial-700 flex items-center justify-center text-xs">1</div>
                Identificação e Ambiente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ambiente</label>
                  <select 
                    name="tpAmb" 
                    value={formData.tpAmb}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                  >
                    <option value={Environment.ProductionRestricted}>Produção Restrita (Testes)</option>
                    <option value={Environment.Production}>Produção</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Inscrição</label>
                  <select 
                    name="tpInsc" 
                    value={formData.tpInsc}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                  >
                    <option value={InscriptionType.CNPJ}>CNPJ</option>
                    <option value={InscriptionType.CPF}>CPF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número Inscrição (Apenas Números)</label>
                  <input 
                    type="text" 
                    name="nrInsc" 
                    value={formData.nrInsc}
                    onChange={handleInputChange}
                    placeholder="00000000000000"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                    maxLength={14}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Validity & Classification */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-esocial-100 text-esocial-700 flex items-center justify-center text-xs">2</div>
                Validade e Classificação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Início Validade (AAAA-MM)</label>
                  <input 
                    type="month" 
                    name="dtIni" 
                    value={formData.dtIni}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class. Tributária</label>
                  <input 
                    type="text" 
                    name="classTrib" 
                    value={formData.classTrib}
                    onChange={handleInputChange}
                    placeholder="Ex: 99"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ind. Cooperativa</label>
                  <select 
                    name="indCoop" 
                    value={formData.indCoop}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                  >
                    <option value="0">Não é cooperativa</option>
                    <option value="1">Cooperativa de Trabalho</option>
                    <option value="2">Cooperativa de Produção</option>
                    <option value="3">Outras Cooperativas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desoneração</label>
                  <select 
                    name="indDesFolha" 
                    value={formData.indDesFolha}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                  >
                    <option value="0">Não Aplicável</option>
                    <option value="1">Empresa enquadrada nos arts. 7 a 9 da Lei 12.546/2011</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-esocial-100 text-esocial-700 flex items-center justify-center text-xs">3</div>
                Contato
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Contato</label>
                  <input 
                    type="text" 
                    name="nmCtt" 
                    value={formData.nmCtt}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF do Contato</label>
                  <input 
                    type="text" 
                    name="cpfCtt" 
                    value={formData.cpfCtt}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    maxLength={11}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Fixo</label>
                  <input 
                    type="text" 
                    name="foneFixo" 
                    value={formData.foneFixo}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-esocial-500 focus:ring-esocial-500 border p-2"
                  />
                </div>
              </div>
            </div>

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
                 <h4 className="font-semibold text-yellow-800">Atenção ao Certificado Digital</h4>
                 <p className="text-sm text-yellow-700 mt-1">
                   O XML abaixo foi gerado conforme o layout 1.1. Para envio, ele deve ser assinado digitalmente (XMLDSig) usando o certificado e-CNPJ da empresa. 
                   Este sistema gera o conteúdo (payload) e o envelope de lote prontos para assinatura.
                 </p>
               </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700">XML do Evento (S-1000)</h3>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 font-mono">ID{formData.tpInsc}{formData.nrInsc}...</span>
              </div>
              <div className="relative group">
                <textarea 
                  readOnly 
                  className="w-full h-64 bg-slate-900 text-slate-50 font-mono text-sm p-4 rounded-lg focus:outline-none resize-y"
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
                <h3 className="font-semibold text-gray-700">XML do Lote (Envelope de Envio)</h3>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 font-mono">EnvioLoteEventos</span>
              </div>
              <div className="relative group">
                <textarea 
                  readOnly 
                  className="w-full h-64 bg-slate-900 text-slate-50 font-mono text-sm p-4 rounded-lg focus:outline-none resize-y"
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

            <div className="flex justify-end gap-3 pt-4">
               <button className="text-esocial-700 hover:bg-esocial-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                 Baixar Arquivo .xml
               </button>
               <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium">
                 <CheckCircle size={18} />
                 Validar Schema XSD
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};