import React, { useState } from 'react';
import { Store, Printer, CreditCard, Bell, Shield, Smartphone, ImagePlus, Save, X, Building2, Globe, ReceiptText, Laptop, Check, AlertCircle, Power, Speaker, Loader2, Search, Usb, Wifi, MonitorSmartphone, QrCode, Database, Download, Upload, Trash2, AlertTriangle, Banknote } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Reusable Toggle Component
const Toggle = ({ enabled, onChange }) => (
  <button 
    type="button"
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-accent-primary' : 'bg-white/10'}`}
  >
    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

// Reusable Setting Card Component
const SettingCard = ({ title, description, children }) => (
  <section className="flex flex-col md:flex-row gap-8 lg:gap-16">
    <div className="w-full md:w-1/3 flex-shrink-0">
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-text-tertiary leading-relaxed">{description}</p>
    </div>
    <div className="flex-1 enterprise-card p-6 flex flex-col gap-6">
      {children}
    </div>
  </section>
);

// Web Audio API Sound Generator
const playSound = (type) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  
  if (type === 'newOrder') {
    // Sharp double beep (Kitchen Printer style)
    const playBeep = (time) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, time); // A5
      gain.gain.setValueAtTime(0.05, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.1);
    };
    playBeep(ctx.currentTime);
    playBeep(ctx.currentTime + 0.15);
  } else if (type === 'ready') {
    // Pleasant service bell chime
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.50, ctx.currentTime); // C6
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  } else if (type === 'error') {
    // Low error buzz
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }
};

const STORAGE_KEY = 'fastpos_settings';

