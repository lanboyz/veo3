
import { GoogleGenAI, Type } from "@google/genai";
import { VeoFormState, ImagenFormState, PromptResult, GeneratorConfig, ImageData } from '../types';
import { VEO_CONFIG, IMAGEN_CONFIG } from '../constants';

if (!process.env.API_KEY) {
    console.error("API Key for Gemini is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const veoResponseSchema = {
    type: Type.OBJECT,
    properties: {
        indonesianPrompt: { type: Type.STRING, description: "Prompt lengkap dalam Bahasa Indonesia, diakhiri dengan paragraf 'Negative Prompt:'." },
        englishPrompt: { type: Type.STRING, description: "Terjemahan prompt ke Bahasa Inggris (kecuali semua input 'kalimatDiucapkan'), diakhiri dengan paragraf 'Negative Prompt:'." },
        englishPromptWithScenes: { type: Type.STRING, description: "Terjemahan prompt ke Bahasa Inggris secara LENGKAP termasuk rangkaian adegan yang terperinci. Pastikan konsistensi karakter (nama, penampilan) di semua adegan. Posisi 'Negative Prompt' harus sebelum rangkaian adegan." }
    },
    required: ["indonesianPrompt", "englishPrompt", "englishPromptWithScenes"],
};

const imagenResponseSchema = {
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

    const spokenInputs = Object.entries(inputs)
        .filter(([key, value]) => key.startsWith('kalimatDiucapkan') && value && (value as string).trim() !== '')
        .map(([key, value]) => `"${value}"`);

    const spokenWordsInstruction = spokenInputs.length > 0
        ? `Bagian-bagian berikut TIDAK BOLEH diterjemahkan ke Bahasa Inggris: ${spokenInputs.join(', ')}.`
        : '';


    let baseInstruction = `
        Anda adalah seorang ahli penulis prompt untuk model AI generatif.
        Tugas Anda adalah mengubah input kata kunci menjadi prompt yang kaya, deskriptif, dan terstruktur untuk model ${modelName}.

        Aturan:
        1. Kembangkan setiap input menjadi kalimat yang mengalir dan detail. Gabungkan semua elemen menjadi satu narasi yang koheren. Jika ada input adegan (adegan1, adegan2, dst.), buatlah cerita yang mengalir dari adegan ke adegan.
        2. Hasil harus dalam format JSON yang valid, sesuai dengan skema yang diberikan.
        3. Buat prompt Bahasa Indonesia terlebih dahulu.
        4. Kemudian, terjemahkan prompt Bahasa Indonesia ke Bahasa Inggris untuk 'englishPrompt'. ${spokenWordsInstruction}
        5. PENTING: Di akhir prompt 'indonesianPrompt' dan 'englishPrompt', tambahkan paragraf baru yang dimulai dengan "Negative Prompt:" diikuti oleh daftar hal-hal yang harus dihindari dalam Bahasa Inggris (contoh: 'ugly, deformed, blurry, bad anatomy, low quality, watermark, text, signature'). Untuk 'englishPromptWithScenes', posisi "Negative Prompt:" diatur secara spesifik di aturan #8.
        6. Pastikan prompt utama sangat detail dan imajinatif.
    `;
    
    if (type === 'veo') {
        baseInstruction += `
        7. Untuk 'indonesianPrompt', gabungkan secara alami dialog dari 'kalimatDiucapkanAdegan1', 'kalimatDiucapkanAdegan2', dst. ke dalam deskripsi adegan yang sesuai.
        8. Untuk field 'englishPromptWithScenes', formatnya harus spesifik dan berurutan:
           a. Pertama, tulis prompt utama sinematik dalam Bahasa Inggris yang merangkum keseluruhan ide. Bagian ini TIDAK BOLEH menyertakan dialog atau kalimat yang diucapkan (baik global maupun per adegan) dan TIDAK BOLEH berisi rincian adegan per adegan. Fokus hanya pada gaya, kualitas, dan atmosfer umum.
           b. KEDUA, LANGSUNG setelah prompt utama, tambahkan paragraf "Negative Prompt:" seperti yang diinstruksikan di aturan #5.
           c. KETIGA, setelah "Negative Prompt:", tulis daftar adegan bernomor (Scene 1, Scene 2, dst.). Setiap adegan harus merupakan narasi detail dari 'adegan1', 'adegan2', dst.
           d. SANGAT PENTING: Untuk setiap deskripsi adegan, Anda WAJIB menyertakan dialog yang sesuai dari 'kalimatDiucapkanAdegan1', 'kalimatDiucapkanAdegan2', dst. secara persis seperti aslinya, tanpa terjemahan. Contoh: jika 'adegan1' adalah 'Seorang ksatria di depan kastil' dan 'kalimatDiucapkanAdegan1' adalah 'Aku akan masuk!', maka adegan dalam bahasa Inggris harus menjadi seperti 'Scene 1: A knight stands in front of a castle. He says, "Aku akan masuk!"'.
           e. Pastikan karakter utama (subjek) konsisten di semua adegan (berikan nama jika belum ada untuk menjaga konsistensi).
        `;
    }
    
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

        const responseSchema = type === 'veo' ? veoResponseSchema : imagenResponseSchema;

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
            englishPromptWithScenes: parsedResult.englishPromptWithScenes || '',
        };

    } catch (error) {
        console.error("Error generating prompt with Gemini:", error);
        const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
        if (type === 'veo') {
             return {
                indonesianPrompt: `Gagal menghasilkan prompt. Kesalahan: ${errorMessage}`,
                englishPrompt: `Failed to generate prompt. Error: ${errorMessage}`,
                englishPromptWithScenes: `Failed to generate scene prompt. Error: ${errorMessage}`,
            };
        }
        return {
            indonesianPrompt: `Gagal menghasilkan prompt. Kesalahan: ${errorMessage}`,
            englishPrompt: `Failed to generate prompt. Error: ${errorMessage}`,
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
        if (field.name.startsWith('kalimatDiucapkan')) {
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
    let systemInstruction: string;

    if (type === 'veo') {
        systemInstruction = `
        Anda adalah seorang asisten penulis skenario dan direktur seni yang sangat kreatif dengan spesialisasi dalam membangun narasi yang koheren.
        Tugas Anda adalah mengambil sebuah ide utama dari pengguna dan mengembangkannya menjadi detail-detail spesifik untuk sebuah cerita yang utuh.

        ATURAN UTAMA:
        1.  **KONSISTENSI TEMA:** Anda WAJIB menjaga agar kelima adegan berada dalam satu tema atau lingkungan yang sama. DILARANG KERAS melompat-lompat tema. Jika temanya adalah "seorang dokter di rumah sakit", maka semua adegan harus berhubungan dengan aktivitasnya di lingkungan medis (misal: memeriksa pasien, operasi, konsultasi), bukan tiba-tiba berada di pantai.
        2.  **ALUR CERITA LOGIS:** Kelima adegan harus membentuk sebuah alur cerita yang masuk akal dan berkesinambungan. Adegan 2 harus menjadi kelanjutan logis dari Adegan 1, Adegan 3 dari Adegan 2, dan seterusnya. Ciptakan sebuah narasi mini.
        3.  **PENGISIAN FIELD:**
            a. Isi kolom 'Adegan 1' sampai 'Adegan 5' sesuai alur cerita yang Anda buat.
            b. Untuk SETIAP adegan, tulis juga dialog atau kalimat pendek yang relevan di field 'kalimatDiucapkanAdegan1' sampai 'kalimatDiucapkanAdegan5'.
            c. Isi SEMUA field lain (subjek, pakaian, tempat, dll) dengan deskripsi yang konsisten dengan cerita dan tema utama.
        4.  Jawaban harus dalam bahasa Indonesia.
        `;
    } else { // imagen
        systemInstruction = `
        Anda adalah seorang asisten penulis skenario dan direktur seni yang sangat kreatif.
        Tugas Anda adalah mengambil sebuah ide utama dari pengguna dan mengembangkannya menjadi detail-detail spesifik untuk setiap kategori yang diminta.
        Isi setiap field dalam skema JSON yang diberikan dengan deskripsi yang relevan, imajinatif, dan sesuai dengan ide utama.
        Pastikan semua field terisi dengan lengkap dan detail. Jawaban harus dalam bahasa Indonesia.
    `;
    }
    const contents = `Kembangkan ide utama ini: "${idea}"`;
    return performExpansion(config, systemInstruction, contents);
}

async function expandFromImage(imageData: ImageData, type: 'veo' | 'imagen'): Promise<Partial<VeoFormState | ImagenFormState>> {
    const config: GeneratorConfig = type === 'veo' ? VEO_CONFIG : IMAGEN_CONFIG;
    let systemInstruction: string;
    
    if (type === 'veo') {
        systemInstruction = `
        Anda adalah seorang analis visual dan direktur seni yang sangat kreatif dengan spesialisasi dalam menafsirkan gambar menjadi narasi yang koheren.
        Tugas Anda adalah menganalisis gambar yang diberikan dan menciptakan sebuah cerita singkat yang utuh dan logis yang terinspirasi darinya.

        ATURAN UTAMA:
        1.  **CIPTAKAN CERITA YANG KOHEREN:** Bayangkan sebuah cerita singkat yang terjadi sebelum, selama, dan sesudah momen di dalam gambar. Cerita ini harus memiliki alur yang logis dan tema yang konsisten.
        2.  **BANGUN ADEGAN BERDASARKAN CERITA:** Pecah cerita yang Anda ciptakan menjadi 5 adegan kunci yang mengalir dan isi kolom 'Adegan 1' sampai 'Adegan 5'. Jangan membuat adegan acak, pastikan mereka menceritakan kisah yang Anda bayangkan.
        3.  **KONSISTENSI KARAKTER & LINGKUNGAN:** Pastikan subjek dan lingkungan konsisten di kelima adegan.
        4.  **PENGISIAN FIELD:**
            a. Berdasarkan cerita yang Anda buat, tulis juga dialog atau kalimat pendek yang relevan di field 'kalimatDiucapkanAdegan1' sampai 'kalimatDiucapkanAdegan5'.
            b. Analisis elemen visual dari gambar untuk mengisi SEMUA field lain dalam skema JSON (subjek, pakaian, tempat, dll) secara konsisten dengan cerita.
            c. Jadilah imajinatif untuk detail yang tidak terlihat (seperti suara atau musik) agar sesuai dengan cerita.
        5.  Jawaban harus dalam bahasa Indonesia.
        `;
    } else { // imagen
        systemInstruction = `
        Anda adalah seorang analis visual dan direktur seni yang sangat kreatif.
        Tugas Anda adalah menganalisis gambar yang diberikan dan mengisinya ke dalam detail-detail spesifik untuk setiap kategori yang diminta dalam skema JSON.
        Jadilah imajinatif. Jika sebuah detail tidak terlihat jelas di gambar (seperti 'asal negara' atau 'suara/musik'), buatlah saran yang kreatif dan sesuai dengan suasana gambar tersebut.
        Isi setiap field dengan lengkap dan detail. Jawaban harus dalam bahasa Indonesia.
    `;
    }
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
