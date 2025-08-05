import React, { useState, useEffect } from 'react';

interface WelcomeScreenProps {
    isExiting: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ isExiting }) => {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Mengatur interval untuk mengurangi hitungan mundur setiap detik.
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                // Menghentikan hitungan mundur pada angka 1.
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    return 1;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        // Membersihkan interval saat komponen dilepas.
        return () => clearInterval(timer);
    }, []); // Array dependensi kosong memastikan efek ini hanya berjalan sekali saat mount.

    return (
        <div 
            className={`fixed inset-0 z-50 flex flex-col justify-center items-center bg-gradient-to-br from-violet-400 via-purple-500 to-pink-500 overflow-hidden ${isExiting ? 'animate-fade-out' : ''}`}
        >
            {/* Decorative shapes */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-10 right-20 w-16 h-16 bg-white/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
            <div className="absolute bottom-10 left-20 w-20 h-20 bg-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>

            <div className="text-center relative z-10 p-4">
                <div className="bg-white/30 backdrop-blur-sm p-8 rounded-2xl shadow-2xl animate-pop-in">
                    <div className="flex justify-center items-center gap-4">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.83 2.56a1 1 0 0 0-1.66 0l-9.09 15.15a1 1 0 0 0 .83 1.59h18.18a1 1 0 0 0 .83-1.59L12.83 2.56zM12 6.89l5.45 9.09H6.55L12 6.89zM5.3 20.3a1 1 0 0 0 1-1.73l-3.07-1.77a1 1 0 1 0-1 1.73l3.07 1.77zm13.4 0a1 1 0 0 0 1.07.03l3.07-1.8a1 1 0 1 0-1-1.73l-3.07 1.8a1 1 0 0 0-.07 1.7z"/>
                        </svg>
                        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            Prompt Generator Pro
                        </h1>
                    </div>
                     <p className="text-white/80 mt-4 text-base max-w-md mx-auto">
                        Aplikasi profesional untuk membuat prompt AI video & gambar yang detail.
                    </p>
                </div>
                <p className="text-white/70 mt-8 text-4xl font-bold tracking-wider animate-pop-in" style={{ animationDelay: '0.3s' }}>
                    {countdown}
                </p>
            </div>
        </div>
    );
};

export default WelcomeScreen;