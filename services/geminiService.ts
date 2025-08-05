import { GoogleGenAI, Type } from "@google/genai";
import { VeoFormState, ImagenFormState, PromptResult, GeneratorConfig, ImageData } from '../types';
import { VEO_CONFIG, IMAGEN_CONFIG } from '../constants';

if (!process.env.API_KEY) {
    console.error("API Key for Gemini is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        indonesianPrompt: { type: Type.STRING, description: "Prompt lengkap dalam Bahasa Indonesia, diakhiri dengan paragraf 'Negative Prompt:'." },
        englishPrompt: { type: Type.STRING, description: "Terjemahan prompt ke Bahasa Inggris (kecuali 'kalimat yang diucapkan'), diakhiri dengan paragraf 'Negative Prompt:'." },
    },
    required: ["indonesianPrompt", "englishPrompt"],
};


function buildSystemInstruction(type: 'veo' | 'imagen', inputs: VeoFormState | ImagenFormState): string {
    const modelName = type === 'veo' ? 'Veo 3' : 'Imagen';
    
    const { idePrompt, ...otherInputs } = inputs as any;

    const otherInputsString = Object.entries(otherInputs)
        .filter(([, value]) => value && (value as string).trim() !== '')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

    const kalimatDiucapkan = (inputs as VeoFormState).kalimatDiucapkan;
    const spokenWordsInstruction = kalimatDiucapkan ? `Bagian 'kalimatDiucapkan' yaitu "${kalimatDiucapkan}" TIDAK BOLEH diterjemahkan ke Bahasa Inggris.` : '';

    const baseInstruction = `
        Anda adalah seorang ahli penulis prompt untuk model AI generatif.
        Tugas Anda adalah mengubah input kata kunci menjadi prompt yang kaya, deskriptif, dan terstruktur untuk model ${modelName}.

        Aturan:
        1. Kembangkan setiap input menjadi kalimat yang mengalir dan detail. Gabungkan semua elemen menjadi satu narasi yang koheren.
        2. Hasil harus dalam format JSON yang valid, sesuai dengan skema yang diberikan.
        3. Buat prompt Bahasa Indonesia terlebih dahulu.
        4. Kemudian, terjemahkan prompt Bahasa Indonesia ke Bahasa Inggris untuk 'englishPrompt'. ${spokenWordsInstruction}
        5. PENTING: Di akhir 'indonesianPrompt' dan 'englishPrompt', tambahkan paragraf baru yang dimulai dengan "Negative Prompt:" diikuti oleh daftar hal-hal yang harus dihindari dalam Bahasa Inggris (contoh: 'ugly, deformed, blurry, bad anatomy, low quality, watermark, text, signature').
        6. Pastikan prompt utama sangat detail dan imajinatif.
    `;
    
    if (idePrompt && idePrompt.trim() !== '') {
        return `
            ${baseInstruction}

            Gunakan ide utama berikut sebagai dasar untuk membuat prompt. Kembangkan ide ini dengan detail pendukung yang diberikan. Jika ada detail pendukung yang kosong, isi secara kreatif agar sesuai dengan ide utama.
            
            Ide Utama: "${idePrompt}"
            Detail Pendukung: ${otherInputsString || 'Tidak ada, kembangkan sepenuhnya dari ide utama.'}
        `;
    } else {
         return `
            ${baseInstruction}
            
            Gunakan detail berikut untuk membuat prompt. Gabungkan menjadi sebuah prompt yang koheren.
            Input Pengguna: ${otherInputsString}
         `;
    }
}

async function generatePrompt(inputs: VeoFormState | ImagenFormState, type: 'veo' | 'imagen'): Promise<PromptResult> {
    try {
        const systemInstruction = buildSystemInstruction(type, inputs);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Buat prompt berdasarkan instruksi sistem dan input pengguna.",
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const text = response.text.trim();
        // Sometimes the response can be wrapped in ```json ... ```
        const cleanedJsonString = text.replace(/^```json\s*|```$/g, '');
        const parsedResult = JSON.parse(cleanedJsonString);

        return {
            indonesianPrompt: parsedResult.indonesianPrompt || '',
            englishPrompt: parsedResult.englishPrompt || '',
        };

    } catch (error) {
        console.error("Error generating prompt with Gemini:", error);
        if (error instanceof Error) {
             return {
                indonesianPrompt: `Gagal menghasilkan prompt. Kesalahan: ${error.message}`,
                englishPrompt: `Failed to generate prompt. Error: ${error.message}`,
            };
        }
        return {
            indonesianPrompt: "Terjadi kesalahan yang tidak diketahui.",
            englishPrompt: "An unknown error occurred.",
        };
    }
}

