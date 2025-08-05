export interface VeoFormState {
    idePrompt: string;
    subjek: string;
    usia: string;
    warnaKulit: string;
    wajah: string;
    rambut: string;
    pakaian: string;
    asal: string;
    asesoris: string;
    aksi: string;
    ekspresi: string;
    tempat: string;
    waktu: string;
    gerakanKamera: string;
    pencahayaan: string;
    gayaVideo: string;
    kualitasVideo: string;
    suasanaVideo: string;
    suaraMusik: string;
    kalimatDiucapkan: string;
    detailTambahan: string;
}

export interface ImagenFormState {
    idePrompt: string;
    subjek: string;
    usia: string;
    warnaKulit: string;
    wajah: string;
    rambut: string;
    pakaian: string;
    asal: string;
    asesoris: string;
    aksi: string;
    ekspresi: string;
    tempat: string;
    waktu: string;
    kamera: string;
    pencahayaan: string;
    gaya: string;
    kualitasGambar: string;
    suasanaGambar: string;
    aspekRasio: string;
    detailTambahan: string;
}

export interface PromptResult {
    indonesianPrompt: string;
    englishPrompt: string;
}

export interface FormField {
    name: keyof VeoFormState | keyof ImagenFormState;
    label: string;
    placeholder: string;
    color: string;
}

export interface FieldCategory {
  title: string;
  fields: FormField[];
}

export interface GeneratorConfig {
  idePromptField: FormField;
  categories: FieldCategory[];
}

export interface ImageData {
    data: string; // base64 encoded string
    mimeType: string;
}

export interface Notification {
  id: number;
  message: string;
}
