/**
 * Google Apps Script — Puente entre Google Forms/Sheets y Supabase.
 *
 * Instrucciones de instalación:
 * 1. Abrir la Google Sheet que recibe las respuestas del formulario.
 * 2. Ir a Extensiones → Apps Script.
 * 3. Reemplazar el contenido del editor con este archivo.
 * 4. Configurar las constantes SUPABASE_URL y SUPABASE_SERVICE_KEY abajo.
 * 5. Guardar el proyecto (Ctrl+S).
 * 6. Crear un trigger: Editar → Disparadores del proyecto actual →
 *    Agregar disparador → onFormSubmit → Desde hoja de cálculo →
 *    Tipo de evento: Al enviarse.
 * 7. Aceptar los permisos que solicita.
 *
 * Flujo:
 *   Google Form → Google Sheets → trigger onFormSubmit → POST a Supabase RPC
 */

// ============================================================================
// CONFIGURACIÓN (completar antes de usar)
// ============================================================================

const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_SERVICE_KEY = 'TU_SERVICE_ROLE_KEY';

// Mapeo de columnas de la Google Sheet a IDs de los catálogos de Supabase.
// Los valores deben coincidir EXACTAMENTE con las descripciones en los catálogos.
// Si cambiás una opción en el formulario, actualizá este mapeo.

const MAP_RANGO_ETARIO = {
  'Menos de 18 años': 1,
  '18 a 24 años': 2,
  '25 a 34 años': 3,
  '35 a 44 años': 4,
  '45 a 54 años': 5,
  '55 a 64 años': 6,
  '65 años o más': 7,
};

const MAP_COBERTURA = {
  'Obra social (empleo en relación de dependencia)': 1,
  'Obra social': 1,
  'Prepaga': 2,
  'PAMI': 3,
  'Solo salud pública / no tengo cobertura': 4,
  'Otro': 5,
};

const MAP_RESIDENCIA = {
  'Ciudad Autónoma de Buenos Aires': 1,
  'Conurbano Bonaerense': 2,
  'Otra provincia': 3,
};

const MAP_SITUACION_LABORAL = {
  'Empleado/a en relación de dependencia (en blanco)': 1,
  'Empleado/a en relación de dependencia': 1,
  'Trabajo informal / en negro': 2,
  'Monotributista / autónomo': 3,
  'Desempleado/a (busco trabajo)': 4,
  'No trabajo ni busco trabajo (estudio, jubilado/a, etc.)': 5,
  'No trabajo ni busco trabajo': 5,
};

const MAP_IMPEDIMENTOS = {
  'Supermercado': 1,
  'El alquiler': 2,
  'Los servicios (luz, gas, agua)': 3,
  'El transporte': 4,
  'La salud y medicamentos': 5,
  'La educación / útiles': 6,
  'Las deudas o créditos': 7,
  'Llego a fin de mes sin problemas': 8,
};

const MAP_URGENCIAS = {
  'Inflación y costo de vida': 1,
  'Empleo y salarios': 2,
  'Salud pública': 3,
  'Seguridad': 4,
  'Educación': 5,
  'Vivienda': 6,
  'Jubilaciones y pensiones': 7,
  'Corrupción e instituciones': 8,
  'Pobreza e indigencia': 9,
};

// ============================================================================
// FUNCIÓN PRINCIPAL — Trigger onFormSubmit
// ============================================================================

/**
 * Se ejecuta automáticamente cuando se envía una respuesta del formulario.
 * @param {Object} e — Evento de Google Sheets onFormSubmit
 */
function onFormSubmit(e) {
  try {
    if (!e || !e.values) {
      Logger.log('onFormSubmit: evento sin valores');
      return;
    }

    const values = e.values;

    // Las columnas de la Sheet dependen del orden del formulario.
    // Ajustar los índices según el orden real de las columnas.
    // Índice 0 = marca temporal (automático de Google)
    // Modificar estos índices según el formulario real:
    const colNombreCompleto = 1;
    const colDNI = 2;
    const colRangoEtario = 3;
    const colCobertura = 4;
    const colResidencia = 5;
    const colImpedimentos = 6;     // Opción múltiple, separada por comas
    const colUrgencias = 7;         // Opción múltiple, separada por comas
    const colSituacionLaboral = 8;

    const payload = {
      nombre_completo: safeString(values[colNombreCompleto]),
      dni: safeString(values[colDNI]),
      rango_etario_id: lookupId(MAP_RANGO_ETARIO, values[colRangoEtario]),
      cobertura_id: lookupId(MAP_COBERTURA, values[colCobertura]),
      residencia_id: lookupId(MAP_RESIDENCIA, values[colResidencia]),
      situacion_laboral_id: lookupId(MAP_SITUACION_LABORAL, values[colSituacionLaboral]),
      impedimentos: parseMultipleChoice(MAP_IMPEDIMENTOS, values[colImpedimentos]),
      urgencias: parseMultipleChoice(MAP_URGENCIAS, values[colUrgencias]),
    };

    // Validar campos obligatorios antes de enviar
    if (!payload.nombre_completo || !payload.dni ||
        !payload.rango_etario_id || !payload.cobertura_id ||
        !payload.residencia_id || !payload.situacion_laboral_id ||
        !payload.urgencias || payload.urgencias.length === 0) {
      Logger.log('onFormSubmit: campos obligatorios faltantes: ' + JSON.stringify(payload));
      return;
    }

    const result = sendToSupabase(payload);

    if (result.success) {
      Logger.log('onFormSubmit: registro creado → ' + result.id);
    } else {
      Logger.log('onFormSubmit: error → ' + result.error);
    }

  } catch (err) {
    Logger.log('onFormSubmit: excepción → ' + err.toString());
  }
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function safeString(val) {
  if (!val) return '';
  return val.toString().trim();
}

function lookupId(map, value) {
  if (!value) return null;
  const key = value.toString().trim();
  return map[key] || null;
}

function parseMultipleChoice(map, value) {
  if (!value) return [];
  return value.toString()
    .split(',')
    .map(function(s) { return s.trim(); })
    .filter(function(s) { return s.length > 0; })
    .map(function(s) { return map[s]; })
    .filter(function(id) { return id !== null && id !== undefined; });
}

function sendToSupabase(payload) {
  var url = SUPABASE_URL + '/rest/v1/rpc/encuesta__create_registro';

  var response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  var statusCode = response.getResponseCode();

  if (statusCode >= 200 && statusCode < 300) {
    return {
      success: true,
      id: response.getContentText(),
    };
  } else {
    return {
      success: false,
      error: 'HTTP ' + statusCode + ': ' + response.getContentText(),
    };
  }
}

// ============================================================================
// FUNCIÓN DE PRUEBA (ejecutar manualmente desde el editor para verificar)
// ============================================================================

function testSendToSupabase() {
  var testPayload = {
    nombre_completo: 'Test Usuario',
    dni: '99999999',
    rango_etario_id: 3,
    cobertura_id: 1,
    residencia_id: 1,
    situacion_laboral_id: 2,
    impedimentos: [1, 3],
    urgencias: [1, 2],
  };

  var result = sendToSupabase(testPayload);
  Logger.log('testSendToSupabase: ' + JSON.stringify(result));
}
