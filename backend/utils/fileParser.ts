import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import {PDFParse} from 'pdf-parse';

export const parseFile = async (buffer: Buffer, originalname: string): Promise<string> => {
    const extension = originalname.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
        try {
            // const data = await pdf(buffer);
            // return data.text;
            const data = new PDFParse(buffer);
            return (await data.getText()).text;
        } catch (error) {
            console.error(`Error parsing PDF ${originalname}:`, error);
            return "";
        }
    } else if (extension === 'txt') {
        return buffer.toString('utf-8');
    }

    return "";
};
