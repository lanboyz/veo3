import React, { useState, useEffect, useCallback } from 'react';
import VeoGenerator from './components/VeoGenerator';
import ImagenGenerator from './components/ImagenGenerator';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import TutorialPopup from './components/TutorialPopup';
import DateTimeDisplay from './components/DateTimeDisplay';
import { MUTIARA_KATA } from './constants';
import { Notification } from './types';

type GeneratorType = 'veo' | 'imagen';
type AppView = 'welcome' | 'login' | 'app';

const App: React.FC = () => {
    const [activeGenerator, setActiveGenerator] = useState<GeneratorType>('veo');
    const [view, setView] = useState<AppView>('welcome');
    const [userName, setUserName] = useState<string>('');
    const [isExiting, setIsExiting] = useState(false);
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [quote, setQuote] = useState(MUTIARA_KATA[Math.floor(Math.random() * MUTIARA_KATA.length)]);
    const [quoteFade, setQuoteFade] = useState(true);

    // Efek untuk mengganti kata mutiara setiap 10 detik dengan animasi fade
    useEffect(() => {
        const intervalId = setInterval(() => {
            setQuoteFade(false); // Mulai animasi fade-out
            
            setTimeout(() => {
                setQuote(prevQuote => {
                    let newQuote;
                    do {
                        newQuote = MUTIARA_KATA[Math.floor(Math.random() * MUTIARA_KATA.length)];
                    } while (newQuote === prevQuote); // Pastikan kutipan baru berbeda
                    return newQuote;
                });
                setQuoteFade(true); // Mulai animasi fade-in
            }, 500); // Durasi ini harus cocok dengan durasi transisi di Tailwind CSS (duration-500)
        }, 10000); // 10 detik

        return () => clearInterval(intervalId); // Membersihkan interval saat komponen unmount
    }, []);

    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const addNotification = useCallback((message: string) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message }]);
        const timer = setTimeout(() => {
            removeNotification(id);
        }, 4000); // Auto-dismiss after 4 seconds
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (view === 'welcome') {
            const timer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(() => {
                    setView('login');
                    setIsExiting(false);
                }, 800);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [view]);

    useEffect(() => {
        if (view === 'app') {
            const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
            if (!hasSeenTutorial) {
                setIsTutorialOpen(true);
                localStorage.setItem('hasSeenTutorial', 'true');
            }
        }
    }, [view]);

    // Efek untuk keamanan: menonaktifkan klik kanan dan developer tools
    useEffect(() => {
        // 1. Menonaktifkan klik kanan
        const disableContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            addNotification("Aksi tidak diizinkan: Klik kanan dinonaktifkan.");
        };
        document.addEventListener('contextmenu', disableContextMenu);

        // 2. Menonaktifkan tombol pintas developer tools
        const disableDevToolsKeys = (e: KeyboardEvent) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && e.code === 'KeyU')
            ) {
                e.preventDefault();
                addNotification("Aksi tidak diizinkan: Developer tools diblokir.");
            }
        };
        document.addEventListener('keydown', disableDevToolsKeys);

        // 3. Jebakan debugger untuk mempersulit penggunaan dev tools
        const devToolsTrap = () => {
            try {
                // eslint-disable-next-line no-debugger
                debugger;
            } catch (e) {
                //
            }
        };
        const intervalId = setInterval(devToolsTrap, 500);

        // Membersihkan listener dan interval saat komponen unmount
        return () => {
            document.removeEventListener('contextmenu', disableContextMenu);
            document.removeEventListener('keydown', disableDevToolsKeys);
            clearInterval(intervalId);
        };
    }, [addNotification]);

    const handleLogin = (name: string) => {
        setUserName(name);
        setIsExiting(true);
        setTimeout(() => {
            setView('app');
            setIsExiting(false);
        }, 800);
    };

    const handleOpenTutorial = () => setIsTutorialOpen(true);
    const handleCloseTutorial = () => setIsTutorialOpen(false);

    return (
        <div className="min-h-screen bg-violet-50 text-gray-800">
            {/* Notification Container */}
            <div className="fixed top-4 right-4 z-[9999] w-full max-w-sm space-y-3">
                {notifications.map(({ id, message }) => (
                    <div
                        key={id}
                        className="bg-red-500 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between animate-pop-in"
                        role="alert"
                    >
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="font-semibold text-sm">{message}</span>
                        </div>
                        <button 
                            onClick={() => removeNotification(id)} 
                            className="text-red-100 hover:text-white p-1 rounded-full transition-colors"
                            aria-label="Tutup notifikasi"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                           </svg>
                        </button>
                    </div>
                ))}
            </div>

            {view === 'welcome' && <WelcomeScreen isExiting={isExiting} />}
            
            {view === 'login' && <LoginScreen onLogin={handleLogin} isExiting={isExiting} />}

            {view === 'app' && (
                 <div className="p-4 animate-content-fade-in">
                    <TutorialPopup isOpen={isTutorialOpen} onClose={handleCloseTutorial} />
                    <div className="container mx-auto">
                        <header className="bg-white/70 backdrop-blur-lg shadow-md rounded-xl p-4 sticky top-4 z-10">
                            <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
                                {/* Sisi Kiri: Sapaan dan Waktu */}
                                <div className="flex flex-col lg:flex-row items-center text-center lg:text-left gap-y-2 lg:gap-x-4">
                                    {/* Wrapper for greeting and time to keep them together */}
                                    <div className="flex items-center flex-wrap justify-center lg:justify-start gap-x-4">
                                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 shrink-0">
                                            Halo, <span className="text-violet-600">{userName}!</span>
                                        </h1>
                                        <div className="hidden md:block w-px h-6 bg-violet-200" />
                                        <DateTimeDisplay />
                                    </div>
                                    {/* Separator for desktop */}
                                    <div className="hidden lg:block w-px h-6 bg-violet-200" />
                                    {/* Quote */}
                                    <p className={`text-sm text-violet-500 italic max-w-md transition-opacity duration-500 ${quoteFade ? 'opacity-100' : 'opacity-0'}`} title={quote}>"{quote}"</p>
                                </div>
                                
                                {/* Sisi Kanan: Navigasi */}
                                <div className="flex items-center space-x-2">
                                    <nav className="flex space-x-2 bg-violet-100 p-1.5 rounded-lg">
                                        <button
                                            onClick={() => setActiveGenerator('veo')}
                                            className={`px-6 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${activeGenerator === 'veo' ? 'bg-violet-500 text-white shadow-lg' : 'text-violet-600 hover:bg-violet-200'}`}
                                        >
                                            VEO-3 Generator
                                        </button>
                                        <button
                                            onClick={() => setActiveGenerator('imagen')}
                                            className={`px-6 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${activeGenerator === 'imagen' ? 'bg-violet-500 text-white shadow-lg' : 'text-violet-600 hover:bg-violet-200'}`}
                                        >
                                            Imagen Generator
                                        </button>
                                    </nav>
                                    <button 
                                        onClick={handleOpenTutorial} 
                                        className="p-3 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-200 transition-colors"
                                        title="Buka Tutorial"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </header>
                        <main className="mt-6">
                            {activeGenerator === 'veo' ? <VeoGenerator /> : <ImagenGenerator />}
                        </main>
                        <footer className="text-center py-6 mt-8 text-sm text-violet-400 space-y-2">
                            <p>Dibuat dengan ❤️ oleh AI Engineer kelas dunia.</p>
                            <p className="font-bold tracking-wider text-violet-500">LANBOY STUDIO</p>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;