import React from 'react';

interface TutorialPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const TutorialStep: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-gray-800">{title}</h4>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    </div>
);

const TutorialPopup: React.FC<TutorialPopupProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-content-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto animate-pop-in relative"
                onClick={(e) => e.stopPropagation()} // Mencegah penutupan saat mengklik di dalam modal
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                    title="Tutup"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-violet-700">Panduan Cepat</h2>
                    <p className="text-gray-600 mt-1">Pelajari cara menggunakan Prompt Generator Pro dalam 5 langkah mudah!</p>
                </div>

                <div className="space-y-6">
                    <TutorialStep
                        icon={<span className="text-2xl font-bold text-violet-600">1</span>}
                        title="Pilih Generator"
                        description="Pilih antara 'VEO-3' untuk membuat prompt video sinematik atau 'Imagen' untuk prompt gambar artistik."
                    />
                    <TutorialStep
                        icon={
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.836 17.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V19.5a.75.75 0 01.75-.75zM5.106 17.894a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.06-1.061l-1.591 1.59zM3 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3.75A.75.75 0 013 12zM6.164 6.106a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 101.061-1.06l-1.59-1.591z" /></svg>
                        }
                        title="Isi Ide Utama Anda"
                        description="Tulis ide dasar Anda di kolom utama. Gunakan ikon 'bola lampu' untuk mengembangkan ide dari teks, atau ikon 'unggah' untuk menganalisis gambar."
                    />
                    <TutorialStep
                        icon={
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        }
                        title="Sempurnakan Detail"
                        description="Periksa dan sesuaikan detail yang telah diisi otomatis oleh AI di setiap kategori untuk memastikan hasilnya sesuai keinginan Anda."
                    />
                    <TutorialStep
                        icon={
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        }
                        title="Buat Prompt Ajaib"
                        description="Klik tombol 'Buat Prompt Ajaib ✨'. AI akan menggabungkan semua informasi menjadi prompt yang kaya dan deskriptif."
                    />
                     <TutorialStep
                        icon={
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        }
                        title="Salin dan Gunakan"
                        description="Hasil akan muncul dalam dua versi. Anda bisa mengedit versi Bahasa Indonesia dan menyalin hasil akhir dalam Bahasa Inggris untuk digunakan."
                    />
                </div>

                <div className="text-center mt-8">
                    <button 
                        onClick={onClose} 
                        className="bg-violet-600 text-white font-bold py-2 px-8 rounded-lg shadow-lg hover:bg-violet-700 transform hover:scale-105 transition-all duration-300"
                    >
                        Mengerti!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorialPopup;