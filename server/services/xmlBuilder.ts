/**
 * XML Builder Service
 * Converts form data from eventLibrary schemas to eSocial XML format
 */

export class XmlBuilder {
    /**
     * Build S-1000 XML (Informações do Empregador)
     */
    static buildS1000(formData: any): string {
        const { tpAmb, tpInsc, nrInsc, infoEmpregador } = formData;

        return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtInfoEmpregador/v_S_01_02_00">
  <evtInfoEmpregador Id="ID1${nrInsc}${new Date().getTime()}">
    <ideEvento>
      <tpAmb>${tpAmb}</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>${tpInsc}</tpInsc>
      <nrInsc>${nrInsc}</nrInsc>
    </ideEmpregador>
    <infoEmpregador>
      <inclusao>
        <idePeriodo>
          <iniValid>${infoEmpregador.inclusao.idePeriodo.iniValid}</iniValid>
        </idePeriodo>
        <infoCadastro>
          <classTrib>${infoEmpregador.inclusao.infoCadastro.classTrib}</classTrib>
          <indCoop>${infoEmpregador.inclusao.infoCadastro.indCoop}</indCoop>
          <indConstr>${infoEmpregador.inclusao.infoCadastro.indConstr}</indConstr>
          <indDesFolha>${infoEmpregador.inclusao.infoCadastro.indDesFolha}</indDesFolha>
          <contato>
            <nmCtt>${this.escapeXml(infoEmpregador.inclusao.infoCadastro.contato.nmCtt)}</nmCtt>
            <cpfCtt>${infoEmpregador.inclusao.infoCadastro.contato.cpfCtt}</cpfCtt>
            <email>${this.escapeXml(infoEmpregador.inclusao.infoCadastro.contato.email)}</email>
          </contato>
        </infoCadastro>
      </inclusao>
    </infoEmpregador>
  </evtInfoEmpregador>
</eSocial>`;
    }

    /**
     * Build S-1010 XML (Tabela de Rubricas)
     */
    static buildS1010(formData: any): string {
        const { tpAmb, tpInsc, nrInsc, infoRubrica } = formData;

        return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabRubrica/v_S_01_02_00">
  <evtTabRubrica Id="ID1${nrInsc}${new Date().getTime()}">
    <ideEvento>
      <tpAmb>${tpAmb}</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>${tpInsc}</tpInsc>
      <nrInsc>${nrInsc}</nrInsc>
    </ideEmpregador>
    <infoRubrica>
      <inclusao>
        <ideRubrica>
          <codRubr>${infoRubrica.inclusao.ideRubrica.codRubr}</codRubr>
          <ideTabRubr>${infoRubrica.inclusao.ideRubrica.ideTabRubr}</ideTabRubr>
          <iniValid>${infoRubrica.inclusao.ideRubrica.iniValid}</iniValid>
          ${infoRubrica.inclusao.ideRubrica.fimValid ? `<fimValid>${infoRubrica.inclusao.ideRubrica.fimValid}</fimValid>` : ''}
        </ideRubrica>
        <dadosRubrica>
          <dscRubr>${this.escapeXml(infoRubrica.inclusao.dadosRubrica.dscRubr)}</dscRubr>
          <natRubr>${infoRubrica.inclusao.dadosRubrica.natRubr}</natRubr>
          <tpRubr>${infoRubrica.inclusao.dadosRubrica.tpRubr}</tpRubr>
          <codIncCP>${infoRubrica.inclusao.dadosRubrica.codIncCP}</codIncCP>
          <codIncIRRF>${infoRubrica.inclusao.dadosRubrica.codIncIRRF}</codIncIRRF>
          <codIncFGTS>${infoRubrica.inclusao.dadosRubrica.codIncFGTS}</codIncFGTS>
        </dadosRubrica>
      </inclusao>
    </infoRubrica>
  </evtTabRubrica>
</eSocial>`;
    }

    /**
     * Build S-1200 XML (Remuneração de Trabalhador)
     */
    static buildS1200(formData: any): string {
        const { tpAmb, tpInsc, nrInsc, ideEvento, ideTrabalhador, dmDev } = formData;

        return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtRemun/v_S_01_02_00">
  <evtRemun Id="ID1${nrInsc}${new Date().getTime()}">
    <ideEvento>
      <indRetif>${ideEvento?.indRetif || 1}</indRetif>
      <indApuracao>${ideEvento?.indApuracao || 1}</indApuracao>
      <perApur>${ideEvento?.perApur}</perApur>
      <tpAmb>${tpAmb}</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>${tpInsc}</tpInsc>
      <nrInsc>${nrInsc}</nrInsc>
    </ideEmpregador>
    <ideTrabalhador>
      <cpfTrab>${ideTrabalhador.cpfTrab}</cpfTrab>
      ${dmDev ? this.buildDmDev(dmDev) : ''}
    </ideTrabalhador>
  </evtRemun>
</eSocial>`;
    }

    /**
     * Build dmDev (Demonstrativos de Valores) section
     */
    private static buildDmDev(dmDev: any[]): string {
        return dmDev.map(dm => `
      <dmDev>
        <ideDmDev>${dm.ideDmDev}</ideDmDev>
        ${dm.ideEstabLot ? this.buildIdeEstabLot(dm.ideEstabLot) : ''}
      </dmDev>`).join('');
    }

    /**
     * Build ideEstabLot (Estabelecimento e Lotação) section
     */
    private static buildIdeEstabLot(ideEstabLot: any[]): string {
        return ideEstabLot.map(estab => `
        <ideEstabLot>
          <tpInsc>${estab.tpInsc}</tpInsc>
          <nrInsc>${estab.nrInsc}</nrInsc>
          <codLotacao>${estab.codLotacao}</codLotacao>
          ${estab.detVerbas ? this.buildDetVerbas(estab.detVerbas) : ''}
        </ideEstabLot>`).join('');
    }

    /**
     * Build detVerbas (Detalhamento de Verbas) section
     */
    private static buildDetVerbas(detVerbas: any[]): string {
        return detVerbas.map(verba => `
          <detVerbas>
            <codRubr>${verba.codRubr}</codRubr>
            <ideTabRubr>${verba.ideTabRubr}</ideTabRubr>
            <qtdRubr>${verba.qtdRubr}</qtdRubr>
            <vrRubr>${verba.vrRubr}</vrRubr>
          </detVerbas>`).join('');
    }

    /**
     * Escape special XML characters
     */
    private static escapeXml(text: string): string {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
}
