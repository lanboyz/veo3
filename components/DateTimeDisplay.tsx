import React, { useState, useEffect } from 'react';

const DateTimeDisplay: React.FC = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        // Atur interval untuk memperbarui waktu setiap detik
        const timerId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // Bersihkan interval saat komponen tidak lagi digunakan untuk mencegah kebocoran memori
        return () => clearInterval(timerId);
    }, []); // Array dependensi kosong memastikan efek ini hanya berjalan sekali saat komponen dimuat

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short',
    };

    // Format tanggal dan waktu ke dalam Bahasa Indonesia
    // Ganti titik (.) yang sering digunakan sebagai pemisah waktu di locale id-ID dengan titik dua (:)
    const formattedDateTime = currentDateTime.toLocaleString('id-ID', options).replace(/\./g, ':');

    return (
        <div className="text-sm text-gray-500 font-medium tracking-wide">
            {formattedDateTime}
        </div>
    );
};

export default DateTimeDisplay;
