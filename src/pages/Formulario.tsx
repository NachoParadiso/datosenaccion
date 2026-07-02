import React, { useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import { useParams } from 'react-router-dom';

// Si tenés un archivo de tipos, ajustá la importación. 
// Acá asumo que usás la función createRegistro desde tus props o un hook.
interface FormularioProps {
  operativoId: string;
  createRegistro: (data: any) => Promise<any>;
  onSuccess: () => void;
}

// Catálogos hardcodeados basados en las imágenes para asegurar compatibilidad rápida
const EDADES = [
  { id: 1, label: 'Menos de 18 años' }, { id: 2, label: '18 a 24 años' },
  { id: 3, label: '25 a 34 años' }, { id: 4, label: '35 a 44 años' },
  { id: 5, label: '45 a 54 años' }, { id: 6, label: '55 a 64 años' },
  { id: 7, label: '65 años o más' }
];

const COBERTURAS = [
  { id: 1, label: 'Obra social' }, { id: 2, label: 'Prepaga' },
  { id: 3, label: 'PAMI' }, { id: 4, label: 'Solo salud pública / no tengo cobertura' },
  { id: 5, label: 'Otro' }
];

const RESIDENCIAS = [
  { id: 1, label: 'Ciudad Autónoma de Buenos Aires' },
  { id: 2, label: 'Conurbano Bonaerense' },
  { id: 3, label: 'Otra provincia' }
];

const SITUACION_LABORAL = [
  { id: 1, label: 'Empleado/a en relación de dependencia' },
  { id: 2, label: 'Trabajo informal / en negro' },
  { id: 3, label: 'Monotributista / autónomo' },
  { id: 4, label: 'Desempleado/a (busco trabajo)' },
  { id: 5, label: 'No trabajo ni busco trabajo' }
];

const IMPEDIMENTOS = [
  { id: 1, label: 'Supermercado' }, { id: 2, label: 'El alquiler' },
  { id: 3, label: 'Los servicios (luz, gas, agua)' }, { id: 4, label: 'El transporte' },
  { id: 5, label: 'La salud y medicamentos' }, { id: 6, label: 'La educación / útiles' },
  { id: 7, label: 'Las deudas o créditos' }, { id: 8, label: 'Llego a fin de mes sin problemas' }
];

const URGENCIAS = [
  { id: 1, label: 'Inflación y costo de vida' }, { id: 2, label: 'Empleo y salarios' },
  { id: 3, label: 'Salud pública' }, { id: 4, label: 'Seguridad' },
  { id: 5, label: 'Educación' }, { id: 6, label: 'Vivienda' },
  { id: 7, label: 'Jubilaciones y pensiones' }, { id: 8, label: 'Corrupción e instituciones' },
  { id: 9, label: 'Pobreza e indigencia' }
];

const PROPUESTAS = [
  { id: 1, label: 'Mantenimiento del espacio público (arreglo de calles - limpieza - iluminación y plazas)' },
  { id: 2, label: 'Mayor seguridad y prevención comunitaria' },
  { id: 3, label: 'Operativos de salud gratuitos (chequeos - consultas médicas y medicamentos)' },
  { id: 4, label: 'Asistencia social y alimentaria (apoyo a comedores y merenderos)' },
  { id: 5, label: 'Deporte y recreación (actividades para chicos - jóvenes y adultos)' },
  { id: 6, label: 'Cursos de formación laboral y oficios' },
  { id: 7, label: 'Cultura y educación (talleres - apoyo escolar y eventos artísticos)' }
];

export default function Formulario({ operativoId, createRegistro, onSuccess }: FormularioProps) {
  const params = useParams();
  const idReal = params.id || params.operativoId || operativoId;
  const [edad, setEdad] = useState<number | null>(null);
  const [cobertura, setCobertura] = useState<number | null>(null);
  const [residencia, setResidencia] = useState<number | null>(null);
  const [laboral, setLaboral] = useState<number | null>(null);
  const [impedimentosSeleccionados, setImpedimentosSeleccionados] = useState<number[]>([]);
  const [urgenciasSeleccionadas, setUrgenciasSeleccionadas] = useState<number[]>([]);
  const [propuestasSeleccionadas, setPropuestasSeleccionadas] = useState<number[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  // Lógica para manejar checkboxes (múltiples opciones y límites)
  const handleToggle = (
    id: number, 
    current: number[], 
    setter: React.Dispatch<React.SetStateAction<number[]>>, 
    max?: number
  ) => {
    if (current.includes(id)) {
      setter(current.filter(item => item !== id));
    } else {
      if (max && current.length >= max) return; // Bloquea si ya llegó al máximo
      setter([...current, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    // Validación estricta: Todo es obligatorio
    if (!edad || !cobertura || !residencia || !laboral || 
        impedimentosSeleccionados.length === 0 || 
        urgenciasSeleccionadas.length === 0 || 
        propuestasSeleccionadas.length === 0) {
      setErrorValidacion("Por favor, respondé todas las preguntas marcadas con * para continuar.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    const dniFalsoUnico = Date.now().toString().slice(-8);
    const payload = {
      operativo_id: idReal,
      nombre_completo: 'Anónimo', 
      dni: dniFalsoUnico,           
      rango_etario_id: edad,
      cobertura_id: cobertura,
      residencia_id: residencia,
      situacion_laboral_id: laboral,
      impedimentos: impedimentosSeleccionados, // <-- Pasamos el array limpio
      urgencias: urgenciasSeleccionadas,       // <-- Pasamos el array limpio
      propuestas_barrio: propuestasSeleccionadas // <-- Pasamos el array limpio
    };

    try {
      await supabaseService.createRegistro(payload);
      // En vez de llamar a onSuccess, cambiamos nuestro propio estado
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Error al enviar:", error);
      setErrorValidacion("Hubo un error al guardar la encuesta. Intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-10 text-center space-y-6 border-t-8 border-green-500">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">¡Muchas gracias!</h2>
        <p className="text-lg text-gray-600">Tus respuestas han sido enviadas de forma anónima y exitosa.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-blue-600 font-semibold hover:underline"
        >
          Cargar otra respuesta
        </button>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto mb-12">
      {/* Cabecera estilo Google Forms Premium */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 h-32 rounded-t-2xl relative overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        {/* Adorno visual: Círculos superpuestos para darle textura */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-b-2xl shadow-lg overflow-hidden p-6 md:p-10 space-y-12 md:space-y-16 -mt-2">
        
        {/* Título y Descripción */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Asistencia Barrial <br></br> <span className="text-orange-600">UBA EN ACCION</span></h1>
          <p className="text-gray-600 leading-relaxed">
            Tu opinión es fundamental para entender las urgencias del barrio y proponer soluciones concretas. 
            <strong> Esta encuesta es 100% anónima</strong> y los datos se utilizarán únicamente con fines estadísticos.
          </p>
        </div>
      
      {errorValidacion && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded animate-pulse">
          <p className="font-bold">Atención</p>
          <p>{errorValidacion}</p>
        </div>
      )}

      {/* EDAD */}
      <div className="space-y-3">
        <label className="text-lg font-semibold text-gray-800">Edad <span className="text-red-500">*</span></label>
        <div className="space-y-4">
          {EDADES.map(opt => (
            <label key={opt.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
              <input type="radio" name="edad" value={opt.id} checked={edad === opt.id} onChange={() => setEdad(opt.id)} className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"/>
              <span className="text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 border-t-2 rounded-full" />

      {/* COBERTURA */}
      <div className="space-y-3">
        <label className="text-lg font-semibold text-gray-800">¿Tenés cobertura médica? <span className="text-red-500">*</span></label>
        <div className="space-y-4">
          {COBERTURAS.map(opt => (
            <label key={opt.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
              <input type="radio" name="cobertura" value={opt.id} checked={cobertura === opt.id} onChange={() => setCobertura(opt.id)} className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"/>
              <span className="text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 border-t-2 rounded-full" />

      {/* RESIDENCIA */}
      <div className="space-y-3">
        <label className="text-lg font-semibold text-gray-800">¿Dónde vivís? <span className="text-red-500">*</span></label>
        <div className="space-y-4">
          {RESIDENCIAS.map(opt => (
            <label key={opt.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
              <input type="radio" name="residencia" value={opt.id} checked={residencia === opt.id} onChange={() => setResidencia(opt.id)} className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"/>
              <span className="text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 border-t-2 rounded-full" />

      {/* SITUACIÓN LABORAL */}
      <div className="space-y-3">
        <label className="text-lg font-semibold text-gray-800">¿Cuál es tu situación laboral actual? <span className="text-red-500">*</span></label>
        <div className="space-y-4">
          {SITUACION_LABORAL.map(opt => (
            <label key={opt.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
              <input type="radio" name="laboral" value={opt.id} checked={laboral === opt.id} onChange={() => setLaboral(opt.id)} className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"/>
              <span className="text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 border-t-2 rounded-full" />

      {/* IMPEDIMENTOS */}
      <div className="space-y-3">
        <div>
          <label className="text-lg font-semibold text-gray-800">¿Qué te impide llegar a fin de mes? <span className="text-red-500">*</span></label>
          <p className="text-sm text-gray-500">Puede marcar más de una</p>
        </div>
        <div className="space-y-4">
          {IMPEDIMENTOS.map(opt => (
            <label key={opt.id} className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
              <input type="checkbox" checked={impedimentosSeleccionados.includes(opt.id)} onChange={() => handleToggle(opt.id, impedimentosSeleccionados, setImpedimentosSeleccionados)} className="w-5 h-5 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"/>
              <span className="text-gray-700 leading-snug">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 border-t-2 rounded-full" />

      {/* URGENCIAS */}
      <div className="space-y-3">
        <div>
          <label className="text-lg font-semibold text-gray-800">¿Qué tema debería tratar el gobierno con mayor urgencia? <span className="text-red-500">*</span></label>
          <p className="text-sm text-gray-500">Hasta 3 opciones.</p>
        </div>
        <div className="space-y-4">
          {URGENCIAS.map(opt => {
            const isChecked = urgenciasSeleccionadas.includes(opt.id);
            const isMaxReached = urgenciasSeleccionadas.length >= 3;
            const disabled = !isChecked && isMaxReached;
            
            return (
              <label key={opt.id} className={`flex items-start space-x-3 p-2 rounded transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
                <input type="checkbox" checked={isChecked} disabled={disabled} onChange={() => handleToggle(opt.id, urgenciasSeleccionadas, setUrgenciasSeleccionadas, 3)} className="w-5 h-5 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:bg-gray-200"/>
                <span className="text-gray-700 leading-snug">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <hr className="border-gray-100 border-t-2 rounded-full" />

      {/* PROPUESTAS */}
      <div className="space-y-3">
        <div>
          <label className="text-lg font-semibold text-gray-800">¿Qué te gustaría que un partido político haga en tu barrio? <span className="text-red-500">*</span></label>
          <p className="text-sm text-gray-500">Hasta 3 opciones.</p>
        </div>
        <div className="space-y-4">
          {PROPUESTAS.map(opt => {
            const isChecked = propuestasSeleccionadas.includes(opt.id);
            const isMaxReached = propuestasSeleccionadas.length >= 3;
            const disabled = !isChecked && isMaxReached;
            
            return (
              <label key={opt.id} className={`flex items-start space-x-3 p-2 rounded transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
                <input type="checkbox" checked={isChecked} disabled={disabled} onChange={() => handleToggle(opt.id, propuestasSeleccionadas, setPropuestasSeleccionadas, 3)} className="w-5 h-5 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:bg-gray-200"/>
                <span className="text-gray-700 leading-snug">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full mt-8 bg-orange-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-orange-700 focus:ring-4 focus:ring-orange-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/30 text-lg"
      >
        {isSubmitting ? 'Enviando Respuestas...' : 'Enviar Encuesta'}
      </button>

    </form>
    </div>
  );
}