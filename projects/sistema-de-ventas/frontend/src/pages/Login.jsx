import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f7f9] relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.05) 0%, transparent 50%), linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)', backgroundSize: '100% 100%, 30px 30px, 30px 30px' }}>
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full opacity-5 blur-3xl"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 glass-card w-[400px] overflow-hidden">
                {/* Header gradient */}
                <div className="bg-white/50 p-8 text-center border-b border-slate-100">
                    <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 mx-auto mb-4">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Papelería</h1>
                    <p className="text-slate-500 text-sm mt-1 font-bold tracking-wide uppercase">Sistema POS</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 flex items-center gap-2 animate-shake">
                            <span className="text-xl">❌</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800 mb-4">
                        <p className="font-semibold mb-1">Credenciales de Demo:</p>
                        <p>Email: <b>admin@pos.com</b></p>
                        <p>Contraseña: <b>123456</b></p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="tech-input pl-12"
                                    placeholder="admin@pos.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Contraseña</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="tech-input pl-12"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full tech-button py-3.5 mt-2 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full spinner"></div>
                                    <span>Iniciando sesión...</span>
                                </>
                            ) : (
                                <>
                                    <span>Ingresar al Sistema</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <p className="text-center text-sm text-gray-500 font-medium mb-2">Datos de prueba:</p>
                        <div className="flex justify-center gap-4 text-sm">
                            <div className="bg-white px-3 py-1 rounded-lg border">
                                <span className="text-gray-400">User:</span>
                                <span className="font-mono text-purple-600 ml-1">admin@pos.com</span>
                            </div>
                            <div className="bg-white px-3 py-1 rounded-lg border">
                                <span className="text-gray-400">Pass:</span>
                                <span className="font-mono text-purple-600 ml-1">admin123</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}