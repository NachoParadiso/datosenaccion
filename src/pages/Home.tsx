import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { Lock, LogOut, MapPin, Activity, CheckCircle2, Clock } from 'lucide-react';

export default function Home() {
  const { operativos, status } = useSupabaseData();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const authData = sessionStorage.getItem('uba_auth');
    if (authData) {
      const { timestamp } = JSON.parse(authData);
      if (Date.now() - timestamp < 1000 * 60 * 60 * 2) return true;
    }
    return false;
  });

  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('uba_auth', JSON.stringify({ timestamp: Date.now() }));
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('uba_auth');
  };

  // --- PANTALLA DE LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-orange-600/10 blur-[120px]"></div>
          <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]"></div>
        </div>

        <div className="z-10 mb-8 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            UBA <span className="text-orange-500">EN ACCIÓN</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg">Panel de Control Territorial</p>
        </div>

        <div className="z-10 bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-orange-500 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-500 p-3 rounded-full shadow-lg text-white">
            <Lock size={24} />
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-8 mt-4">Acceso Restringido</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-5 py-4 bg-slate-50 border ${error ? 'border-red-500 ring-4 ring-red-500/20' : 'border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20'} rounded-xl outline-none transition-all font-medium text-slate-700`}
                placeholder="Ingresá la clave de acceso..."
              />
              {error && <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1"><span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span> Contraseña incorrecta.</p>}
            </div>
            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-orange-600/30 active:scale-[0.98]">
              Ingresar al Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- PANEL DE CONTROL PRINCIPAL ---
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 text-white">
              <Activity size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">
                Panel <span className="text-orange-600">Presidencial</span>
              </h1>
              <p className="text-slate-500 font-medium text-sm md:text-base">Monitoreo de operativos en tiempo real</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-600 px-5 py-3 rounded-xl font-semibold transition-colors w-full md:w-auto justify-center"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>

        {/* GRILLA DE TARJETAS */}
        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Activity className="text-orange-500 animate-spin" size={48} />
            <p className="text-slate-500 font-medium text-lg">Cargando base de datos territorial...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            {operativos.map((op: any) => {
              const estado = op.estado || 'cerrado'; 
              
              let cardStyle = 'border-slate-200 bg-white shadow-sm hover:border-orange-300';
              let iconStyle = 'bg-slate-100 text-slate-500 group-hover:bg-orange-50 group-hover:text-orange-500';
              
              if (estado === 'en_vivo') {
                cardStyle = 'border-orange-500 bg-white shadow-orange-500/20 shadow-xl';
                iconStyle = 'bg-orange-100 text-orange-600';
              } else if (estado === 'proximo') {
                cardStyle = 'border-blue-300 bg-white shadow-blue-500/10 shadow-md hover:border-blue-400';
                iconStyle = 'bg-blue-50 text-blue-500 group-hover:bg-blue-100';
              }

              return (
                <Link 
                  key={op.id} 
                  to={`/dashboard/${op.id}`}
                  className={`group relative block w-full rounded-3xl p-8 border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl overflow-hidden ${cardStyle}`}
                >
                  {estado === 'en_vivo' && (
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                  )}
                  {estado === 'proximo' && (
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                  )}

                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl transition-colors ${iconStyle}`}>
                      <MapPin size={28} />
                    </div>
                    
                    {estado === 'en_vivo' && (
                      <div className="flex items-center gap-2 bg-red-100 border border-red-200 text-red-700 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                        En Vivo
                      </div>
                    )}
                    {estado === 'proximo' && (
                      <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-blue-100">
                        <Clock size={14} />
                        Próximo
                      </div>
                    )}
                    {estado === 'cerrado' && (
                      <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                        <CheckCircle2 size={16} />
                        Cerrado
                      </div>
                    )}
                  </div>
                  
                  <h2 className={`text-2xl font-black mb-3 transition-colors ${estado === 'proximo' ? 'text-slate-700 group-hover:text-blue-600' : 'text-slate-800 group-hover:text-orange-600'}`}>
                    {op.barrio}
                  </h2>
                  
                  <div className="flex items-center gap-2 text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Fecha:</span> 
                    {/* EL FIX DE LA ZONA HORARIA ESTÁ ACÁ ADENTRO ↓ */}
                    {new Date(op.fecha).toLocaleDateString('es-AR', { 
                      timeZone: 'UTC', 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}