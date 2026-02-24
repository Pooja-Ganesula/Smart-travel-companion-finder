import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, ShieldCheck, Users, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('alex@example.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(email, password);

        if (!success) {
            setError('Invalid credentials. Use alex@example.com / password123 for demo login.');
            return;
        }

        setError('');
        navigate('/find-companion');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sky-50 flex items-center py-10 px-4">
            <div className="max-w-5xl w-full mx-auto grid md:grid-cols-2 gap-8 items-stretch">
                <div className="hidden md:flex rounded-2xl bg-teal-700 p-8 text-white flex-col justify-between shadow-xl">
                    <div>
                        <div className="flex items-center mb-6">
                            <Compass className="h-10 w-10" />
                            <h1 className="ml-3 text-2xl font-bold">Smart Travel Companion Finder</h1>
                        </div>
                        <p className="text-teal-100 leading-relaxed">
                            Match with the right travel partner using destination, date overlap, interests, and budget compatibility.
                        </p>
                    </div>

                    <ul className="space-y-4 mt-8 text-sm">
                        <li className="flex items-start"><Users className="h-4 w-4 mr-2 mt-0.5" /> Intelligent companion matching workflow</li>
                        <li className="flex items-start"><MessageCircle className="h-4 w-4 mr-2 mt-0.5" /> Chat unlocks only after confirmed match</li>
                        <li className="flex items-start"><ShieldCheck className="h-4 w-4 mr-2 mt-0.5" /> Verified user trust and safer connections</li>
                    </ul>
                </div>

                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
                    <div className="text-center mb-6">
                        <div className="flex justify-center md:hidden">
                            <Compass className="h-10 w-10 text-teal-600" />
                        </div>
                        <h2 className="mt-2 text-2xl font-bold text-gray-900">Welcome back</h2>
                        <p className="mt-1 text-sm text-gray-500">Sign in to continue planning your next trip</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                                Sign in
                            </button>
                        </div>

                        <div className="text-center text-xs text-gray-400 bg-gray-50 rounded-md py-2">
                            Demo: alex@example.com / password123
                        </div>

                        <div className="text-center pt-2">
                            <p className="text-sm text-gray-500">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
