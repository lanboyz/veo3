import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GeneratorConfig, PromptResult, ImageData } from '../types';
import InputCard from './InputCard';
import PromptOutput from './PromptOutput';

interface GeneratorLayoutProps<T> {
    config: GeneratorConfig;
    initialState: T;
    generateFunction: (inputs: T) => Promise<PromptResult>;
    title: string;
    description: string;
    expandIdeaFunction: (idea: string) => Promise<Partial<T>>;
    expandImageIdeaFunction: (imageData: ImageData) => Promise<Partial<T>>;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-violet-400"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-violet-400" style={{animationDelay: '0.2s'}}></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-violet-400" style={{animationDelay: '0.4s'}}></div>
        <span className="ml-2">Membuat keajaiban...</span>
    </div>
);

// Define a more specific type for T to ensure it's an object with string keys
type FormState = Record<string, any>;

function GeneratorLayout<T extends FormState>({ config, initialState, generateFunction, title, description, expandIdeaFunction, expandImageIdeaFunction }: GeneratorLayoutProps<T>) {
    const [formState, setFormState] = useState<T>(initialState);
    const [result, setResult] = useState<PromptResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanding, setIsExpanding] = useState(false);
    
    const textareaRefs = useRef<{[key: string]: HTMLTextAreaElement | null}>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            for (const key in textareaRefs.current) {
                const textarea = textareaRefs.current[key];
                if (textarea) {
                    textarea.style.height = 'auto';
                    textarea.style.height = `${textarea.scrollHeight}px`;
                }
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [formState]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }, []);

    const handleExpandIdea = async () => {
        const idea = formState.idePrompt;
        if (!idea?.trim() || isExpanding) return;

        setIsExpanding(true);
        try {
            const expandedDetails = await expandIdeaFunction(idea);
            setFormState(prevState => ({
                ...prevState,
                ...expandedDetails,
            }));
        } catch (error) {
            console.error("Gagal mengembangkan ide:", error);
        } finally {
            setIsExpanding(false);
        }
    };
    
    const readFileAsBase64 = (file: File): Promise<ImageData> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                const base64Data = result.split(',')[1];
                if (base64Data) {
                    resolve({ data: base64Data, mimeType: file.type });
                } else {
                    reject(new Error('Gagal membaca data base64 dari file.'));
                }
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset file input value to allow re-uploading the same file
        if (e.target) e.target.value = ''; 

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Format gambar tidak valid. Harap unggah JPG, PNG, atau WEBP.');
            return;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert('Ukuran gambar terlalu besar. Maksimal 10MB.');
            return;
        }
        
        setIsExpanding(true);
        try {
            const imageData = await readFileAsBase64(file);
            const expandedDetails = await expandImageIdeaFunction(imageData);
            setFormState(prevState => ({
                ...prevState,
                idePrompt: `Sebuah adegan terinspirasi dari gambar yang diunggah.`, // Clear text prompt or set a default
                ...expandedDetails,
            }));
        } catch (error) {
            console.error("Gagal mengembangkan dari gambar:", error);
            alert(`Gagal memproses gambar: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`);
        } finally {
            setIsExpanding(false);
        }
    }, [expandImageIdeaFunction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);
        const generatedResult = await generateFunction(formState);
        setResult(generatedResult);
        setIsLoading(false);
    };
    
    const handleIndonesianPromptChange = (newPrompt: string) => {
        if (result) {
            setResult({ ...result, indonesianPrompt: newPrompt });
        }
    };

    const { idePromptField, categories } = config;
    
    return (
        <div className="space-y-6">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <h2 className="text-3xl font-bold text-violet-700">{title}</h2>
                <p className="text-gray-500 mt-1">{description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Idea Prompt Field */}
                <div className="bg-white rounded-2xl shadow-md p-5">
                    <InputCard key={idePromptField.name as string} label={idePromptField.label} color={idePromptField.color}>
                        <div className="relative">
                            <textarea
                                ref={el => { textareaRefs.current[idePromptField.name as string] = el; }}
                                name={idePromptField.name as string}
                                value={formState[idePromptField.name as keyof T] as string}
                                onChange={handleInputChange}
                                placeholder={idePromptField.placeholder}
                                className="w-full p-3 pr-24 bg-white/60 border border-gray-300 rounded-md focus:ring-1 focus:ring-violet-400 focus:border-violet-400 transition text-base resize-none overflow-y-hidden"
                                rows={1}
                            />
                             <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center space-x-1">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isExpanding}
                                    className="p-2 rounded-full bg-violet-200 hover:bg-violet-300 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all duration-200 group"
                                    title="Kembangkan Ide dari Gambar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-700 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 8c-3.31 0-6 2.69-6 6v2c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-2c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4v1H8v-1c0-2.21 1.79-4 4-4zM19 12c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zM20.65 13.35l-1.79 1.79c-.19.2-.45.3-.71.3-.26 0-.52-.1-.71-.29l-1.79-1.79c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l.38.38V10c0-.55.45-1 1-1s1 .45 1 1v2.71l.38-.38c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41z"/>
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleExpandIdea}
                                    disabled={isExpanding || !formState.idePrompt?.trim()}
                                    className="p-2 rounded-full bg-violet-200 hover:bg-violet-300 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all duration-200 group"
                                    title="Kembangkan Ide dari Teks"
                                >
                                    {isExpanding ? (
                                        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-700 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.836 17.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V19.5a.75.75 0 01.75-.75zM5.106 17.894a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.06-1.061l-1.591 1.59zM3 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3.75A.75.75 0 013 12zM6.164 6.106a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 101.061-1.06l-1.59-1.591z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </InputCard>
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp"
                    />
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {categories.map((category, index) => {
                        const isFirstCategory = index === 0;
                        const categoryWrapperClass = isFirstCategory ? 'lg:col-span-2' : '';
                        const fieldsGridClass = isFirstCategory 
                            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
                            : 'grid-cols-1 sm:grid-cols-2';

                        return (
                            <div key={category.title} className={`bg-white rounded-2xl shadow-md p-5 h-full ${categoryWrapperClass}`}>
                                <h3 className="text-xl font-bold text-gray-700 mb-4">{category.title}</h3>
                                <div className={`grid ${fieldsGridClass} gap-4 items-start`}>
                                    {category.fields.map(field => (
                                        <InputCard key={field.name as string} label={field.label} color={field.color}>
                                            <textarea
                                                ref={el => { textareaRefs.current[field.name as string] = el; }}
                                                name={field.name as string}
                                                value={formState[field.name as keyof T] as string}
                                                onChange={handleInputChange}
                                                placeholder={field.placeholder}
                                                className="w-full p-2 bg-white/60 border border-gray-300 rounded-md focus:ring-1 focus:ring-violet-400 focus:border-violet-400 transition text-sm resize-none overflow-y-hidden"
                                                rows={1}
                                            />
                                        </InputCard>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>


                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center w-full sm:w-auto bg-violet-600 text-white font-bold py-3 px-12 rounded-lg shadow-lg hover:bg-violet-700 disabled:bg-violet-300 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                    >
                        {isLoading ? <LoadingSpinner /> : 'Buat Prompt Ajaib ✨'}
                    </button>
                </div>
            </form>
            
            {(isLoading && !result) && (
                <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg flex justify-center items-center h-48">
                    <LoadingSpinner />
                </div>
            )}

            {result && <PromptOutput result={result} onIndonesianPromptChange={handleIndonesianPromptChange}/>}
        </div>
    );
}

export default GeneratorLayout;