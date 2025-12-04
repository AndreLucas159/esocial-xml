import * as forge from 'node-forge';
import { SignedXml } from 'xml-crypto';
import { DOMParser } from 'xmldom';

export class SignerService {
    /**
     * Signs an XML string using a PFX certificate
     */
    static signXml(xml: string, pfxBuffer: Buffer, password: string, tagToSign: string): string {
        console.error('################################################################');
        console.error('### XML ORIGINAL (ANTES DA ASSINATURA) #########################');
        console.error(xml);
        console.error('################################################################');

        try {
            // 1. Parse PFX
            const p12Der = forge.util.decode64(pfxBuffer.toString('base64'));
            const p12Asn1 = forge.asn1.fromDer(p12Der);
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

            // 2. Get Key and Certificate
            let key: string | null = null;
            let cert: string | null = null;

            // Iterate through safe bags to find key and cert
            const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
            const certBag = bags[forge.pki.oids.certBag]?.[0];

            if (certBag && certBag.cert) {
                cert = forge.pki.certificateToPem(certBag.cert);
            }

            const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
            const keyBag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0];

            if (keyBag && keyBag.key) {
                key = forge.pki.privateKeyToPem(keyBag.key);
            }

            if (!key || !cert) {
                throw new Error('Could not extract Private Key or Certificate from PFX');
            }

            console.log('Private Key extracted. Length:', key.length);
            console.log('Certificate extracted. Length:', cert.length);

            // 3. Clean PEM headers for xml-crypto
            // xml-crypto usually expects the PEM string as is, but let's ensure it's clean

            // 4. Prepare XML
            // We need to sign the specific event tag, e.g., <evtInfoEmpregador>
            // The signature should be appended to the element

            console.log('--- XML Original (Antes da Assinatura) ---');
            console.log(xml);
            console.log('------------------------------------------');

            // Cast to any to avoid TypeScript errors with xml-crypto types
            const sig: any = new SignedXml();
            sig.addReference({
                xpath: `//*[local-name(.)='${tagToSign}']`,
                transforms: [
                    "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
                    "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
                ],
                digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256"
            });

            if (typeof key !== 'string') {
                throw new Error('Private key must be a string');
            }

            // Try converting to Buffer
            const keyBuffer = Buffer.from(key);
            sig.signingKey = keyBuffer;
            (sig as any).key = keyBuffer;
            (sig as any).privateKey = keyBuffer; // This is the fix for xml-crypto internal check

            console.log('Signing Key set. Is Buffer?', Buffer.isBuffer(sig.signingKey));
            console.log('Signing Key length:', sig.signingKey.length);

            sig.canonicalizationAlgorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
            sig.signatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";

            // Add KeyInfo with X509Certificate
            sig.keyInfoProvider = {
                getKeyInfo: () => {
                    const certBody = cert!.replace(/-----BEGIN CERTIFICATE-----/g, '')
                        .replace(/-----END CERTIFICATE-----/g, '')
                        .replace(/\s/g, '');
                    return `<X509Data><X509Certificate>${certBody}</X509Certificate></X509Data>`;
                },
                getKey: () => keyBuffer
            };

            // @ts-ignore
            sig.computeSignature(xml, { signingKey: keyBuffer });
            return sig.getSignedXml();

        } catch (error) {
            console.error('Error signing XML:', error);
            throw new Error('Failed to sign XML: ' + (error as Error).message);
        }
    }
}
