
import React from 'react';

interface InputCardProps {
    label: string;
    color: string;
    children: React.ReactNode;
}

const InputCard: React.FC<InputCardProps> = ({ label, color, children }) => {
    return (
        <div className={`p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${color}`}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
            {children}
        </div>
    );
};

export default InputCard;
