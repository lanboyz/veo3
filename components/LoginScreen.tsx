import React, { useState } from 'react';

interface LoginScreenProps {
    onLogin: (name: string) => void;
    isExiting: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isExiting }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin(name.trim());
        }
    };

    return (
        <div 
            className={`fixed inset-0 z-40 flex flex-col justify-center items-center bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 overflow-hidden ${isExiting ? 'animate-fade-out' : 'animate-content-fade-in'}`}
        >
            {/* Decorative shapes */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-10 right-20 w-16 h-16 bg-white/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
            <div className="absolute bottom-10 left-20 w-20 h-20 bg-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>

            <div className="text-center relative z-10">
                <div className="bg-white/30 backdrop-blur-sm p-8 rounded-2xl shadow-2xl animate-pop-in w-full max-w-sm">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Selamat Datang!
                    </h1>
                    <p className="text-white/80 mt-2 text-base">
                        Silakan masukkan nama Anda untuk melanjutkan.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-6">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ketik nama Anda di sini..."
                            className="w-full px-4 py-3 rounded-lg bg-white/80 text-gray-800 placeholder-gray-500 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="w-full mt-4 bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                        >
                            Lanjutkan
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
