
import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Table,
  Calendar,
  ShieldAlert,
  Trash2,
  Gavel,
  Heart,
  Scale,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { EventType } from '../types';

interface SidebarProps {
  onSelectEvent: (eventId: string) => void;
  selectedEventId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelectEvent, selectedEventId }) => {
  const [sections, setSections] = useState({
    tables: true,
    nonPeriodic: true,
    sst: true,
    process: true,
    benefits: true,
    periodic: true,
    judicial: true,
    control: true
  });

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const NavItem = ({ id, label }: { id: string, label: string }) => (
    <button
      onClick={() => onSelectEvent(id)}
      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left ${selectedEventId === id ? 'bg-esocial-800 text-white border-r-4 border-esocial-500' : 'text-esocial-100 hover:bg-esocial-800 hover:text-white'}`}
    >
      <span className="font-mono text-xs opacity-70 w-14">{id}</span>
      <span className="truncate">{label}</span>
    </button>
  );

  return (
    <aside className="w-72 bg-esocial-900 text-white min-h-screen flex flex-col shadow-xl overflow-y-auto">
      <div className="p-6 border-b border-esocial-800 flex items-center gap-3 sticky top-0 bg-esocial-900 z-10">
        <div className="bg-white p-1.5 rounded-lg">
          <svg className="w-6 h-6 text-esocial-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">eSocial<span className="font-light opacity-80">Builder</span></h1>
          <p className="text-xs text-esocial-200">Módulo DP v1.15</p>
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-1">
        {/* Dashboard */}
        <button
          onClick={() => onSelectEvent('DASHBOARD')}
          className={`w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all ${selectedEventId === 'DASHBOARD' ? 'bg-blue-600 text-white shadow-lg' : 'text-esocial-100 hover:bg-esocial-800 hover:text-white'}`}
        >
          <LayoutDashboard size={20} />
          <span className="font-semibold">Dashboard</span>
        </button>

        <div className="px-4 py-2 mt-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-esocial-300 uppercase tracking-wider mb-2">
            <FileText size={14} />
            Eventos
          </div>
        </div>

        {/* Tables Section */}
        <div>
          <button
            onClick={() => toggleSection('tables')}
            className="w-full flex items-center justify-between px-4 py-2 text-esocial-200 hover:text-white hover:bg-esocial-800"
          >
            <div className="flex items-center gap-2 font-medium">
              <Table size={16} />
              <span>Tabelas</span>
            </div>
            {sections.tables ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {sections.tables && (
            <div className="bg-esocial-900/50">
              <NavItem id={EventType.S1000} label="Info. Empregador" />
              <NavItem id={EventType.S1005} label="Estabelecimentos" />
              <NavItem id={EventType.S1010} label="Rubricas" />
              <NavItem id={EventType.S1020} label="Lotações Tributárias" />
              <NavItem id={EventType.S1070} label="Processos Adm/Jud" />
            </div>
          )}
        </div>

        {/* Non-Periodic Section */}
        <div>
          <button
            onClick={() => toggleSection('nonPeriodic')}
            className="w-full flex items-center justify-between px-4 py-2 text-esocial-200 hover:text-white hover:bg-esocial-800"
          >
            <div className="flex items-center gap-2 font-medium">
              <FileText size={16} />
              <span>Não Periódicos</span>
            </div>
            {sections.nonPeriodic ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {sections.nonPeriodic && (
            <div className="bg-esocial-900/50">
              <NavItem id={EventType.S2190} label="Admissão Preliminar" />
              <NavItem id={EventType.S2200} label="Admissão/Ingresso" />
              <NavItem id={EventType.S2205} label="Alt. Cadastral" />
              <NavItem id={EventType.S2206} label="Alt. Contratual" />
              <NavItem id={EventType.S2230} label="Afastamento Temp." />
              <NavItem id={EventType.S2298} label="Reintegração" />
              <NavItem id={EventType.S2299} label="Desligamento" />
              <NavItem id={EventType.S2300} label="TSVE - Início" />
              <NavItem id={EventType.S2306} label="TSVE - Alteração" />
              <NavItem id={EventType.S2399} label="TSVE - Término" />
            </div>
          )}
        </div>

        {/* SST Section */}
        <div>
          <button
            onClick={() => toggleSection('sst')}
            className="w-full flex items-center justify-between px-4 py-2 text-esocial-200 hover:text-white hover:bg-esocial-800"
          >
            <div className="flex items-center gap-2 font-medium">
              <ShieldAlert size={16} />
              <span>SST</span>
            </div>
            {sections.sst ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {sections.sst && (
            <div className="bg-esocial-900/50">
              <NavItem id={EventType.S2210} label="CAT - Acidente" />
              <NavItem id={EventType.S2220} label="ASO - Saúde" />
              <NavItem id={EventType.S2240} label="Cond. Ambientais" />
            </div>
          )}
        </div>

        {/* Process Section */}
        <div>
          <button
            onClick={() => toggleSection('process')}
            className="w-full flex items-center justify-between px-4 py-2 text-esocial-200 hover:text-white hover:bg-esocial-800"
          >
            <div className="flex items-center gap-2 font-medium">
              <Gavel size={16} />
              <span>Proc. Trabalhista</span>
            </div>
            {sections.process ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {sections.process && (
            <div className="bg-esocial-900/50">
              <NavItem id={EventType.S2500} label="Processo Trabalhista" />
              <NavItem id={EventType.S2501} label="Tributos Processo" />
              <NavItem id={EventType.S2555} label="Consolidação Proc." />
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <div>
          <button
            onClick={() => toggleSection('benefits')}
            className="w-full flex items-center justify-between px-4 py-2 text-esocial-200 hover:text-white hover:bg-esocial-800"
          >
            <div className="flex items-center gap-2 font-medium">
              <Heart size={16} />
              <span>Benefícios (RPPS)</span>
            </div>
            {sections.benefits ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {sections.benefits && (
            <div className="bg-esocial-900/50">
              <NavItem id={EventType.S2400} label="Cad. Beneficiário" />
              <NavItem id={EventType.S2405} label="Alt. Beneficiário" />
              <NavItem id={EventType.S2410} label="Cad. Benefício" />
              <NavItem id={EventType.S2416} label="Alt. Benefício" />
              <NavItem id={EventType.S2418} label="Reativ. Benefício" />
              <NavItem id={EventType.S2420} label="Térm. Benefício" />
            </div>
          )}
        </div>

        {/* Periodic Section */}
        <div>
          <button
            onClick={() => toggleSection('periodic')}
            className="w-full flex items-center justify-between px-4 py-2 text-esocial-200 hover:text-white hover:bg-esocial-800"
          >
            <div className="flex items-center gap-2 font-medium">
              <Calendar size={16} />
              <span>Periódicos</span>
            </div>
            {sections.periodic ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {sections.periodic && (
            <div className="bg-esocial-900/50">
              <NavItem id={EventType.S1200} label="Remuneração RGPS" />
              <NavItem id={EventType.S1202} label="Remuneração RPPS" />
              <NavItem id={EventType.S1207} label="Benefícios RPPS" />
              <NavItem id={EventType.S1210} label="Pagamentos" />
              <NavItem id={EventType.S1260} label="Comerc. Rural" />
              <NavItem id={EventType.S1270} label="Avulsos" />
              <NavItem id={EventType.S1280} label="Info. Compl. (Deson)" />
              <NavItem id={EventType.S1298} label="Reabertura" />
              <NavItem id={EventType.S1299} label="Fechamento" />
            </div>
          )}
        </div>

        {/* Judicial Section */}
        <div>
          <button
            onClick={() => toggleSection('judicial')}
            className="w-full flex items-center justify-between px-4 py-2 text-esocial-200 hover:text-white hover:bg-esocial-800"
          >
            <div className="flex items-center gap-2 font-medium">
              <Scale size={16} />
              <span>Judicial (Anotação)</span>
            </div>
            {sections.judicial ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {sections.judicial && (
            <div className="bg-esocial-900/50">
              <NavItem id={EventType.S8200} label="Anotação Vínculo" />
              <NavItem id={EventType.S8299} label="Baixa Vínculo" />
            </div>
          )}
        </div>

        {/* Control Section */}
        <div>
          <button
            onClick={() => toggleSection('control')}
            className="w-full flex items-center justify-between px-4 py-2 text-esocial-200 hover:text-white hover:bg-esocial-800"
          >
            <div className="flex items-center gap-2 font-medium">
              <Trash2 size={16} />
              <span>Controle</span>
            </div>
            {sections.control ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {sections.control && (
            <div className="bg-esocial-900/50">
              <NavItem id={EventType.S3000} label="Exclusão Evento" />
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};