const SettingsModule = ({ settings: globalSettings, onSettingsSaved }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings]   = useState(() => ({ ...globalSettings }));
  const [savedAt,  setSavedAt]    = useState(null);
  const [toast,    setToast]      = useState(null);

  React.useEffect(() => {
    setSettings({ ...globalSettings });
  }, [globalSettings]);

  const [mainPrinter,      setMainPrinter]      = useState(null);
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [scanStep,         setScanStep]         = useState('idle');
  const [connectionType,   setConnectionType]   = useState('network');
  const [isPrintingTest,  setIsPrintingTest]  = useState(false);
  const [showTestReceipt, setShowTestReceipt] = useState(false);

  const [devices,       setDevices]       = useState([
    { id: '1', name: 'Caja Principal',           os: 'Windows 11', type: 'laptop',  ip: '192.168.1.10', current: true },
    { id: '2', name: 'Tablet Mesero - Zona Patio', os: 'iPadOS 16',  type: 'tablet',  lastActive: 'hace 5 min' },
    { id: '3', name: 'Pantalla de Cocina (KDS)', os: 'ChromeOS',   type: 'monitor', lastActive: 'ahora' },
  ]);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [pairingStep,     setPairingStep]     = useState('waiting');
  const [pairingCode,     setPairingCode]     = useState('000 - 000');

  const set = (key, val) => setSettings(p => ({ ...p, [key]: val }));
  const handleToggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }));
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      if (onSettingsSaved) onSettingsSaved({ ...settings });
      setSavedAt(new Date());
      showToast('Ajustes guardados correctamente');
    } catch {
      showToast('Error al guardar', 'error');
    }
  };

  const handleRevert = () => {
    setSettings({ ...globalSettings });
    showToast('Cambios revertidos', 'info');
  };

  const handleStartScan = () => {
    setScanStep('scanning');
    setTimeout(() => setScanStep('found'), 2500);
  };

  const handleConnectPrinter = () => {
    setMainPrinter({
      name: connectionType === 'network' ? 'Epson TM-T20III (LAN)' : 'Zebra ZD410 (USB)',
      type: connectionType,
      ip: connectionType === 'network' ? '192.168.1.205' : 'COM3'
    });
    setShowPrinterModal(false);
    setScanStep('idle');
  };

  const handleDisconnectDevice = (id) => setDevices(prev => prev.filter(d => d.id !== id));

  const handleStartPairing = () => {
    const codePart1 = Math.floor(Math.random() * 900) + 100;
    const codePart2 = Math.floor(Math.random() * 900) + 100;
    const code = `${codePart1} - ${codePart2}`;
    setPairingCode(code);
    setPairingStep('waiting');
    setShowDeviceModal(true);
  };

  const handleTestPrint = () => {
    setIsPrintingTest(true);
    setTimeout(() => {
      setIsPrintingTest(false);
      setShowTestReceipt(true);
      setTimeout(() => window.print(), 300);
      setTimeout(() => setShowTestReceipt(false), 5000);
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pt-6 h-full relative">
      {/* Sidebar */}
      <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-3 flex-shrink-0 mt-4 overflow-x-auto scroll-hide pb-2 lg:pb-0">
        {[
          { id: 'general', label: 'General', icon: <Store size={20} /> },
          { id: 'hardware', label: 'Hardware', icon: <Printer size={20} /> },
          { id: 'receipt', label: 'Ticket de Venta', icon: <ReceiptText size={20} /> },
          { id: 'payments', label: 'Pagos', icon: <CreditCard size={20} /> },
          { id: 'notifications', label: 'Alertas', icon: <Bell size={20} /> },
          { id: 'security', label: 'Seguridad', icon: <Shield size={20} /> },
          { id: 'devices', label: 'Equipos', icon: <Smartphone size={20} /> },
          { id: 'maintenance', label: 'Base de Datos', icon: <Database size={20} /> },
        ].map(item => {
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-[15px] font-bold transition-all whitespace-nowrap ${
                isActive ? 'bg-[#1e110a] text-accent-primary border border-[#3d1f0f]' : 'text-text-secondary border border-transparent hover:bg-white/5'
              }`}
            >
              <span className={isActive ? 'text-accent-primary' : 'text-text-secondary opacity-80'}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-y-auto scroll-hide pb-28 pr-4">
        {activeTab === 'general' && (
          <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4">
            <SettingCard title="Identidad" description="Nombre y Logo del restaurante.">
              <div className="flex items-start gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Logo</label>
                  {settings.logoUrl ? (
                    <div className="relative w-24 h-24 group">
                      <img src={settings.logoUrl} alt="Logo" className="w-24 h-24 rounded-2xl object-cover border-2 border-accent-primary/30" />
                      <button onClick={() => set('logoUrl', '')} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-danger text-white flex-center text-xs opacity-0 group-hover:opacity-100 shadow-lg">✕</button>
                    </div>
                  ) : (
                    <label className="w-24 h-24 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex-center flex-col gap-2 text-text-tertiary cursor-pointer hover:border-accent-primary">
                      <ImagePlus size={24} />
                      <span className="text-[10px] font-semibold">Subir</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => set('logoUrl', ev.target.result);
                        reader.readAsDataURL(file);
                      }} />
                    </label>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">Establecimiento</label>
                    <input type="text" value={settings.restaurantName} onChange={e => set('restaurantName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">NIT</label>
                    <input type="text" value={settings.nit} onChange={e => set('nit', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white mono-font" />
                  </div>
                </div>
              </div>
            </SettingCard>
            
            <SettingCard title="Regionales" description="Impuestos y Moneda.">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Impuesto (%)</label>
                  <input type="number" value={settings.taxRate} onChange={e => set('taxRate', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white mono-font" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Moneda</label>
                  <select value={settings.currency} onChange={e => set('currency', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none">
                    <option>COP - Peso Colombiano ($)</option>
                    <option>USD - Dólar ($)</option>
                  </select>
                </div>
              </div>
            </SettingCard>
          </div>
        )}

        {activeTab === 'receipt' && (
          <div className="max-w-5xl flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
            <div className="flex-1 space-y-10">
              <SettingCard title="Encabezado y Pie" description="Personaliza la información legal y de contacto que aparece en tus recibos.">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex-center text-accent-primary">
                        <ImagePlus size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold">Mostrar Logo</p>
                        <p className="text-[10px] text-text-tertiary">Incluir logo en el ticket impreso</p>
                      </div>
                    </div>
                    <Toggle enabled={settings.showLogoOnReceipt} onChange={v => set('showLogoOnReceipt', v)} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">Dirección</label>
                    <input type="text" value={settings.receiptAddress || ''} onChange={e => set('receiptAddress', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">Teléfono / WhatsApp</label>
                    <input type="text" value={settings.receiptPhone || ''} onChange={e => set('receiptPhone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">Mensaje de Agradecimiento</label>
                    <textarea 
                      rows={3} 
                      value={settings.receiptMessage || ''} 
                      onChange={e => set('receiptMessage', e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none"
                      placeholder="Ej: ¡Gracias por su visita! Vuelva pronto."
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard title="Opciones de Impresión" description="Ajustes técnicos para la salida de papel.">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl opacity-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex-center text-success">
                        <Printer size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold">Corte Automático (BETA)</p>
                        <p className="text-[10px] text-text-tertiary">Enviar comando de corte al finalizar</p>
                      </div>
                    </div>
                    <Toggle enabled={settings.autoCut} onChange={v => set('autoCut', v)} />
                  </div>
                </div>
              </SettingCard>
            </div>

            {/* Receipt Preview */}
            <div className="w-full lg:w-[320px] flex-shrink-0">
              <div className="sticky top-6">
                <h3 className="text-xs font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <MonitorSmartphone size={14} /> Vista Previa Real
                </h3>
                
                <div className="bg-[#f8f8f8] text-black p-6 rounded-sm shadow-2xl overflow-hidden relative min-h-[420px] flex flex-col items-center text-center font-mono text-[10px] border border-black/5">
                  {/* Jagged top edge effect */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-white" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }}></div>
                  
                  <div className="mt-4 w-full">
                    {settings.showLogoOnReceipt && settings.logoUrl && (
                      <img src={settings.logoUrl} alt="Preview Logo" className="w-12 h-12 rounded-lg object-cover mx-auto mb-4 border border-black/10 grayscale" />
                    )}
                    
                    <h2 className="text-sm font-black uppercase mb-1 leading-tight">{settings.restaurantName || 'RESTAURANTE'}</h2>
                    <p className="mb-0.5">NIT: {settings.nit || '000.000.000-0'}</p>
                    {settings.receiptAddress && <p className="mb-0.5">{settings.receiptAddress}</p>}
                    {settings.receiptPhone && <p className="mb-4">TEL: {settings.receiptPhone}</p>}
                    
                    <div className="border-t border-b border-black border-dashed py-2 my-2 w-full text-left">
                      <div className="flex justify-between font-bold">
                        <span>ORDEN: #F-982</span>
                        <span>MESA: 04</span>
                      </div>
                      <p className="text-[8px] mt-1 opacity-60">16/05/2026 13:45</p>
                    </div>

                    <div className="w-full text-left space-y-1 my-4">
                      <div className="flex justify-between">
                        <span>2x HAMBURGUESA ESPECIAL</span>
                        <span>$56.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1x PAPAS FRITAS XL</span>
                        <span>$12.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2x COCA-COLA 350ML</span>
                        <span>$9.000</span>
                      </div>
                    </div>

                    <div className="border-t border-black border-dashed pt-2 w-full text-left space-y-1">
                      <div className="flex justify-between">
                        <span>SUBTOTAL:</span>
                        <span>$69.444</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA (8%):</span>
                        <span>$7.556</span>
                      </div>
                      <div className="flex justify-between text-xs font-black mt-2 pt-2 border-t border-black">
                        <span>TOTAL:</span>
                        <span>$77.000</span>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-black border-dashed opacity-80 italic leading-relaxed">
                      <p className="whitespace-pre-line">{settings.receiptMessage || '¡Gracias por su compra! Vuelva pronto.'}</p>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-1.5 opacity-40">
                      <div className="w-24 h-1.5 bg-black/20 rounded-full"></div>
                      <div className="w-16 h-1.5 bg-black/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <button onClick={handleTestPrint} className="w-full btn btn-secondary mt-4 gap-2 border-white/5 bg-white/5 hover:bg-white/10 py-4">
                  <Printer size={16} /> Imprimir Prueba Real
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 pb-20">
            <SettingCard title="Métodos de Pago" description="Configura los métodos de pago disponibles en la caja.">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex-center text-accent-primary"><CreditCard size={16} /></div>
                    <div>
                      <p className="text-xs font-bold">Tarjeta (Datáfono)</p>
                      <p className="text-[10px] text-text-tertiary">Permitir pagos con tarjeta de crédito/débito</p>
                    </div>
                  </div>
                  <Toggle enabled={settings.cardPayment !== false} onChange={v => set('cardPayment', v)} />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex-center text-success"><Banknote size={16} /></div>
                    <div>
                      <p className="text-xs font-bold">Efectivo</p>
                      <p className="text-[10px] text-text-tertiary">Permitir pagos en efectivo y calcular cambio</p>
                    </div>
                  </div>
                  <Toggle enabled={settings.cashPayment !== false} onChange={v => set('cashPayment', v)} />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-info/10 flex-center text-info"><Smartphone size={16} /></div>
                    <div>
                      <p className="text-xs font-bold">Transferencia Digital</p>
                      <p className="text-[10px] text-text-tertiary">Nequi, Daviplata, Bancolombia a la Mano</p>
                    </div>
                  </div>
                  <Toggle enabled={settings.transferPayment === true} onChange={v => set('transferPayment', v)} />
                </div>
              </div>
            </SettingCard>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 pb-20">
            <SettingCard title="Alertas de Sonido" description="Configura los sonidos del sistema para notificar eventos importantes.">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex-center text-warning"><Bell size={16} /></div>
                    <div>
                      <p className="text-xs font-bold">Nueva Orden</p>
                      <p className="text-[10px] text-text-tertiary">Sonido al recibir o enviar una orden a cocina</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => playSound('newOrder')} className="btn btn-secondary btn-sm"><Speaker size={14} /></button>
                    <Toggle enabled={settings.soundNewOrder !== false} onChange={v => set('soundNewOrder', v)} />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex-center text-success"><Check size={16} /></div>
                    <div>
                      <p className="text-xs font-bold">Orden Lista</p>
                      <p className="text-[10px] text-text-tertiary">Sonido cuando la cocina marca un pedido como listo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => playSound('ready')} className="btn btn-secondary btn-sm"><Speaker size={14} /></button>
                    <Toggle enabled={settings.soundOrderReady !== false} onChange={v => set('soundOrderReady', v)} />
                  </div>
                </div>
              </div>
            </SettingCard>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 pb-20">
            <SettingCard title="Control de Acceso" description="Ajustes de seguridad para operaciones sensibles.">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-danger/10 flex-center text-danger"><Shield size={16} /></div>
                    <div>
                      <p className="text-xs font-bold">PIN para Cancelaciones</p>
                      <p className="text-[10px] text-text-tertiary">Solicitar código al cancelar órdenes o productos</p>
                    </div>
                  </div>
                  <Toggle enabled={settings.requirePinCancel === true} onChange={v => set('requirePinCancel', v)} />
                </div>

                {settings.requirePinCancel && (
                  <div className="p-4 bg-bg-base border border-white/10 rounded-xl space-y-2 animate-in fade-in">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">PIN Maestro</label>
                    <input 
                      type="password" 
                      value={settings.masterPin || ''} 
                      onChange={e => set('masterPin', e.target.value)} 
                      placeholder="Ej: 1234"
                      className="w-full max-w-[200px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white mono-font tracking-widest" 
                      maxLength={6}
                    />
                    <p className="text-[10px] text-text-tertiary mt-1">Este PIN será requerido por los cajeros.</p>
                  </div>
                )}
              </div>
            </SettingCard>

            <SettingCard title="Auditoría de Caja" description="Opciones avanzadas para el cuadre de caja.">
               <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl opacity-70">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-info/10 flex-center text-info"><AlertTriangle size={16} /></div>
                    <div>
                      <p className="text-xs font-bold">Cierre Ciego</p>
                      <p className="text-[10px] text-text-tertiary">Ocultar el total teórico al cajero al hacer el cierre</p>
                    </div>
                  </div>
                  <Toggle enabled={settings.blindClose === true} onChange={v => set('blindClose', v)} />
                </div>
            </SettingCard>
          </div>
        )}

        {activeTab === 'hardware' && (
          <div className="max-w-4xl space-y-10 animate-in fade-in">
            <SettingCard title="Impresora Principal" description="Impresión de recibos térmicos.">
              {mainPrinter ? (
                <div className="flex-between bg-accent-primary/5 border border-accent-primary/20 p-4 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Printer size={24} className="text-accent-primary" />
                    <div>
                      <h4 className="font-bold">{mainPrinter.name}</h4>
                      <p className="text-xs text-success">Conectada en {mainPrinter.ip}</p>
                    </div>
                  </div>
                  <button onClick={() => setMainPrinter(null)} className="btn btn-secondary btn-sm text-danger">Desconectar</button>
                </div>
              ) : (
                <button onClick={() => setShowPrinterModal(true)} className="w-full p-8 border-2 border-dashed border-white/10 rounded-xl flex-center flex-col gap-2 hover:border-accent-primary">
                  <Printer size={32} className="text-text-tertiary" />
                  <span className="font-bold">Conectar Impresora</span>
                </button>
              )}
            </SettingCard>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="max-w-4xl space-y-10 animate-in fade-in">
            <SettingCard title="Respaldo de Datos" description="Exporta e importa la información del sistema.">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    const backup = {};
                    Object.keys(localStorage).forEach(key => {
                      if (key.startsWith('fastpos_')) backup[key] = localStorage.getItem(key);
                    });
                    const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `fastpos_backup_${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }}
                  className="p-6 bg-white/5 border border-white/5 rounded-2xl flex-center flex-col gap-3 hover:bg-white/10 transition-all"
                >
                  <Download size={32} className="text-accent-primary" />
                  <span className="font-bold">Exportar JSON</span>
                  <p className="text-[10px] text-text-tertiary">Descarga todos los datos</p>
                </button>

                <label className="p-6 bg-white/5 border border-white/5 rounded-2xl flex-center flex-col gap-3 hover:bg-white/10 transition-all cursor-pointer">
                  <Upload size={32} className="text-accent-secondary" />
                  <span className="font-bold">Importar JSON</span>
                  <p className="text-[10px] text-text-tertiary">Restaura un respaldo previo</p>
                  <input type="file" accept=".json" className="hidden" onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const data = JSON.parse(event.target.result);
                      Object.keys(data).forEach(key => {
                        if (key.startsWith('fastpos_')) localStorage.setItem(key, data[key]);
                      });
                      alert('Restaura completada. Recargando...');
                      window.location.reload();
                    };
                    reader.readAsText(file);
                  }} />
                </label>
              </div>
              <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3">
                <AlertTriangle size={16} className="text-danger flex-shrink-0" />
                <p className="text-[10px] text-text-tertiary">
                  <strong className="text-danger">Zona Crítica:</strong> Al importar un archivo, se borrará toda la información actual y se reemplazará por la del respaldo.
                </p>
              </div>
            </SettingCard>

            <SettingCard title="Limpieza Profunda" description="Acciones irreversibles sobre la base de datos.">
              <button 
                onClick={() => {
                  if (window.confirm('¿ELIMINAR TODO? Esta acción no se puede deshacer.')) {
                    Object.keys(localStorage).forEach(key => {
                      if (key.startsWith('fastpos_')) localStorage.removeItem(key);
                    });
                    window.location.reload();
                  }
                }}
                className="btn btn-danger w-full gap-2 py-4"
              >
                <Trash2 size={18} /> Borrar Todos los Datos del LocalStorage
              </button>
            </SettingCard>
          </div>
        )}
      </div>

      {/* Floating Save Bar */}
      <div className="absolute bottom-6 right-8 left-[280px]">
        <div className="max-w-4xl enterprise-card p-4 flex items-center justify-between gap-3 bg-bg-surface/90 backdrop-blur-xl border-t border-white/10 shadow-2xl">
          <span className="text-xs text-text-tertiary">{savedAt ? `Guardado a las ${savedAt.toLocaleTimeString()}` : 'Sin guardar'}</span>
          <div className="flex gap-3">
            <button onClick={handleRevert} className="btn btn-secondary px-6 flex items-center gap-2"><X size={16} /> Revertir</button>
            <button onClick={handleSave} className="btn btn-accent px-6 flex items-center gap-2 shadow-glow"><Save size={16} /> Guardar</button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl bg-success/20 border border-success/40 text-success text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-4">
          <Check size={16} /> {toast.msg}
        </div>
      )}
    </div>
  );
};

export default SettingsModule;
