import { GeneratorConfig } from './types';

export const VEO_CONFIG: GeneratorConfig = {
    idePromptField: { name: 'idePrompt', label: 'Ide Prompt Utama', placeholder: 'Jelaskan ide utama untuk video Anda di sini... AI akan mengembangkannya.', color: 'bg-sky-100' },
    categories: [
        {
            title: "Karakter & Penampilan",
            fields: [
                { name: 'subjek', label: 'Subjek', placeholder: 'cth: Seorang astronot, seekor naga api', color: 'bg-red-100' },
                { name: 'usia', label: 'Usia', placeholder: 'cth: 25 tahun, anak-anak, tua', color: 'bg-orange-100' },
                { name: 'warnaKulit', label: 'Warna Kulit', placeholder: 'cth: Sawo matang, pucat, zaitun', color: 'bg-amber-100' },
                { name: 'wajah', label: 'Wajah', placeholder: 'cth: Wajah tirus, pipi tembem', color: 'bg-yellow-100' },
                { name: 'rambut', label: 'Rambut', placeholder: 'cth: Rambut pirang panjang, kribo', color: 'bg-lime-100' },
                { name: 'pakaian', label: 'Pakaian', placeholder: 'cth: Mengenakan baju zirah, gaun malam', color: 'bg-green-100' },
                { name: 'asal', label: 'Asal (Negara)', placeholder: 'cth: Jepang, Mesir kuno', color: 'bg-emerald-100' },
                { name: 'asesoris', label: 'Asesoris', placeholder: 'cth: Kacamata hitam, pedang di punggung', color: 'bg-teal-100' },
            ]
        },
        {
            title: "Aksi & Konteks",
            fields: [
                { name: 'aksi', label: 'Aksi', placeholder: 'cth: Membaca buku, berlari cepat', color: 'bg-cyan-100' },
                { name: 'ekspresi', label: 'Ekspresi', placeholder: 'cth: Tersenyum bahagia, terlihat bingung', color: 'bg-sky-100' },
                { name: 'kalimatDiucapkan', label: 'Kalimat yang Diucapkan', placeholder: 'cth: "Kita harus pergi dari sini!"', color: 'bg-orange-100' },
            ]
        },
        {
            title: "Setting & Atmosfer",
            fields: [
                { name: 'tempat', label: 'Tempat', placeholder: 'cth: Di perpustakaan futuristik, di puncak gunung', color: 'bg-blue-100' },
                { name: 'waktu', label: 'Waktu', placeholder: 'cth: Saat matahari terbenam, tengah malam', color: 'bg-indigo-100' },
                { name: 'suasanaVideo', label: 'Suasana Video', placeholder: 'cth: Misterius, ceria, menegangkan', color: 'bg-rose-100' },
                { name: 'suaraMusik', label: 'Suara atau Musik', placeholder: 'cth: Suara ombak, musik orkestra epik', color: 'bg-red-100' },
            ]
        },
        {
            title: "Sinematografi & Kualitas",
            fields: [
                { name: 'gerakanKamera', label: 'Gerakan Kamera', placeholder: 'cth: Dolly zoom, panning shot, drone view', color: 'bg-violet-100' },
                { name: 'pencahayaan', label: 'Pencahayaan', placeholder: 'cth: Pencahayaan sinematik, rembrandt lighting', color: 'bg-purple-100' },
                { name: 'gayaVideo', label: 'Gaya Video', placeholder: 'cth: Gaya Wes Anderson, film noir, anime', color: 'bg-fuchsia-100' },
                { name: 'kualitasVideo', label: 'Kualitas Video', placeholder: 'cth: 8K, sangat detail, hyperrealistic', color: 'bg-pink-100' },
            ]
        },
        {
            title: "Lainnya",
            fields: [
                { name: 'detailTambahan', label: 'Detail Tambahan', placeholder: 'cth: Ada burung beterbangan, lantai basah', color: 'bg-amber-100' },
            ]
        }
    ]
};

