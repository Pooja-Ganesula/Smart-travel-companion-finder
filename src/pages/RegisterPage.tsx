import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { RegisterData } from '../context/AuthContext';
import {
    Compass,
    ShieldCheck,
    Users,
    MessageCircle,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    MapPin,
    Calendar,
    Wallet,
    Sparkles,
    Plane,
} from 'lucide-react';

const INTEREST_OPTIONS = [
    'Adventure', 'Food', 'Culture', 'Nature', 'Photography',
    'History', 'Nightlife', 'Beaches', 'Hiking', 'Shopping',
    'Art', 'Music', 'Wellness', 'Wildlife', 'Sports',
];

const TRAVEL_STYLES = [
    { value: 'Backpacking', label: 'Backpacking', icon: '🎒', desc: 'Budget-friendly exploration' },
    { value: 'Standard', label: 'Standard', icon: '✈️', desc: 'Comfortable & balanced' },
    { value: 'Adventure', label: 'Adventure', icon: '🏔️', desc: 'Thrill-seeking journeys' },
    { value: 'Luxury', label: 'Luxury', icon: '🌟', desc: 'Premium experiences' },
];

const BUDGET_OPTIONS = [
    { value: 'Low', label: 'Budget', icon: '💰', desc: '< ₹15k / trip' },
    { value: 'Medium', label: 'Mid-range', icon: '💎', desc: '₹15k – ₹50k' },
    { value: 'High', label: 'Premium', icon: '👑', desc: '₹50k+' },
];

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Step 1 fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Step 2 fields
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budgetRange, setBudgetRange] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [travelStyle, setTravelStyle] = useState('');

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : prev.length < 5
                    ? [...prev, interest]
                    : prev
        );
    };

    const validateStep1 = (): boolean => {
        if (!name.trim()) {
            setError('Please enter your full name');
            return false;
        }
        if (!email.trim()) {
            setError('Please enter your email address');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        setError('');
        return true;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data: RegisterData = {
            name: name.trim(),
            email: email.trim(),
            password,
            destination: destination || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            budgetRange: budgetRange || undefined,
            interests: selectedInterests.length > 0 ? selectedInterests.join(', ') : undefined,
            travelStyle: travelStyle || undefined,
        };

        const success = register(data);

        if (!success) {
            setError('Registration failed. Please check your details and try again.');
            setIsSubmitting(false);
            return;
        }

        navigate('/find-companion');
    };

    const inputClass =
        'appearance-none block w-full px-3.5 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all duration-200';

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sky-50 flex items-center py-10 px-4">
            <div className="max-w-5xl w-full mx-auto grid md:grid-cols-2 gap-8 items-stretch">
                {/* ── Left branding panel ── */}
                <div className="hidden md:flex rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 p-8 text-white flex-col justify-between shadow-xl relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-600/20 rounded-full" />
                    <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-teal-500/15 rounded-full" />

                    <div className="relative z-10">
                        <div className="flex items-center mb-6">
                            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Compass className="h-8 w-8" />
                            </div>
                            <h1 className="ml-3 text-2xl font-bold">Smart Travel Companion Finder</h1>
                        </div>
                        <p className="text-teal-100 leading-relaxed text-lg">
                            Join thousands of travelers finding their perfect travel companions.
                        </p>
                    </div>

                    <ul className="space-y-5 mt-8 text-sm relative z-10">
                        <li className="flex items-start bg-white/5 rounded-xl p-3 backdrop-blur-sm">
                            <Users className="h-5 w-5 mr-3 mt-0.5 text-teal-300 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Smart Matching</p>
                                <p className="text-teal-200 text-xs mt-0.5">AI-powered companion recommendations</p>
                            </div>
                        </li>
                        <li className="flex items-start bg-white/5 rounded-xl p-3 backdrop-blur-sm">
                            <MessageCircle className="h-5 w-5 mr-3 mt-0.5 text-teal-300 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Secure Chat</p>
                                <p className="text-teal-200 text-xs mt-0.5">Chat unlocks only after confirmed match</p>
                            </div>
                        </li>
                        <li className="flex items-start bg-white/5 rounded-xl p-3 backdrop-blur-sm">
                            <ShieldCheck className="h-5 w-5 mr-3 mt-0.5 text-teal-300 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Verified & Safe</p>
                                <p className="text-teal-200 text-xs mt-0.5">Trusted connections with verified profiles</p>
                            </div>
                        </li>
                    </ul>

                    <div className="mt-8 pt-6 border-t border-teal-600/50 relative z-10">
                        <p className="text-teal-200 text-xs">Already have an account?</p>
                        <Link to="/login" className="text-white font-medium text-sm hover:underline mt-1 inline-block">
                            Sign in here →
                        </Link>
                    </div>
                </div>

                {/* ── Right form panel ── */}
                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
                    {/* Mobile logo */}
                    <div className="text-center mb-6">
                        <div className="flex justify-center md:hidden">
                            <div className="p-2 bg-teal-50 rounded-xl">
                                <Compass className="h-8 w-8 text-teal-600" />
                            </div>
                        </div>
                        <h2 className="mt-3 text-2xl font-bold text-gray-900">Create your account</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {step === 1 ? 'Start with your basic details' : 'Tell us about your travel preferences'}
                        </p>
                    </div>

                    {/* ── Step indicator ── */}
                    <div className="flex items-center mb-8">
                        <div className="flex items-center flex-1">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${step >= 1 ? 'bg-teal-600 text-white shadow-md shadow-teal-200' : 'bg-gray-200 text-gray-500'}`}>
                                {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : '1'}
                            </div>
                            <span className={`ml-2 text-xs font-medium hidden sm:inline ${step >= 1 ? 'text-teal-700' : 'text-gray-400'}`}>
                                Account
                            </span>
                        </div>
                        <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-teal-500' : 'bg-gray-200'}`} />
                        <div className="flex items-center flex-1 justify-end">
                            <span className={`mr-2 text-xs font-medium hidden sm:inline ${step >= 2 ? 'text-teal-700' : 'text-gray-400'}`}>
                                Preferences
                            </span>
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${step >= 2 ? 'bg-teal-600 text-white shadow-md shadow-teal-200' : 'bg-gray-200 text-gray-500'}`}>
                                2
                            </div>
                        </div>
                    </div>

                    <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                        {/* ════════════════════ STEP 1 ════════════════════ */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in">
                                <div>
                                    <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        id="reg-name"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        className={inputClass}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        id="reg-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        className={inputClass}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="reg-password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Min. 6 characters"
                                            required
                                            minLength={6}
                                            className={inputClass + ' pr-10'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="reg-confirm" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="reg-confirm"
                                            type={showConfirm ? 'text' : 'password'}
                                            placeholder="Re-enter password"
                                            required
                                            className={inputClass + ' pr-10'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                        >
                                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                                >
                                    Continue
                                    <ArrowRight className="h-4 w-4" />
                                </button>

                                <div className="text-center pt-2">
                                    <p className="text-sm text-gray-500">
                                        Already have an account?{' '}
                                        <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ════════════════════ STEP 2 ════════════════════ */}
                        {step === 2 && (
                            <div className="space-y-5 animate-in">
                                {/* Destination */}
                                <div>
                                    <label htmlFor="reg-dest" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-teal-500" />
                                        Destination
                                    </label>
                                    <input
                                        id="reg-dest"
                                        type="text"
                                        placeholder="Where do you want to go?"
                                        className={inputClass}
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                    />
                                </div>

                                {/* Travel dates */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="reg-start" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-teal-500" />
                                            Start Date
                                        </label>
                                        <input
                                            id="reg-start"
                                            type="date"
                                            className={inputClass}
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="reg-end" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-teal-500" />
                                            End Date
                                        </label>
                                        <input
                                            id="reg-end"
                                            type="date"
                                            className={inputClass}
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Budget */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Wallet className="h-3.5 w-3.5 mr-1.5 text-teal-500" />
                                        Budget Range
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {BUDGET_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setBudgetRange(opt.value)}
                                                className={`p-2.5 rounded-xl border-2 text-center transition-all duration-200 ${budgetRange === opt.value
                                                        ? 'border-teal-500 bg-teal-50 shadow-sm'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }`}
                                            >
                                                <span className="text-lg block">{opt.icon}</span>
                                                <span className="text-xs font-semibold block mt-1 text-gray-700">{opt.label}</span>
                                                <span className="text-[10px] text-gray-400 block">{opt.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Travel Style */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Plane className="h-3.5 w-3.5 mr-1.5 text-teal-500" />
                                        Travel Style
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {TRAVEL_STYLES.map((s) => (
                                            <button
                                                key={s.value}
                                                type="button"
                                                onClick={() => setTravelStyle(s.value)}
                                                className={`p-2.5 rounded-xl border-2 text-left transition-all duration-200 ${travelStyle === s.value
                                                        ? 'border-teal-500 bg-teal-50 shadow-sm'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }`}
                                            >
                                                <span className="text-base">{s.icon}</span>
                                                <span className="text-xs font-semibold block mt-0.5 text-gray-700">{s.label}</span>
                                                <span className="text-[10px] text-gray-400">{s.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Interests */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Sparkles className="h-3.5 w-3.5 mr-1.5 text-teal-500" />
                                        Interests
                                        <span className="text-[10px] text-gray-400 ml-1.5 font-normal">(pick up to 5)</span>
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {INTEREST_OPTIONS.map((interest) => (
                                            <button
                                                key={interest}
                                                type="button"
                                                onClick={() => toggleInterest(interest)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${selectedInterests.includes(interest)
                                                        ? 'bg-teal-600 text-white shadow-sm'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                        {error}
                                    </p>
                                )}

                                {/* Action buttons */}
                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => { setStep(1); setError(''); }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Creating...
                                            </span>
                                        ) : (
                                            <>
                                                Create Account
                                                <CheckCircle2 className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="text-xs text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        Skip for now — I'll set preferences later
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* CSS for step animation */}
            <style>{`
                .animate-in {
                    animation: slideIn 300ms ease-out;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(12px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
}
