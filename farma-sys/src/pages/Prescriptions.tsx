import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

const mockPrescriptions = [
  { id: 'RX-1029', patient: 'Ana Martínez', doctor: 'Dr. Carlos Vega', date: '2023-10-25', status: 'pending', items: ['Amoxicilina 500mg', 'Ibuprofeno 400mg'] },
  { id: 'RX-1028', patient: 'Luis Torres', doctor: 'Dra. María Gómez', date: '2023-10-24', status: 'approved', items: ['Losartán 50mg'] },
  { id: 'RX-1027', patient: 'Carmen Ruiz', doctor: 'Dr. Juan Silva', date: '2023-10-24', status: 'rejected', items: ['Clonazepam 2mg'] },
  { id: 'RX-1026', patient: 'Roberto Paz', doctor: 'Dra. Elena Rojas', date: '2023-10-23', status: 'approved', items: ['Metformina 850mg', 'Insulina Glargina'] },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
  };
  
  const labels = { pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada' };
  const icons = { 
    pending: <Clock className="w-3.5 h-3.5 mr-1" />, 
    approved: <CheckCircle className="w-3.5 h-3.5 mr-1" />, 
    rejected: <XCircle className="w-3.5 h-3.5 mr-1" /> 
  };

  return (
    <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status as keyof typeof styles])}>
      {icons[status as keyof typeof icons]}
      {labels[status as keyof typeof labels]}
    </span>
  );
};

export const Prescriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredData = mockPrescriptions.filter(rx => {
    const matchesSearch = rx.patient.toLowerCase().includes(searchTerm.toLowerCase()) || rx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || rx.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recetas Médicas</h1>
          <p className="text-muted-foreground mt-1">Validación y despacho de medicamentos con receta.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-sm active:scale-95">
          <FileText className="w-4 h-4" />
          Escanear Nueva Receta
        </button>
      </div>

      <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar por paciente o código RX..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={clsx(
                  "px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize border",
                  selectedFilter === filter 
                    ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {filter === 'all' ? 'Todas' : filter === 'pending' ? 'Pendientes' : filter === 'approved' ? 'Aprobadas' : 'Rechazadas'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Código RX</th>
                <th className="px-6 py-4 font-semibold">Paciente</th>
                <th className="px-6 py-4 font-semibold">Médico</th>
                <th className="px-6 py-4 font-semibold">Medicamentos</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredData.map((rx, idx) => (
                  <motion.tr 
                    key={rx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono font-medium text-primary">{rx.id}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{rx.patient}</td>
                    <td className="px-6 py-4 text-muted-foreground">{rx.doctor}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {rx.items.map((item, i) => (
                          <span key={i} className="text-xs bg-muted px-2 py-1 rounded-md text-foreground border border-border/50">
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={rx.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto opacity-20 mb-3" />
              <p>No se encontraron recetas médicas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
