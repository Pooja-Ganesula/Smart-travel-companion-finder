import { AlertTriangle } from 'lucide-react';

export default function SOSButton() {
    const handleClick = () => {
        alert("Emergency SOS Triggered! Local authorities and emergency contacts would be notified.");
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 z-50 flex items-center justify-center animate-pulse"
            title="Emergency SOS"
        >
            <AlertTriangle size={24} />
            <span className="ml-2 font-bold">SOS</span>
        </button>
    );
}
