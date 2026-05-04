# UBA en Acción — Dashboard en vivo

Dashboard web para monitorear en tiempo real el operativo UBA en Acción, con arquitectura:

```
Google Forms → Google Sheets → Google Apps Script → Supabase → Dashboard (React)
```

---

## Cómo correrlo

```bash
cd "datos en accion"
npm install
npm run dev
# Abrí: http://localhost:5173
```

Sin credenciales de Supabase configuradas, el dashboard funciona con **datos de prueba** automáticamente.

---

## Configuración del entorno

Copiá `.env.example` a `.env.local` y completá los valores:

```bash
# Supabase (obligatorio para producción)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_public_key

# Intervalo de actualización en ms (default: 10000)
VITE_REFRESH_INTERVAL=10000
```

---

## 1. Crear el proyecto en Supabase

1. Ir a https://supabase.com → New Project (plan gratuito)
2. Ir a **Settings → API** y copiar:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`
   - **service_role secret** → se usa en el Apps Script (nunca commitear)

## 2. Ejecutar el schema SQL

1. Abrir el **SQL Editor** en el dashboard de Supabase
2. Ejecutar los archivos de `bdd/` en orden:

```
bdd/01_schemas.sql
bdd/02_lookup_tables.sql
bdd/03_lookup_seed.sql
bdd/04_encuesta_registros.sql
bdd/05_relaciones.sql
bdd/06_procedures.sql
bdd/07_rls_policies.sql
```

Pegar el contenido de cada archivo y ejecutar. El orden es importante porque hay dependencias entre los scripts.

### Schema de la base de datos

```
Schemas:
  lookup/          → Tablas catálogo (opciones fijas del formulario)
    rango_etario
    cobertura
    residencia
    situacion_laboral
    impedimentos
    urgencias_gobierno

  encuesta/        → Datos principales
    registros      → Un registro por paciente

  rel/             → Tablas puente (muchos a muchos)
    registro_impedimentos
    registro_urgencias
```

### Procedures (RPCs)

El frontend **no hace SQL embebido**. Toda interacción con la base de datos es vía procedures:

| Procedure | Función |
|-----------|---------|
| `encuesta__create_registro` | Inserta registro + relaciones (transaccional ACID) |
| `encuesta__get_registros` | Retorna todos los registros aplanados |
| `encuesta__get_registro_ultimo` | Retorna el último registro |
| `encuesta__get_catalogos` | Retorna catálogos para filtros |
| `encuesta__get_stats` | Retorna estadísticas en JSONB |
| `encuesta__delete_registro` | Elimina un registro (CASCADE) |

---

## 3. Conectar Google Forms → Supabase vía Apps Script

### Paso A: Crear el Google Forms

Estructura del formulario:

| # | Pregunta | Tipo | Obligatoria |
|---|----------|------|-------------|
| 1 | Nombre completo | Respuesta corta | Sí |
| 2 | DNI | Respuesta corta (numérico) | Sí |
| 3 | Edad | Opción única (rangos) | Sí |
| 4 | ¿Tenés cobertura médica? | Opción única | Sí |
| 5 | ¿Dónde vivís? | Opción única | Sí |
| 6 | ¿Qué te impide llegar a fin de mes? | Opción múltiple (varias) | Sí |
| 7 | ¿Qué tema debería tratar el gobierno? | Opción múltiple (máx 3) | Sí |
| 8 | ¿Cuál es tu situación laboral? | Opción única | Sí |

### Paso B: Vincular Forms a Sheets

1. En Google Forms → pestaña **Respuestas** → ícono de hoja de cálculo
2. Se crea automáticamente una Google Sheet con las respuestas

### Paso C: Configurar el Apps Script

1. En la Google Sheet → **Extensiones → Apps Script**
2. Copiar el contenido de `apps-script/FormTrigger.gs`
3. Reemplazar `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` con tus valores
4. **Importante**: ajustar los índices de columnas (`colNombreCompleto`, `colDNI`, etc.) según el orden real de las columnas en la Sheet
5. Guardar el proyecto (Ctrl+S)
6. Crear el trigger: **Editar → Disparadores → Agregar**
   - Función: `onFormSubmit`
   - Fuente del evento: `De la hoja de cálculo`
   - Tipo: `Al enviarse`
7. Aceptar los permisos solicitados

### Paso D: Probar

1. Enviar una respuesta de prueba desde el formulario
2. En Apps Script → **Ejecuciones** → verificar que se ejecutó correctamente
3. O ejecutar `testSendToSupabase()` manualmente desde el editor

---

## Arquitectura del frontend

```
src/
├── lib/
│   └── supabaseClient.ts     # Singleton del cliente Supabase
├── services/
│   └── supabaseService.ts    # Capa de abstracción (solo RPCs, sin SQL)
├── hooks/
│   ├── useSheetData.ts       # Legacy: Google Sheets CSV polling
│   └── useSupabaseData.ts    # Nuevo: Supabase RPC polling
├── context/
│   └── DataContext.tsx       # Estado global + filtros
├── components/
│   ├── layout/               # Header
│   ├── common/               # LastUpdateBadge, AlertBanner, ConfigModal
│   ├── cards/                # StatCard, StatsCards
│   ├── charts/               # 8 gráficos (barras, área, torta, dona)
│   ├── filters/              # FiltersBar (búsqueda + filtros)
│   ├── table/                # RecordsTable
│   ├── specialty/            # SpecialtyDetail
│   └── presentation/         # Modo presentación (pantalla completa)
├── pages/
│   └── DashboardHome
├── utils/                    # normalize, statistics, csvParser, export
├── data/                     # mockData
└── types/                    # index.ts

bdd/                          # Schema SQL completo de Supabase
apps-script/                  # Google Apps Script (puente Forms → Supabase)
```

---

## Funcionalidades incluidas

- **Dashboard en vivo** con KPI cards y auto-refresh configurable
- **8 gráficos**: barras, área, torta, dona, barras horizontales
- **Filtros combinables** + buscador
- **Tabla de registros** con modal de detalle
- **Modo presentación** — pantalla completa para proyectar (ESC para salir)
- **Exportación** CSV de registros filtrados + resumen estadístico
- **Datos de prueba** cuando no hay credenciales configuradas
- **Animaciones** con Framer Motion
- **Responsive**: celular, tablet, notebook, pantalla grande

---

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo → http://localhost:5173 |
| `npm run build` | Compilar para producción (genera /dist) |
| `npm run preview` | Preview del build de producción |

---

## Notas de seguridad

- La `service_role` key **nunca** se commitea ni se expone en el frontend
- El frontend solo usa la `anon` key, con acceso limitado vía RLS policies
- Las procedures de escritura usan `SECURITY DEFINER` para ejecutarse con privilegios elevados
- Todos los datos se almacenan encriptados en reposo y en tránsito (Supabase)
