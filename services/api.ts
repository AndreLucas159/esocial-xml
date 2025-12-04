export const transmitEvent = async (
    xml: string,
    certificateFile: File,
    password: string,
    tagToSign: string
) => {
    const formData = new FormData();
    formData.append('xml', xml);
    formData.append('certificate', certificateFile);
    formData.append('password', password);
    formData.append('tagToSign', tagToSign);

    try {
        const response = await fetch('http://localhost:3001/api/transmit', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to transmit');
        }

        return await response.json();
    } catch (error) {
        console.error('Transmission error:', error);
        throw error;
    }
};
