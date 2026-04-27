import { Registro } from '../types';

const NOMBRES = [
  'María González', 'Carlos Rodríguez', 'Ana Martínez', 'Luis López', 'Patricia Fernández',
  'Jorge García', 'Sandra Torres', 'Roberto Díaz', 'Claudia Ruiz', 'Martín Pérez',
  'Valeria Moreno', 'Diego Romero', 'Lucía Herrera', 'Alejandro Jiménez', 'Natalia Castro',
  'Sebastián Vargas', 'Florencia Molina', 'Nicolás Ortega', 'Camila Álvarez', 'Facundo Reyes',
  'Sofía Medina', 'Ezequiel Suárez', 'Romina Cabrera', 'Leandro Flores', 'Gabriela Aguilar',
  'Marcelo Ibáñez', 'Verónica Acosta', 'Gustavo Benítez', 'Silvana Fuentes', 'Pablo Ríos',
  'Daniela Méndez', 'Ignacio Soria', 'Adriana Campos', 'Eduardo Luna', 'Micaela Navarro',
  'Fernando Giménez', 'Paola Quiroga', 'Hernán Ponce', 'Lorena Vega', 'Ricardo Espinoza',
  'Cecilia Pereyra', 'Ariel Maldonado', 'Noelia Sánchez', 'Raúl Delgado', 'Mónica Núñez',
  'Esteban Gutiérrez', 'Laura Guerrero', 'Matías Domínguez', 'Analía Moya', 'Javier Bravo',
  'Karina Ramos', 'Julio Santillán', 'Mariana Quispe', 'Elio Mamani', 'Rosa Chávez',
  'Héctor Flores', 'Susana Aparicio', 'Tomás Correa', 'Inés Villalba', 'Omar Carrillo',
  'Beatriz Figueroa', 'Andrés Leguizamón', 'Nadia Peralta', 'César Montes', 'Elena Paredes',
  'Walter Juárez', 'Mirta Ávalos', 'Emilio Coronel', 'Viviana Zárate', 'Horacio Oviedo',
  'Débora Leiva', 'Patricio Cuello', 'Alicia Serrano', 'Rodrigo Cardozo', 'Selva Choque',
  'Mario Pizarro', 'Graciela Barroso', 'Iván Segura', 'Claudia Mamani', 'Néstor Almada',
  'Paula Reinoso', 'Adrián Espósito', 'Liliana Sajama', 'Juan Tolaba', 'Silvia Cortez',
  'Marcos Heredia', 'Claudia Salvatierra', 'Hugo Rivadeneira', 'Teresa Alanoca', 'Bruno Furlán',
];

const ESPECIALIDADES = [
  'Odontología','Odontología','Odontología','Odontología','Odontología',
  'Clínica médica','Clínica médica','Clínica médica','Clínica médica',
  'Pediatría','Pediatría','Pediatría',
  'Ginecología','Ginecología','Ginecología',
  'Salud mental','Salud mental',
  'Enfermería','Enfermería',
  'Oftalmología','Oftalmología',
  'Nutrición','Nutrición',
  'Trabajo social',
  'Vacunación','Vacunación',
  'Otra',
];

const PROCEDENCIAS = [
  'CABA','CABA','CABA','CABA','CABA','CABA','CABA','CABA',
  'Provincia de Buenos Aires','Provincia de Buenos Aires','Provincia de Buenos Aires','Provincia de Buenos Aires',
  'Otra provincia','Otra provincia',
  'Otro país',
];

const LOCALIDADES = [
  'Villa del Parque','Flores','Palermo','Barracas','La Boca','Lugano','Mataderos',
  'Pompeya','Liniers','Caballito','Villa Urquiza','Belgrano','Balvanera',
  'Lanús','Quilmes','Lomas de Zamora','La Matanza','San Justo','Morón',
  'Florencio Varela','Berazategui','Avellaneda','San Isidro','Tres de Febrero',
  'Tigre','Merlo','Ituzaingó','Hurlingham','Marcos Paz',
  'Córdoba Capital','Rosario','Mendoza','Tucumán',
  'Bolivia','Paraguay','Venezuela','Perú','Brasil',
];

const MOTIVOS = [
  'Control general', 'Dolor de cabeza', 'Revisión dental', 'Control de presión',
  'Vacunación pendiente', 'Problema ocular', 'Dolor de muelas', 'Control de peso',
  'Salud mental', 'Control pediátrico', 'Revisión ginecológica', 'Trabajo social',
  'Dolor de espalda', 'Control de glucemia', 'Problema de piel', 'Asesoramiento nutricional',
  'Consulta general', 'Seguimiento de tratamiento', 'Primera consulta',
];

const CALLE = ['No','No','No','No','No','No','No','No','No','Sí','Sí','Prefiere no responder'];
const COBERTURA = ['No','No','No','No','No','Sí','Sí','Sí','No sabe / no responde'];
const GENEROS = ['Femenino','Femenino','Femenino','Masculino','Masculino','Masculino','No binario','Prefiere no responder'];
const PREVIO = ['No','No','Sí','No sabe'];

function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rndInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }

function genHora(): number {
  const weights = [0,0,0,0,0,0,1,3,8,12,14,12,10,8,8,7,7,5,4,3,2,2,2,1];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return 12;
}

function genFecha(hora: number): Date {
  const d = new Date(2026, 3, 25, hora, rndInt(0, 59), rndInt(0, 59));
  return d;
}

function formatTimestamp(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
}

function genDni(): string {
  return String(rndInt(10_000_000, 45_000_000));
}

export function generarMockData(n = 90): Registro[] {
  return Array.from({ length: n }, (_, i) => {
    const hora = genHora();
    const fecha = genFecha(hora);
    const procedencia = rnd(PROCEDENCIAS);
    const especialidad = rnd(ESPECIALIDADES);

    const isNino = Math.random() < 0.12;
    const edad = isNino ? rndInt(1, 12) : rndInt(18, 78);

    return {
      id: `mock-${i}`,
      marca_temporal: formatTimestamp(fecha),
      nombre_completo: rnd(NOMBRES),
      dni: genDni(),
      telefono: Math.random() > 0.15 ? `11${rndInt(10_000_000, 99_999_999)}` : 'Sin teléfono',
      procedencia,
      localidad_barrio: rnd(LOCALIDADES),
      situacion_calle: rnd(CALLE),
      especialidad,
      motivo_consulta: rnd(MOTIVOS),
      edad,
      genero: isNino && Math.random() > 0.5 ? 'Masculino' : rnd(GENEROS),
      cobertura_medica: rnd(COBERTURA),
      atendido_previamente: rnd(PREVIO),
      observaciones: '',
      hora,
      fecha,
    };
  }).sort((a, b) => (b.fecha?.getTime() ?? 0) - (a.fecha?.getTime() ?? 0));
}

export const MOCK_DATA = generarMockData(90);
