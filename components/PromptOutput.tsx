import React from 'react';
import { PromptResult } from '../types';

interface PromptOutputProps {
    result: PromptResult;
    onIndonesianPromptChange: (newPrompt: string) => void;
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 bg-white/50 backdrop-blur text-gray-600 hover:bg-violet-100 p-2 rounded-lg transition-all"
            title="Salin ke clipboard"
        >
            {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
        </button>
    );
};


const PromptOutput: React.FC<PromptOutputProps> = ({ result, onIndonesianPromptChange }) => {
    return (
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-violet-600 mb-4">Hasil Prompt</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {/* Indonesian Prompt */}
                <div className="relative">
                    <label className="text-lg font-semibold text-gray-700 mb-2 block">Prompt (Bahasa Indonesia - Dapat Diedit)</label>
                    <div className="relative">
                        <textarea
                            value={result.indonesianPrompt}
                            onChange={(e) => onIndonesianPromptChange(e.target.value)}
                            className="w-full h-72 p-3 bg-violet-50 border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-colors"
                            placeholder="Prompt dalam Bahasa Indonesia akan muncul di sini..."
                        />
                         <CopyButton textToCopy={result.indonesianPrompt} />
                    </div>
                </div>

                {/* English Prompt */}
                <div className="relative">
                    <label className="text-lg font-semibold text-gray-700 mb-2 block">Final Prompt (English)</label>
                     <div className="relative">
                        <textarea
                            value={result.englishPrompt}
                            readOnly
                            className="w-full h-72 p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
                            placeholder="Final prompt dalam Bahasa Inggris akan muncul di sini..."
                        />
                        <CopyButton textToCopy={result.englishPrompt} />
                    </div>
                </div>
            </div>

            {/* New English Prompt with Scenes - only show if it exists */}
            {result.englishPromptWithScenes && (
                <div className="relative mt-6">
                    <label className="text-lg font-semibold text-gray-700 mb-2 block">Final Prompt + Rangkaian Adegan (English)</label>
                    <div className="relative">
                        <textarea
                            value={result.englishPromptWithScenes}
                            readOnly
                            className="w-full h-96 p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
                            placeholder="Final prompt dengan rangkaian adegan akan muncul di sini..."
                        />
                        <CopyButton textToCopy={result.englishPromptWithScenes} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptOutput;