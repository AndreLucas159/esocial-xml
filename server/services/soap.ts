import axios from 'axios';
import * as https from 'https';
import * as forge from 'node-forge';

export class SoapService {
    private static readonly ESOCIAL_URL_PRE_PROD = 'https://webservices.producaorestrita.esocial.gov.br/servicos/empregador/enviarloteeventos/WsEnviarLoteEventos.svc';

    static async sendToEsocial(signedXml: string, pfx: Buffer, password: string): Promise<{ response: any, soapEnvelope: string }> {
        // Remove cabeçalho XML se existir na string assinada para evitar duplicação
        const cleanSignedXml = signedXml.replace(/^<\?xml.+?\?>/, '').trim();

        // Extract info for batch wrapper
        const idMatch = signedXml.match(/Id="([^"]+)"/);
        const tpInscMatch = signedXml.match(/<tpInsc>(\d+)<\/tpInsc>/);
        const nrInscMatch = signedXml.match(/<nrInsc>(\d+)<\/nrInsc>/);

        if (!idMatch || !tpInscMatch || !nrInscMatch) {
            throw new Error('Could not extract Id, tpInsc or nrInsc from signed XML');
        }

        const id = idMatch[1];
        const tpInsc = tpInscMatch[1];
        const nrInsc = nrInscMatch[1];

        // Determine group based on event tag
        let grupo = 1; // Default to Tables
        const rootTagMatch = cleanSignedXml.match(/<(\w+)/);
        if (rootTagMatch) {
            const tagName = rootTagMatch[1];
            if (tagName.startsWith('evtInfoEmpregador') || tagName.startsWith('evtTabela')) {
                grupo = 1; // Tables (S-1000 to S-1080)
            } else if (tagName.startsWith('evtRemun') || tagName.startsWith('evtPgtos') || tagName.startsWith('evtAqProd') || tagName.startsWith('evtComProd')) {
                grupo = 3; // Periodic (S-1200 to S-1299)
            } else {
                grupo = 2; // Non-Periodic (S-2190 to S-2420, etc) - Default for others
            }
        }

        const batchXml = `<eSocial xmlns="http://www.esocial.gov.br/schema/lote/eventos/envio/v1_1_1">
    <envioLoteEventos grupo="${grupo}">
        <ideEmpregador>
            <tpInsc>${tpInsc}</tpInsc>
            <nrInsc>${nrInsc}</nrInsc>
        </ideEmpregador>
        <ideTransmissor>
            <tpInsc>${tpInsc}</tpInsc>
            <nrInsc>${nrInsc}</nrInsc>
        </ideTransmissor>
        <eventos>
            <evento Id="${id}">
                ${cleanSignedXml}
            </evento>
        </eventos>
    </envioLoteEventos>
</eSocial>`;

        const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:esocial="http://www.esocial.gov.br/schema/lote/eventos/envio/v1_1_1">
    <soap:Body>
        <esocial:EnviarLoteEventos>
            <esocial:loteEventos>
              ${batchXml}
            </esocial:loteEventos>
        </esocial:EnviarLoteEventos>
    </soap:Body>
</soap:Envelope>`;

        console.log('--- XML Montado para Envio (SOAP Envelope) ---');
        console.log(soapEnvelope);
        console.log('----------------------------------------------');

        // Extract Key and Cert using node-forge to avoid "Unsupported PKCS12 PFX data" error
        // caused by newer Node versions/OpenSSL not liking some PFX formats/algorithms
        const p12Der = forge.util.decode64(pfx.toString('base64'));
        const p12Asn1 = forge.asn1.fromDer(p12Der);
        const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

        let keyPem: string | null = null;
        let certPem: string | null = null;

        const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
        const certBag = bags[forge.pki.oids.certBag]?.[0];
        if (certBag && certBag.cert) {
            certPem = forge.pki.certificateToPem(certBag.cert);
        }

        const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
        const keyBag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0];
        if (keyBag && keyBag.key) {
            keyPem = forge.pki.privateKeyToPem(keyBag.key);
        }

        if (!keyPem || !certPem) {
            throw new Error('Could not extract Private Key or Certificate from PFX for SSL connection');
        }

        const httpsAgent = new https.Agent({
            cert: certPem,
            key: keyPem,
            rejectUnauthorized: false // Em produção deve ser true, mas para testes/pre-prod às vezes é necessário false se a cadeia não estiver completa
        });

        try {
            const response = await axios.post(this.ESOCIAL_URL_PRE_PROD, soapEnvelope, {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    'SOAPAction': 'http://www.esocial.gov.br/servicos/empregador/lote/eventos/envio/v1_1_0/ServicoEnviarLoteEventos/EnviarLoteEventos'
                },
                httpsAgent: httpsAgent
            });

            return {
                response: response.data,
                soapEnvelope
            };
        } catch (error) {
            console.error('Error sending to eSocial:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    return {
                        response: error.response.data,
                        soapEnvelope
                    };
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error setting up request:', error.message);
                }
            }
            throw new Error('Failed to connect to eSocial WebService: ' + (error as Error).message);
        }
    }
}