export const IMAGEN_CONFIG: GeneratorConfig = {
    idePromptField: { name: 'idePrompt', label: 'Ide Prompt Utama', placeholder: 'Jelaskan ide utama untuk gambar Anda di sini... AI akan mengembangkannya.', color: 'bg-sky-100' },
    categories: [
        {
            title: "Subjek & Penampilan",
            fields: [
                { name: 'subjek', label: 'Subjek', placeholder: 'cth: Seorang penyihir, sebuah mobil terbang', color: 'bg-red-100' },
                { name: 'usia', label: 'Usia', placeholder: 'cth: Muda, paruh baya', color: 'bg-orange-100' },
                { name: 'warnaKulit', label: 'Warna Kulit', placeholder: 'cth: Gelap, terang', color: 'bg-amber-100' },
                { name: 'wajah', label: 'Wajah', placeholder: 'cth: Ekspresi serius, mata berbinar', color: 'bg-yellow-100' },
                { name: 'rambut', label: 'Rambut', placeholder: 'cth: Ikal berwarna merah, botak', color: 'bg-lime-100' },
                { name: 'pakaian', label: 'Pakaian', placeholder: 'cth: Jubah penyihir, jaket kulit', color: 'bg-green-100' },
                { name: 'asal', label: 'Asal (Negara)', placeholder: 'cth: Skandinavia, Thailand', color: 'bg-emerald-100' },
                { name: 'asesoris', label: 'Asesoris', placeholder: 'cth: Tongkat sihir, headphone neon', color: 'bg-teal-100' },
            ]
        },
        {
            title: "Aksi & Ekspresi",
            fields: [
                { name: 'aksi', label: 'Aksi', placeholder: 'cth: Merapal mantra, menari di bawah hujan', color: 'bg-cyan-100' },
                { name: 'ekspresi', label: 'Ekspresi', placeholder: 'cth: Tertawa terbahak-bahak, menatap tajam', color: 'bg-sky-100' },
            ]
        },
        {
            title: "Setting & Atmosfer",
            fields: [
                { name: 'tempat', label: 'Tempat', placeholder: 'cth: Di dalam hutan ajaib, di kota cyberpunk', color: 'bg-blue-100' },
                { name: 'waktu', label: 'Waktu', placeholder: 'cth: Pagi hari berkabut, malam berbintang', color: 'bg-indigo-100' },
                { name: 'suasanaGambar', label: 'Suasana Gambar', placeholder: 'cth: Ajaib, nostalgia, suram', color: 'bg-rose-100' },
            ]
        },
        {
            title: "Fotografi & Gaya",
            fields: [
                { name: 'kamera', label: 'Kamera', placeholder: 'cth: Lensa wide-angle, foto makro', color: 'bg-violet-100' },
                { name: 'pencahayaan', label: 'Pencahayaan', placeholder: 'cth: Golden hour, cahaya neon', color: 'bg-purple-100' },
                { name: 'gaya', label: 'Gaya', placeholder: 'cth: Lukisan cat minyak, seni digital, vaporwave', color: 'bg-fuchsia-100' },
                { name: 'kualitasGambar', label: 'Kualitas Gambar', placeholder: 'cth: Fotorealistis, 4K, tajam', color: 'bg-pink-100' },
                { name: 'aspekRasio', label: 'Aspek Rasio', placeholder: 'cth: 16:9, 1:1, 9:16', color: 'bg-red-100' },
            ]
        },
         {
            title: "Lainnya",
            fields: [
                { name: 'detailTambahan', label: 'Detail Tambahan', placeholder: 'cth: Partikel debu beterbangan, ada kucing oranye', color: 'bg-orange-100' },
            ]
        }
    ]
};

export const MUTIARA_KATA: string[] = [
    "Cara terbaik untuk memprediksi masa depan adalah dengan menciptakannya sendiri, bata demi bata, dengan setiap keputusan bijak yang kita ambil hari ini.",
    "Tantangan dalam hidup tidak dimaksudkan untuk melumpuhkanmu, mereka seharusnya membantumu menemukan seberapa kuat dirimu sebenarnya.",
    "Keberanian bukanlah ketiadaan rasa takut, melainkan kemampuan untuk terus maju meskipun rasa takut itu ada. Itulah yang membedakan seorang pemenang.",
    "Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia, bukan hanya untuk dirimu, tetapi untuk generasi yang akan datang.",
    "Jangan hanya menghitung hari-harimu, tetapi buatlah setiap harimu berarti. Waktu yang hilang tak akan kembali, namun waktu yang dimanfaatkan dengan baik akan menjadi kenangan abadi.",
    "Kebahagiaan sejati bukanlah tentang memiliki semua yang kamu inginkan, tetapi tentang menghargai semua yang telah kamu miliki.",
    "Kesuksesan sejati adalah saat kita bisa menaklukkan ego pribadi dan menemukan kebahagiaan dalam membantu orang lain mencapai impian mereka.",
    "Hidup itu seperti mengendarai sepeda. Untuk menjaga keseimbangan, kamu harus terus bergerak maju, melewati tanjakan dan turunan dengan semangat yang sama.",
    "Kegagalan adalah guru terbaik. Ia mengajarkan kita kerendahan hati, ketahanan, dan pelajaran berharga yang tidak akan pernah kita dapatkan dari kesuksesan semata.",
    "Jadilah seperti pohon yang lebat buahnya; ia tumbuh di tepi jalan dan dilempari batu, tetapi tetap membalas dengan memberikan buah-buah terbaiknya."
];