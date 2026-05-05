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

const RANGO_ETARIO = [
  '18 a 24 años','18 a 24 años',
  '25 a 34 años','25 a 34 años','25 a 34 años','25 a 34 años',
  '35 a 44 años','35 a 44 años','35 a 44 años','35 a 44 años',
  '45 a 54 años','45 a 54 años','45 a 54 años',
  '55 a 64 años','55 a 64 años',
  '65 años o más','65 años o más',
];

const COBERTURA = [
  'Obra social','Obra social','Obra social','Obra social',
  'Prepaga','Prepaga','Prepaga',
  'PAMI','PAMI',
  'Solo salud pública / no tengo cobertura','Solo salud pública / no tengo cobertura','Solo salud pública / no tengo cobertura','Solo salud pública / no tengo cobertura','Solo salud pública / no tengo cobertura',
  'Otro',
];

const RESIDENCIA = [
  'CABA','CABA','CABA','CABA','CABA','CABA',
  'Conurbano Bonaerense','Conurbano Bonaerense','Conurbano Bonaerense','Conurbano Bonaerense','Conurbano Bonaerense',
  'Otra provincia','Otra provincia',
];

const SITUACION_LABORAL = [
  'Empleado/a en relación de dependencia','Empleado/a en relación de dependencia','Empleado/a en relación de dependencia',
  'Trabajo informal / en negro','Trabajo informal / en negro','Trabajo informal / en negro','Trabajo informal / en negro',
  'Monotributista / autónomo','Monotributista / autónomo',
  'Desempleado/a (busco trabajo)','Desempleado/a (busco trabajo)','Desempleado/a (busco trabajo)',
  'No trabajo ni busco trabajo','No trabajo ni busco trabajo',
];

const IMPEDIMENTOS_OPS = [
  'Supermercado','Supermercado','Supermercado','Supermercado','Supermercado',
  'El alquiler','El alquiler','El alquiler','El alquiler',
  'Los servicios (luz, gas, agua)','Los servicios (luz, gas, agua)','Los servicios (luz, gas, agua)',
  'El transporte','El transporte',
  'La salud y medicamentos','La salud y medicamentos',
  'La educación / útiles','La educación / útiles',
  'Las deudas o créditos','Las deudas o créditos',
  'Llego a fin de mes sin problemas',
];

const URGENCIAS_OPS = [
  'Inflación y costo de vida','Inflación y costo de vida','Inflación y costo de vida','Inflación y costo de vida','Inflación y costo de vida',
  'Empleo y salarios','Empleo y salarios','Empleo y salarios',
  'Salud pública','Salud pública',
  'Seguridad','Seguridad','Seguridad',
  'Educación','Educación',
  'Vivienda','Vivienda',
  'Jubilaciones y pensiones',
  'Corrupción e instituciones',
  'Pobreza e indigencia','Pobreza e indigencia',
];

function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rndInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }

function genImpedimentos(): string[] {
  const n = Math.random() < 0.15 ? 0 : rndInt(1, 4);
  const selected: string[] = [];
  const used = new Set<string>();
  for (let i = 0; i < n; i++) {
    let v: string;
    let attempts = 0;
    do {
      v = rnd(IMPEDIMENTOS_OPS);
      attempts++;
    } while (used.has(v) && attempts < 10);
    used.add(v);
    selected.push(v);
  }
  return [...new Set(selected)];
}

