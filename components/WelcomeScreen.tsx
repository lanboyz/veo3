import React from 'react';

interface WelcomeScreenProps {
    isExiting: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ isExiting }) => {
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
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        Prompt Generator Pro
                    </h1>
                     <p className="text-white/80 mt-4 text-base max-w-md mx-auto">
                        Aplikasi profesional untuk membuat prompt AI video & gambar yang detail.
                    </p>
                </div>
                
                {/* Heartbeat Loader */}
                <div className="mt-12 w-full flex justify-center items-center px-4">
                    <svg className="w-full max-w-md" height="60" viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg">
                        <path 
                            className="heartbeat-line"
                            d="M 0,30 L 150,30 L 160,10 L 180,50 L 200,20 L 210,30 L 400,30" 
                            stroke="rgba(255, 255, 255, 0.8)" 
                            strokeWidth="3" 
                            fill="none" 
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;