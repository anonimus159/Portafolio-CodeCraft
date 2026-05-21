import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, CreditCard, Banknote, Building, CheckCircle, ChefHat, Coffee, Utensils, Printer, Clock, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import { useToast }   from '../context/ToastContext';
import { useConfirm } from '../components/ui/ConfirmDialog';
import { playAddProduct, playPaymentSuccess, playError } from '../utils/sounds';

function Timer({ since }) {
  const [s, setS] = useState(0);
  useEffect(() => { const u = () => setS(Math.floor((Date.now()-new Date(since))/1000)); u(); const t=setInterval(u,1000); return()=>clearInterval(t); }, [since]);
  const m = Math.floor(s/60), sec = s%60;
  const c = m>=20?'#f87171':m>=10?'#fbbf24':'#4ade80';
  return <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,fontWeight:700,color:c,display:'flex',alignItems:'center',gap:4}}><Clock style={{width:10,height:10}}/>{String(m).padStart(2,'0')}:{String(sec).padStart(2,'0')}</span>;
}

const METODOS = [
  { id:'efectivo',      label:'Efectivo',      icon: Banknote   },
  { id:'tarjeta',       label:'Tarjeta',        icon: CreditCard },
  { id:'transferencia', label:'Transferencia',  icon: Building   },
];