function genUrgencias(): string[] {
  const n = rndInt(1, 3);
  const selected: string[] = [];
  const used = new Set<string>();
  for (let i = 0; i < n; i++) {
    let v: string;
    let attempts = 0;
    do {
      v = rnd(URGENCIAS_OPS);
      attempts++;
    } while (used.has(v) && attempts < 10);
    used.add(v);
    selected.push(v);
  }
  return [...new Set(selected)];
}

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
  return new Date(2026, 3, 25, hora, rndInt(0, 59), rndInt(0, 59));
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

    return {
      id: `mock-${i}`,
      marca_temporal: formatTimestamp(fecha),
      nombre_completo: rnd(NOMBRES),
      dni: genDni(),
      telefono: '',
      procedencia: '',
      localidad_barrio: '',
      situacion_calle: '',
      especialidad: '',
      motivo_consulta: '',
      edad: null,
      genero: '',
      cobertura_medica: '',
      atendido_previamente: '',
      observaciones: '',
      hora,
      fecha,
      rango_etario: rnd(RANGO_ETARIO),
      cobertura: rnd(COBERTURA),
      residencia: rnd(RESIDENCIA),
      situacion_laboral: rnd(SITUACION_LABORAL),
      impedimentos: genImpedimentos(),
      urgencias: genUrgencias(),
    };
  }).sort((a, b) => (b.fecha?.getTime() ?? 0) - (a.fecha?.getTime() ?? 0));
}

export const MOCK_DATA = generarMockData(90);

import type { Estadisticas } from '../types';

export const MOCK_STATS: Estadisticas = {
  total: MOCK_DATA.length,
  ultima_hora: 12,
  especialidad_top: 'CABA',
  pct_calle: 0,
  pct_sin_cobertura: 35,
  procedencia_top: 'Trabajo informal / en negro',
  con_telefono: 28,
  por_rango_etario: [
    { name: '18 a 24 años', value: 25 },
    { name: '25 a 34 años', value: 22 },
    { name: '35 a 44 años', value: 18 },
    { name: '45 a 54 años', value: 12 },
    { name: '55 a 64 años', value: 8 },
    { name: '65 años o más', value: 3 },
    { name: 'Menos de 18 años', value: 2 },
  ],
  por_cobertura: [
    { name: 'Obra social', value: 30 },
    { name: 'Prepaga', value: 15 },
    { name: 'PAMI', value: 5 },
    { name: 'Solo salud pública / no tengo cobertura', value: 35 },
    { name: 'Otro', value: 5 },
  ],
  por_residencia: [
    { name: 'CABA', value: 50 },
    { name: 'Conurbano Bonaerense', value: 30 },
    { name: 'Otra provincia', value: 10 },
  ],
  por_situacion_laboral: [
    { name: 'Empleado/a en relación de dependencia', value: 25 },
    { name: 'Trabajo informal / en negro', value: 28 },
    { name: 'Monotributista / autónomo', value: 12 },
    { name: 'Desempleado/a (busco trabajo)', value: 18 },
    { name: 'No trabajo ni busco trabajo', value: 7 },
  ],
  top_impedimentos: [
    { name: 'La salud y medicamentos', value: 32 },
    { name: 'Supermercado', value: 28 },
    { name: 'El alquiler', value: 22 },
    { name: 'Los servicios (luz, gas, agua)', value: 18 },
    { name: 'El transporte', value: 15 },
    { name: 'La educación / útiles', value: 10 },
    { name: 'Las deudas o créditos', value: 8 },
    { name: 'Llego a fin de mes sin problemas', value: 5 },
  ],
  top_urgencias: [
    { name: 'Inflación y costo de vida', value: 38 },
    { name: 'Empleo y salarios', value: 28 },
    { name: 'Salud pública', value: 22 },
    { name: 'Seguridad', value: 15 },
    { name: 'Educación', value: 12 },
    { name: 'Vivienda', value: 10 },
    { name: 'Jubilaciones y pensiones', value: 8 },
    { name: 'Corrupción e instituciones', value: 5 },
    { name: 'Pobreza e indigencia', value: 4 },
  ],
  por_hora: Array.from({ length: 24 }, (_, h) => ({
    hora: `${String(h).padStart(2, '0')}:00`,
    total: h >= 8 && h <= 18 ? Math.floor(Math.random() * 8) + 1 : 0,
  })),
  alertas: [],
};
