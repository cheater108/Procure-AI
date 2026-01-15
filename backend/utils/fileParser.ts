import pdf from '@cedrugs/pdf-parse';

export const parseFile = async (buffer: Buffer, originalname: string): Promise<string> => {
    const extension = originalname.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
        try {
            const data = await pdf(buffer);
            return data.text;
        } catch (error) {
            console.error(`Error parsing PDF ${originalname}:`, error);
            return "";
        }
    } else if (extension === 'txt') {
        return buffer.toString('utf-8');
    }

    return "";
};
