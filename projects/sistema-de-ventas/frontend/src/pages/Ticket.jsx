import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatPeso } from '../utils/format';
import { Printer, ShoppingCart, ListOrdered, User, CreditCard, Banknote, Smartphone, Users, Monitor, Ticket as TicketIcon, CheckCircle2, BookOpen } from 'lucide-react';

export default function Ticket() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [venta, setVenta] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.ventas.getById(id)
            .then(data => setVenta(data))
            .catch(err => {
                alert('Error al cargar venta');
                navigate('/ventas');
            })
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const imprimirTicket = () => {
        window.print();
    };

    const formatPeso = (valor) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(valor);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full spinner"></div>
        </div>
    );
    if (!venta) return null;

    return (
        <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-10">
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .ticket-impreso, .ticket-impreso * {
                        visibility: visible;
                    }
                    .ticket-impreso {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>

            <div className="p-6 print:shadow-none print:p-0 ticket-impreso bg-white mx-4 mt-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                {/* Decoración superior */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600"></div>
                
                <div className="text-center mb-6 pt-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-slate-900/20 mb-4 transform -rotate-6">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Papelería</h1>
                    <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Sistema POS</p>
                    <div className="mt-4 w-12 h-1 bg-slate-200 rounded-full mx-auto"></div>
                </div>

                <div className="border-y border-dashed border-slate-300 py-5 mb-5">
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                <TicketIcon className="w-3 h-3" /> Ticket
                            </p>
                            <p className="font-black text-xl text-slate-800">#{venta.id}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Fecha
                            </p>
                            <p className="font-bold text-slate-800">{new Date(venta.fecha).toLocaleDateString('es-CO')}</p>
                            <p className="text-xs font-bold text-slate-500">{new Date(venta.fecha).toLocaleTimeString('es-CO')}</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center bg-cyan-50 border border-cyan-100 p-4 rounded-2xl">
                        <div className="flex items-center gap-3 text-cyan-900">
                            <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-cyan-600" />
                            </div>
                            <span className="font-bold">{venta.usuario_nombre}</span>
                        </div>
                        <div className={`px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-sm ${
                            venta.metodo_pago === 'efectivo' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            venta.metodo_pago === 'tarjeta' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            'bg-purple-100 text-purple-700 border border-purple-200'
                        }`}>
                            {venta.metodo_pago === 'efectivo' ? <Banknote className="w-4 h-4" /> : 
                             venta.metodo_pago === 'tarjeta' ? <CreditCard className="w-4 h-4" /> : 
                             <Smartphone className="w-4 h-4" />}
                            <span className="capitalize">{venta.metodo_pago}</span>
                        </div>
                    </div>
                    
                    {venta.cliente_nombre && (
                        <div className="mt-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cliente</p>
                                <p className="font-bold text-slate-800">{venta.cliente_nombre}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2 px-2">
                        <ShoppingCart className="w-4 h-4 text-cyan-600" /> Productos
                    </h3>
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="bg-slate-100 text-slate-500 p-3 grid grid-cols-4 gap-2 text-xs font-black uppercase tracking-wider border-b border-slate-200">
                            <div className="col-span-2">Concepto</div>
                            <div className="text-center">Cant.</div>
                            <div className="text-right">Subtotal</div>
                        </div>
                        <div className="divide-y divide-slate-200 bg-white">
                            {venta.detalle?.map((item, i) => (
                                <div key={i} className="p-3 grid grid-cols-4 gap-2 text-sm items-center">
                                    <div className="col-span-2 font-bold text-slate-800">{item.producto_nombre}</div>
                                    <div className="text-center font-bold text-slate-500 bg-slate-100 rounded-lg py-1">{item.cantidad}</div>
                                    <div className="text-right font-black text-cyan-700">{formatPeso(parseFloat(item.subtotal))}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl mb-6 text-center shadow-lg shadow-slate-900/20 relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total a Pagar</p>
                        <p className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                            {formatPeso(parseFloat(venta.total))}
                        </p>
                    </div>
                </div>

                <div className="text-center p-5 bg-cyan-50 rounded-2xl border border-cyan-100">
                    <p className="font-black text-cyan-800 text-lg">¡Gracias por tu compra!</p>
                    <p className="text-sm font-bold text-cyan-600 mt-1">Vuelve pronto</p>
                </div>

                <div className="mt-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <p>Papelería © {new Date().getFullYear()}</p>
                </div>
            </div>

            <div className="p-4 mx-4 mt-4 print:hidden space-y-3 glass-panel rounded-3xl border border-slate-200/60 shadow-lg">
                <button
                    onClick={imprimirTicket}
                    className="w-full tech-button py-4 text-lg justify-center shadow-md shadow-cyan-500/20"
                >
                    <Printer className="w-6 h-6" />
                    <span>Imprimir Ticket</span>
                </button>
                <button
                    onClick={() => navigate('/pos')}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Nueva Venta</span>
                </button>
                <button
                    onClick={() => navigate('/ventas')}
                    className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    <ListOrdered className="w-5 h-5" />
                    <span>Volver al Historial</span>
                </button>
            </div>
        </div>
    );
}