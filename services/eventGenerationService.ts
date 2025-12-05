export class EventGenerationService {
    /**
     * Generate event from form data
     */
    static async generateEvent(eventType: string, formData: any, empregadorId: string) {
        const response = await fetch(`/api/v1/events/generate/${eventType.toLowerCase()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formData, empregadorId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao gerar evento');
        }

        return response.json();
    }

    /**
     * Generate S-1000 event
     */
    static async generateS1000(formData: any, empregadorId: string) {
        return this.generateEvent('s1000', formData, empregadorId);
    }

    /**
     * Generate S-1010 event
     */
    static async generateS1010(formData: any, empregadorId: string) {
        return this.generateEvent('s1010', formData, empregadorId);
    }

    /**
     * Generate S-1200 event
     */
    static async generateS1200(formData: any, empregadorId: string) {
        return this.generateEvent('s1200', formData, empregadorId);
    }
}