export default function PedidoDetail() {
  const { id } = useParams(); const navigate = useNavigate();
  const toast = useToast(); const confirm = useConfirm();
  const [pedido,   setPedido]   = useState(null);
  const [productos,setProductos]= useState([]);
  const [cats,     setCats]     = useState([]);
  const [catActiva,setCatActiva]= useState(null);
  const [filtroTipo,setFiltroTipo]=useState('todos');
  const [showPago, setShowPago] = useState(false);
  const [metodo,   setMetodo]   = useState('efectivo');
  const [showNota, setShowNota] = useState(null);
  const [nota,     setNota]     = useState('');
  const [addingId, setAddingId] = useState(null);

  const load = async () => { try { const r=await api.get(`/pedidos/${id}`); setPedido(r.data.data); } catch { toast.error('Error','No se pudo cargar el pedido'); }};
  const loadProds = async () => { try { const r=await api.get('/productos'); setProductos(r.data.data); if(r.data.data[0]) setCatActiva(r.data.data[0].categoria_id); } catch {} };
  const loadCats = async () => { try { const r=await api.get('/categorias'); setCats(r.data.data); } catch {} };
  useEffect(() => { load(); loadProds(); loadCats(); }, [id]);

  const agregar = async (p) => {
    setAddingId(p.id); setTimeout(()=>setAddingId(null),350); playAddProduct();
    try { await api.post(`/pedidos/${id}/producto`,{producto_id:p.id,cantidad:1,lugar_preparacion:p.tipo==='bebida'?'barra':'cocina'}); load(); toast.success('Agregado',p.nombre); }
    catch { toast.error('Error','No se pudo agregar'); playError(); }
  };
  const agregarConNota = async (p, n) => {
    playAddProduct();
    try { await api.post(`/pedidos/${id}/producto`,{producto_id:p.id,cantidad:1,notas:n,lugar_preparacion:p.tipo==='bebida'?'barra':'cocina'}); load(); setShowNota(null); setNota(''); toast.success('Agregado',`${p.nombre} con nota`); }
    catch { toast.error('Error','No se pudo agregar'); }
  };
  const eliminar = async (dId, nombre) => {
    const ok = await confirm({title:'Eliminar',message:`¿Quitar "${nombre}" del pedido?`,confirmLabel:'Eliminar',type:'danger'});
    if(!ok) return;
    try { await api.delete(`/pedidos/${id}/detalle/${dId}`); load(); toast.warning('Eliminado',nombre); }
    catch { toast.error('Error','No se pudo eliminar'); }
  };
  const cambiarEstado = async (dId, estado) => {
    try { await api.patch(`/pedidos/detalle/${dId}/estado`,{estado}); load(); }
    catch { toast.error('Error','No se actualizó'); }
  };
  const facturar = async () => {
    try { await api.post(`/pedidos/${id}/facturar`,{metodo_pago:metodo}); playPaymentSuccess(); toast.success('¡Pago exitoso!','Pedido facturado'); setShowPago(false); setTimeout(()=>navigate('/mesas'),1000); }
    catch(e) { playError(); toast.error('Error',e.response?.data?.message||e.message); }
  };

  const prodsFiltrados = productos.filter(p => (catActiva===null||p.categoria_id===catActiva)&&(filtroTipo==='todos'||p.tipo===filtroTipo));
  const total = (pedido?.subtotal||0)*1.19;

  if (!pedido) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:300}}><div className="pos-spinner pos-spinner-lg"/></div>;

  const estadoColor = {pendiente:'#facc15',en_preparacion:'#fb923c',listo:'#4ade80',entregado:'#a1a1aa'};

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="page-header">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button onClick={()=>navigate('/mesas')} className="pos-btn pos-btn-ghost pos-btn-sm pos-btn-icon"><ArrowLeft style={{width:15,height:15}}/></button>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <h1 style={{fontSize:20,fontWeight:800,color:'#fafafa',margin:0}}>Pedido #{pedido.id}</h1>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase',padding:'3px 9px',borderRadius:99,background:`${estadoColor[pedido.estado]||'#a1a1aa'}1a`,color:estadoColor[pedido.estado]||'#a1a1aa',border:`1px solid ${estadoColor[pedido.estado]||'#a1a1aa'}30`}}>
                {pedido.estado.replace('_',' ')}
              </span>
            </div>
            <div style={{display:'flex',gap:16,marginTop:4,fontSize:11,color:'#71717a',alignItems:'center'}}>
              <span><Utensils style={{width:10,height:10,display:'inline',marginRight:4}}/>Mesa {pedido.mesa_numero||'Local'}</span>
              <span><ChefHat style={{width:10,height:10,display:'inline',marginRight:4}}/>{pedido.mesero}</span>
              <Timer since={pedido.created_at}/>
            </div>
          </div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setShowPago(true)} className="pos-btn pos-btn-primary">
            <CreditCard style={{width:15,height:15}}/> Pagar ${total.toFixed(2)}
          </button>
        </div>
      </div>

      {/* Layout */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:14}}>
        {/* Productos */}
        <div style={{background:'var(--bg-raised)',border:'1px solid var(--border-subtle)',borderRadius:14,padding:'18px 20px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',color:'#52525b'}}>Agregar Productos</div>
            <select value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)} className="pos-input" style={{width:'auto',padding:'5px 28px 5px 10px',fontSize:12}}>
              <option value="todos">Todos</option><option value="comida">Comida</option><option value="bebida">Bebidas</option>
            </select>
          </div>
          {/* Categorías */}
          <div style={{display:'flex',gap:6,marginBottom:14,overflowX:'auto',paddingBottom:4}}>
            {cats.map(c => (
              <button key={c.id} onClick={()=>setCatActiva(c.id)}
                style={{padding:'5px 12px',borderRadius:8,border:'1px solid',fontSize:12,fontWeight:600,whiteSpace:'nowrap',cursor:'pointer',fontFamily:'inherit',transition:'all 0.15s',
                  background:catActiva===c.id?'rgba(245,158,11,0.15)':'transparent',
                  borderColor:catActiva===c.id?'rgba(245,158,11,0.35)':'rgba(255,255,255,0.08)',
                  color:catActiva===c.id?'#fbbf24':'#71717a'}}>
                {c.nombre}
              </button>
            ))}
          </div>
          {/* Grid */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:10,maxHeight:540,overflowY:'auto'}}>
            {prodsFiltrados.map((p,i) => (
              <motion.div key={p.id}
                animate={addingId===p.id?{scale:[1,1.12,0.96,1.04,1]}:{scale:1}}
                transition={{duration:0.3}}
                onClick={()=>p.tipo==='comida'?setShowNota(p):agregar(p)}
                className="product-card">
                {p.imagen
                  ? <img src={p.imagen} alt={p.nombre} style={{width:'100%',height:76,objectFit:'cover'}}/>
                  : <div style={{width:'100%',height:76,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.03)'}}>
                      {p.tipo==='bebida'?<Coffee style={{width:24,height:24,color:'#52525b'}}/>:<Utensils style={{width:24,height:24,color:'#52525b'}}/>}
                    </div>
                }
                <div style={{padding:'8px 10px'}}>
                  <div style={{fontSize:12,fontWeight:700,color:'#fafafa',marginBottom:4,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.nombre}</div>
                  <div style={{fontSize:13,fontWeight:800,color:'#f59e0b'}}>${p.precio?.toFixed(2)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Orden */}
        <div style={{background:'var(--bg-raised)',border:'1px solid var(--border-subtle)',borderRadius:14,padding:'18px 20px',display:'flex',flexDirection:'column'}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',color:'#52525b',marginBottom:14}}>
            Orden · {pedido.detalles?.length||0} items
          </div>
          <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:6}}>
            {!pedido.detalles?.length ? (
              <div className="pos-empty" style={{padding:'40px 0'}}><Utensils style={{width:28,height:28,color:'#3f3f46'}}/><p style={{fontSize:12,color:'#52525b',margin:0}}>Sin productos</p></div>
            ) : pedido.detalles.map(d => {
              const dc = estadoColor[d.estado]||'#a1a1aa';
              return (
                <div key={d.id} className="order-item">
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:'#fafafa',marginBottom:2}}><span style={{fontWeight:800,marginRight:6}}>{d.cantidad}x</span>{d.producto_nombre}</div>
                      {d.notas&&<div style={{fontSize:11,color:'#f87171'}}>↳ {d.notas}</div>}
                      <div style={{fontSize:11,color:'#52525b'}}>${d.precio_unitario?.toFixed(2)}</div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}}>
                      <span style={{fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:99,background:`${dc}1a`,color:dc,border:`1px solid ${dc}25`}}>{d.estado.replace('_',' ')}</span>
                      <div style={{display:'flex',gap:4}}>
                        {d.estado==='pendiente'&&<button onClick={()=>cambiarEstado(d.id,'en_preparacion')} style={{fontSize:10,color:'#fb923c',background:'none',border:'none',cursor:'pointer',padding:0,fontFamily:'inherit',fontWeight:700}}>Prep</button>}
                        {d.estado==='en_preparacion'&&<button onClick={()=>cambiarEstado(d.id,'listo')} style={{fontSize:10,color:'#4ade80',background:'none',border:'none',cursor:'pointer',padding:0,fontFamily:'inherit',fontWeight:700}}>Listo</button>}
                        <button onClick={()=>eliminar(d.id,d.producto_nombre)} style={{padding:'2px 4px',background:'none',border:'none',cursor:'pointer',color:'#52525b'}} onMouseEnter={e=>e.currentTarget.style.color='#f87171'} onMouseLeave={e=>e.currentTarget.style.color='#52525b'}>
                          <Trash2 style={{width:12,height:12}}/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Totales */}
          <div style={{marginTop:16,paddingTop:16,borderTop:'1px solid var(--border-subtle)'}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#71717a',marginBottom:5}}><span>Subtotal</span><span>${(pedido.subtotal||0).toFixed(2)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#71717a',marginBottom:10}}><span>IVA (19%)</span><span>${((pedido.subtotal||0)*0.19).toFixed(2)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <span style={{fontSize:14,fontWeight:700,color:'#fafafa'}}>Total</span>
              <span style={{fontSize:22,fontWeight:900,color:'#f59e0b'}}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nota */}
      <AnimatePresence>
        {showNota && (
          <div className="pos-modal-backdrop" onClick={()=>setShowNota(null)}>
            <motion.div initial={{opacity:0,scale:0.94}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.94}} className="pos-modal" style={{maxWidth:380}} onClick={e=>e.stopPropagation()}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid var(--border-subtle)'}}>
                <div style={{fontSize:14,fontWeight:700,color:'#fafafa'}}>Nota para: {showNota.nombre}</div>
                <button onClick={()=>setShowNota(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#71717a',padding:4}}><X style={{width:16,height:16}}/></button>
              </div>
              <div style={{padding:20}}>
                <textarea value={nota} onChange={e=>setNota(e.target.value)} placeholder="Ej: sin cebolla, poco sal..." rows={3} className="pos-input" style={{resize:'none',marginBottom:14}} autoFocus/>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>setShowNota(null)} className="pos-btn pos-btn-ghost" style={{flex:1}}>Cancelar</button>
                  <button onClick={()=>agregarConNota(showNota,nota)} className="pos-btn pos-btn-primary" style={{flex:1}}><Plus style={{width:14,height:14}}/>Agregar</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Pago */}
      <AnimatePresence>
        {showPago && (
          <div className="pos-modal-backdrop" onClick={()=>setShowPago(false)}>
            <motion.div initial={{opacity:0,scale:0.94,y:-16}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.94}} className="pos-modal" style={{maxWidth:360}} onClick={e=>e.stopPropagation()}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid var(--border-subtle)'}}>
                <div style={{fontSize:14,fontWeight:700,color:'#fafafa'}}>Procesar Pago</div>
                <button onClick={()=>setShowPago(false)} style={{background:'none',border:'none',cursor:'pointer',color:'#71717a',padding:4}}><X style={{width:16,height:16}}/></button>
              </div>
              <div style={{padding:20}}>
                <div style={{textAlign:'center',padding:'16px 0 20px',borderBottom:'1px solid var(--border-subtle)',marginBottom:20}}>
                  <div style={{fontSize:11,color:'#71717a',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.07em',fontWeight:700}}>Total a pagar</div>
                  <div style={{fontSize:42,fontWeight:900,color:'#f59e0b',letterSpacing:'-0.03em'}}>${total.toFixed(2)}</div>
                </div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',color:'#52525b',marginBottom:10}}>Método de pago</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:20}}>
                  {METODOS.map(m=>{
                    const Icon=m.icon; const sel=metodo===m.id;
                    return (
                      <button key={m.id} onClick={()=>setMetodo(m.id)}
                        style={{padding:'12px 8px',borderRadius:10,border:`2px solid ${sel?'rgba(245,158,11,0.5)':'rgba(255,255,255,0.08)'}`,background:sel?'rgba(245,158,11,0.1)':'transparent',cursor:'pointer',fontFamily:'inherit',display:'flex',flexDirection:'column',alignItems:'center',gap:6,transition:'all 0.15s'}}>
                        <Icon style={{width:20,height:20,color:sel?'#f59e0b':'#52525b'}}/>
                        <span style={{fontSize:11,fontWeight:700,color:sel?'#fbbf24':'#71717a'}}>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
                <button onClick={facturar} className="pos-btn pos-btn-primary pos-btn-lg" style={{width:'100%',justifyContent:'center'}}>
                  <CheckCircle style={{width:17,height:17}}/> Confirmar Pago
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
