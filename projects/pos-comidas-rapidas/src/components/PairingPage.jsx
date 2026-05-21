import React, { useState, useEffect } from 'react';
import { Shield, MonitorSmartphone, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PairingPage = () => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle, connecting, paired, error
  const [errorMsg, setErrorMsg] = useState('');

  const handlePair = async (e) => {
    e.preventDefault();
    if (code.length < 6) return;

    setStatus('connecting');
    setErrorMsg('');

    const formattedCode = code.replace(/\D/g, ''); // Extract only numbers
    const channelName = `pairing-${formattedCode.slice(0, 3)}-${formattedCode.slice(3, 6)}`;
    
    // Conectar al canal de Supabase
    const channel = supabase.channel(channelName);

    channel
      .on('broadcast', { event: 'pairing_accepted' }, () => {
        setStatus('paired');
        channel.unsubscribe();
      })
      .subscribe(async (statusResponse, err) => {
        if (statusResponse === 'SUBSCRIBED') {
          // Send our device info to the POS
          const userAgent = navigator.userAgent;
          let os = 'Dispositivo Móvil';
          if (userAgent.match(/Android/i)) os = 'Android';
          if (userAgent.match(/iPhone|iPad|iPod/i)) os = 'iOS';

          await channel.send({
            type: 'broadcast',
            event: 'device_connecting',
            payload: {
              name: 'Terminal Remota',
              os: os,
              type: window.innerWidth > 768 ? 'tablet' : 'smartphone'
            }
          });

          // Timeout si la caja principal no responde
          setTimeout(() => {
            setStatus((prev) => {
              if (prev === 'connecting') {
                setErrorMsg('El código expiró o la caja principal no respondió.');
                channel.unsubscribe();
                return 'error';
              }
              return prev;
            });
          }, 10000);
        } else if (statusResponse === 'CHANNEL_ERROR') {
          setStatus('error');
          setErrorMsg('Error de conexión con la nube. Revisa tus credenciales de Supabase o la conexión a internet.');
        } else if (statusResponse === 'TIMED_OUT') {
          setStatus('error');
          setErrorMsg('Tiempo de espera agotado al conectar al servidor.');
        }
      });
  };

  return (
    <div className="min-h-screen bg-bg-base text-white flex-center flex-col p-6 animate-in fade-in">
      {status === 'idle' || status === 'error' ? (
        <form onSubmit={handlePair} className="w-full max-w-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-accent-primary/10 rounded-full flex-center mb-6 text-accent-primary shadow-glow">
            <Shield size={36} />
          </div>
          <h1 className="text-3xl font-black mb-2">Conectar POS</h1>
          <p className="text-text-secondary mb-8">Ingresa el código numérico que aparece en la pantalla principal del restaurante.</p>
          
          <div className="w-full mb-6 relative">
            <input 
              type="number" 
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value.slice(0, 6))}
              placeholder="000000"
              className="w-full bg-bg-surface border-2 border-white/10 rounded-2xl p-6 text-center text-4xl font-black tracking-[0.3em] focus:border-accent-primary focus:outline-none focus:ring-4 focus:ring-accent-primary/20 transition-all placeholder:text-text-tertiary/30"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-danger mb-6 p-3 bg-danger/10 border border-danger/20 rounded-lg w-full">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span className="text-xs font-bold text-left">{errorMsg}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={code.length < 6}
            className="w-full btn btn-accent btn-lg shadow-glow disabled:opacity-50 disabled:shadow-none h-16 rounded-2xl text-lg font-bold"
          >
            Vincular Equipo
          </button>
        </form>
      ) : status === 'connecting' ? (
        <div className="flex flex-col items-center text-center animate-in zoom-in-95">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-accent-primary blur-[40px] opacity-40 rounded-full animate-pulse"></div>
            <div className="w-24 h-24 bg-bg-surface rounded-full flex-center border-2 border-accent-primary/50 relative z-10">
              <Loader2 size={40} className="text-accent-primary animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Conectando...</h2>
          <p className="text-text-tertiary">Estableciendo túnel seguro con la caja principal.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center animate-in zoom-in-95">
          <div className="w-24 h-24 bg-success/20 rounded-full flex-center mb-8 text-success scale-in-center shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black mb-3">¡Dispositivo Listo!</h2>
          <p className="text-text-secondary mb-8">La conexión cifrada ha sido establecida. El menú y las mesas se están sincronizando.</p>
          <button onClick={() => window.location.href = '/'} className="w-full btn btn-primary h-14 rounded-2xl text-base font-bold">
            Entrar al Sistema POS
          </button>
        </div>
      )}
    </div>
  );
};

export default PairingPage;
