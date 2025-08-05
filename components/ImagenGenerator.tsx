import React from 'react';
import { ImagenFormState } from '../types';
import { IMAGEN_CONFIG } from '../constants';
import { generateImagenPrompt, expandImagenIdea, expandImagenFromImage } from '../services/geminiService';
import GeneratorLayout from './GeneratorLayout';

const initialState: ImagenFormState = {
    idePrompt: '',
    subjek: '',
    usia: '',
    warnaKulit: '',
    wajah: '',
    rambut: '',
    pakaian: '',
    asal: '',
    asesoris: '',
    aksi: '',
    ekspresi: '',
    tempat: '',
    waktu: '',
    kamera: '',
    pencahayaan: '',
    gaya: '',
    kualitasGambar: '',
    suasanaGambar: '',
    aspekRasio: '16:9',
    detailTambahan: '',
};

const ImagenGenerator: React.FC = () => {
    return (
        <GeneratorLayout<ImagenFormState>
            config={IMAGEN_CONFIG}
            initialState={initialState}
            generateFunction={generateImagenPrompt}
            expandIdeaFunction={expandImagenIdea}
            expandImageIdeaFunction={expandImagenFromImage}
            title="Imagen Prompt Generator"
            description="Rancang detail visual Anda untuk menghasilkan prompt gambar yang kaya dan artistik."
        />
    );
};

export default ImagenGenerator;