import React from 'react';
import { VeoFormState } from '../types';
import { VEO_CONFIG } from '../constants';
import { generateVeoPrompt, expandVeoIdea, expandVeoFromImage } from '../services/geminiService';
import GeneratorLayout from './GeneratorLayout';

const initialState: VeoFormState = {
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
    gerakanKamera: '',
    pencahayaan: '',
    gayaVideo: '',
    kualitasVideo: '',
    suasanaVideo: '',
    suaraMusik: '',
    kalimatDiucapkan: '',
    detailTambahan: '',
};

const VeoGenerator: React.FC = () => {
    return (
        <GeneratorLayout<VeoFormState>
            config={VEO_CONFIG}
            initialState={initialState}
            generateFunction={generateVeoPrompt}
            expandIdeaFunction={expandVeoIdea}
            expandImageIdeaFunction={expandVeoFromImage}
            title="VEO-3 Prompt Generator"
            description="Isi detail di bawah ini untuk menciptakan prompt video sinematik yang menakjubkan."
        />
    );
};

export default VeoGenerator;