// Reusable function to perform expansion to avoid code duplication
async function performExpansion(
    config: GeneratorConfig, 
    systemInstruction: string,
    contents: any // string or parts array
): Promise<any> {
    const allFields = config.categories.flatMap(c => c.fields);
    
    const schemaProperties: { [key: string]: { type: Type, description: string } } = {};
    const requiredFields: string[] = [];

    allFields.forEach(field => {
        let description = `Saran kreatif dan detail untuk '${field.label}'.`;
        if (field.name === 'kalimatDiucapkan') {
            description = `Saran kalimat pendek dan ringkas (maksimal 15 kata) yang mungkin diucapkan oleh subjek. Harus berupa kutipan dialog langsung. Contoh: "Kita harus segera pergi."`;
        }
        
        schemaProperties[field.name as string] = {
            type: Type.STRING,
            description: description
        };
        requiredFields.push(field.name as string);
    });

    const expansionSchema = {
        type: Type.OBJECT,
        properties: schemaProperties,
        required: requiredFields
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: expansionSchema,
            },
        });

        const text = response.text.trim();
        const cleanedJsonString = text.replace(/^```json\s*|```$/g, '');
        return JSON.parse(cleanedJsonString);

    } catch (error) {
        console.error("Error during expansion with Gemini:", error);
        alert(`Gagal mengembangkan ide: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return {};
    }
}

async function expandIdea(idea: string, type: 'veo' | 'imagen'): Promise<Partial<VeoFormState | ImagenFormState>> {
    const config: GeneratorConfig = type === 'veo' ? VEO_CONFIG : IMAGEN_CONFIG;
    const systemInstruction = `
        Anda adalah seorang asisten penulis skenario dan direktur seni yang sangat kreatif.
        Tugas Anda adalah mengambil sebuah ide utama dari pengguna dan mengembangkannya menjadi detail-detail spesifik untuk setiap kategori yang diminta.
        Isi setiap field dalam skema JSON yang diberikan dengan deskripsi yang relevan, imajinatif, dan sesuai dengan ide utama.
        Pastikan semua field terisi dengan lengkap dan detail. Jawaban harus dalam bahasa Indonesia.
    `;
    const contents = `Kembangkan ide utama ini: "${idea}"`;
    return performExpansion(config, systemInstruction, contents);
}

async function expandFromImage(imageData: ImageData, type: 'veo' | 'imagen'): Promise<Partial<VeoFormState | ImagenFormState>> {
    const config: GeneratorConfig = type === 'veo' ? VEO_CONFIG : IMAGEN_CONFIG;
    const systemInstruction = `
        Anda adalah seorang analis visual dan direktur seni yang sangat kreatif.
        Tugas Anda adalah menganalisis gambar yang diberikan dan mengisinya ke dalam detail-detail spesifik untuk setiap kategori yang diminta dalam skema JSON.
        Jadilah imajinatif. Jika sebuah detail tidak terlihat jelas di gambar (seperti 'asal negara' atau 'suara/musik'), buatlah saran yang kreatif dan sesuai dengan suasana gambar tersebut.
        Isi setiap field dengan lengkap dan detail. Jawaban harus dalam bahasa Indonesia.
    `;
    const imagePart = {
        inlineData: {
            mimeType: imageData.mimeType,
            data: imageData.data,
        },
    };
    const textPart = {
        text: "Analisis gambar ini dan isi semua field dalam skema JSON yang diberikan secara kreatif."
    };
    const contents = { parts: [imagePart, textPart] };

    return performExpansion(config, systemInstruction, contents);
}

export const generateVeoPrompt = (inputs: VeoFormState): Promise<PromptResult> => {
    return generatePrompt(inputs, 'veo');
};

export const generateImagenPrompt = (inputs: ImagenFormState): Promise<PromptResult> => {
    return generatePrompt(inputs, 'imagen');
};

export const expandVeoIdea = (idea: string): Promise<Partial<VeoFormState>> => {
    return expandIdea(idea, 'veo') as Promise<Partial<VeoFormState>>;
};

export const expandImagenIdea = (idea: string): Promise<Partial<ImagenFormState>> => {
    return expandIdea(idea, 'imagen') as Promise<Partial<ImagenFormState>>;
};

export const expandVeoFromImage = (imageData: ImageData): Promise<Partial<VeoFormState>> => {
    return expandFromImage(imageData, 'veo') as Promise<Partial<VeoFormState>>;
};

export const expandImagenFromImage = (imageData: ImageData): Promise<Partial<ImagenFormState>> => {
    return expandFromImage(imageData, 'imagen') as Promise<Partial<ImagenFormState>>;
};