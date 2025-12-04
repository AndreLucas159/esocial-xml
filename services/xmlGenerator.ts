
import { InscriptionType } from '../types';

export const generateEventId = (tpInsc: InscriptionType, nrInsc: string): string => {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const sequential = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  const cleanNrInsc = nrInsc ? nrInsc.replace(/\D/g, '') : '00000000000000';
  const paddedNrInsc = cleanNrInsc.padStart(14, '0');

  return `ID${tpInsc}${paddedNrInsc}${timestamp}${sequential}`;
};

export const wrapInBatch = (eventXml: string, group: number, idEmpregador: string, tpInsc: number): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/lote/eventos/envio/v1_1_1">
  <envioLoteEventos grupo="${group}">
    <ideEmpregador>
      <tpInsc>${tpInsc}</tpInsc>
      <nrInsc>${idEmpregador}</nrInsc>
    </ideEmpregador>
    <ideTransmissor>
      <tpInsc>${tpInsc}</tpInsc>
      <nrInsc>${idEmpregador}</nrInsc>
    </ideTransmissor>
    <eventos>
      <evento Id="ID1${idEmpregador}000000000000001">
${eventXml}
      </evento>
    </eventos>
  </envioLoteEventos>
</eSocial>`;
};

// Helper to convert dot notation keys to nested object
const unflatten = (data: any) => {
  const result: any = {};
  for (const i in data) {
    const keys = i.split('.');
    keys.reduce((acc, key, index) => {
      if (index === keys.length - 1) {
        acc[key] = data[i];
      } else {
        acc[key] = acc[key] || {};
      }
      return acc[key];
    }, result);
  }
  return result;
};

// Helper to recursively build XML string from object
const objectToXml = (obj: any, indent = 12): string => {
  let xml = '';
  const spaces = ' '.repeat(indent);

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      // Skip control fields
      if (key === 'tpAmb' || key === 'nrInsc' || key === 'tpInsc' || value === '' || value === null || value === undefined) continue;

      if (typeof value === 'object' && !Array.isArray(value)) {
        xml += `${spaces}<${key}>\n${objectToXml(value, indent + 2)}${spaces}</${key}>\n`;
      } else {
        xml += `${spaces}<${key}>${value}</${key}>\n`;
      }
    }
  }
  return xml;
};

export const getRootTag = (type: string): string => {
  const schemaMap: Record<string, string> = {
    // Tabelas
    'S-1000': 'evtInfoEmpregador',
    'S-1005': 'evtTabEstab',
    'S-1010': 'evtTabRubrica',
    'S-1020': 'evtTabLotacao',
    'S-1070': 'evtTabProcesso',

    // Não Periódicos
    'S-2190': 'evtAdmPrelim',
    'S-2200': 'evtAdmissao',
    'S-2205': 'evtAltCadastral',
    'S-2206': 'evtAltContratual',
    'S-2210': 'evtCAT',
    'S-2220': 'evtMonit',
    'S-2230': 'evtAfastTemp',
    'S-2240': 'evtExpRisco',
    'S-2298': 'evtReintegr',
    'S-2299': 'evtDeslig',
    'S-2300': 'evtTSVInicio',
    'S-2306': 'evtTSVAltContr',
    'S-2399': 'evtTSVTermino',

    // Periódicos
    'S-1200': 'evtRemun',
    'S-1202': 'evtRmnRPPS', // RPPS
    'S-1207': 'evtBenPrRP', // Benefício RPPS
    'S-1210': 'evtPgtos',
    'S-1260': 'evtComProd',
    'S-1270': 'evtContratAvNP',
    'S-1280': 'evtInfoComplPer',
    'S-1298': 'evtReabreEvPer',
    'S-1299': 'evtFech',

    // Benefícios (Entes Públicos)
    'S-2400': 'evtCdBenefIn',
    'S-2405': 'evtCdBenefAlt',
    'S-2410': 'evtCdBenIn',
    'S-2416': 'evtCdBenAlt',
    'S-2418': 'evtReativBen',
    'S-2420': 'evtCdBenTerm',

    // Processo Trabalhista
    'S-2500': 'evtProcTrab',
    'S-2501': 'evtContrProc',
    'S-2555': 'evtConsolidContrProc',

    // Judicial
    'S-8200': 'evtAdmissaoJudicial',
    'S-8299': 'evtDesligamentoJudicial',

    // Controle
    'S-3000': 'evtExclusao',
  };

  return schemaMap[type] || 'evtGenerico';
};

// Smart Generic Generator
const generateGeneric = (type: string, data: any, id: string) => {
  const rootTag = getRootTag(type);
  const nestedData = unflatten(data);

  // Extract header info for ideEvento/ideEmpregador which are standard
  const tpAmb = data.tpAmb || 2;
  const procEmi = data.procEmi || 1;
  const verProc = data.verProc || '1.0.0';
  const tpInsc = data.tpInsc || 1;
  const nrInsc = data.nrInsc ? data.nrInsc.replace(/\D/g, '') : '';

  let xmlBody = '';

  // S-3000 has a different structure (infoExclusao instead of ideEvento standard)
  if (type === 'S-3000') {
    xmlBody = `            <ideEvento>
              <tpAmb>${tpAmb}</tpAmb>
              <procEmi>${procEmi}</procEmi>
              <verProc>${verProc}</verProc>
            </ideEvento>
            <ideEmpregador>
               <tpInsc>${tpInsc}</tpInsc>
               <nrInsc>${nrInsc}</nrInsc>
            </ideEmpregador>
            <infoExclusao>
${objectToXml(nestedData.infoExclusao, 14)}            </infoExclusao>`;
  } else {
    // Standard Structure for most events
    xmlBody = `            <ideEvento>
              <indRetif>1</indRetif>
              <tpAmb>${tpAmb}</tpAmb>
              <procEmi>${procEmi}</procEmi>
              <verProc>${verProc}</verProc>
            </ideEvento>
            <ideEmpregador>
               <tpInsc>${tpInsc}</tpInsc>
               <nrInsc>${nrInsc}</nrInsc>
            </ideEmpregador>
${objectToXml(nestedData, 12)}`;
  }

  return `        <eSocial xmlns="http://www.esocial.gov.br/schema/evt/${rootTag}/v_S_01_03_00">
          <${rootTag} Id="${id}">
${xmlBody}
          </${rootTag}>
        </eSocial>`;
}

export const generateEventXML = (type: string, data: any): string => {
  const eventId = generateEventId(data.tpInsc || 1, data.nrInsc || '00000000');
  return generateGeneric(type, data, eventId);
};