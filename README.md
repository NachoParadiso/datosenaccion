# UBA en Acción — Dashboard en vivo

Dashboard web para monitorear en tiempo real el operativo UBA en Acción, conectado a Google Forms → Google Sheets.

---

## Cómo correrlo

```bash
cd uba-en-accion-dashboard
npm install
npm run dev
# Abrí: http://localhost:5173
```

Sin configurar la URL de Google Sheets, el dashboard funciona con **90 registros de prueba** automáticamente.

---

## Cómo conectar Google Forms + Google Sheets

### ESCENARIO A: Ya tenés un Google Forms armado

**Paso 1:** Abrí la Google Sheet que recibe las respuestas de tu formulario.

**Paso 2:** `Archivo → Compartir → Publicar en la web`

**Paso 3:** En el menú desplegable de hojas, seleccioná la hoja correcta (por defecto "Respuestas de formulario 1"). En formato, elegí **"Valores separados por comas (.csv)"**.

**Paso 4:** Hacé clic en **Publicar** y confirmá. Copiá la URL que aparece.

**Paso 5:** En el dashboard, hacé clic en el ícono ⚙ del header → pegá la URL → "Guardar y conectar".

O alternativamente, creá un archivo `.env.local` en la raíz del proyecto:
```bash
VITE_GOOGLE_SHEETS_CSV_URL=https://docs.google.com/spreadsheets/d/TU_ID/pub?output=csv
```

---

### ESCENARIO B: Todavía no tenés el Google Forms

**Estructura recomendada del formulario:**

| # | Campo | Tipo | Obligatorio |
|---|-------|------|-------------|
| 1 | Nombre completo | Respuesta corta | Sí |
| 2 | DNI | Respuesta corta (validar: número, 7-8 dígitos) | Sí |
| 3 | Teléfono | Respuesta corta | Sí (aclarar: "sin teléfono" si no tiene) |
| 4 | Procedencia | Opción múltiple: CABA / Provincia de Buenos Aires / Otra provincia / Otro país | Sí |
| 5 | Localidad / barrio | Respuesta corta | Sí |
| 6 | ¿Está en situación de calle? | Opción múltiple: Sí / No / Prefiere no responder | Sí |
| 7 | Especialidad | Lista desplegable: Odontología / Clínica médica / Pediatría / Ginecología / Salud mental / Enfermería / Oftalmología / Nutrición / Trabajo social / Vacunación / Otra | Sí |
| 8 | Motivo de consulta breve | Párrafo | No |
| 9 | Edad | Respuesta corta (validar: número) | Sí |
| 10 | Género | Opción múltiple: Femenino / Masculino / No binario / Prefiere no responder / Otro | No |
| 11 | ¿Tiene cobertura médica / obra social? | Opción múltiple: Sí / No / No sabe / no responde | No |
| 12 | ¿Atendido previamente por UBA en Acción? | Opción múltiple: Sí / No / No sabe | No |
| 13 | Observaciones internas | Párrafo | No |

**Para vincular el formulario a Google Sheets:**
1. En Google Forms → ícono de hoja de cálculo (Respuestas → Ver en Sheets)
2. Esto crea automáticamente una Sheet con todas las columnas
3. Seguí los pasos del Escenario A para publicarla como CSV

---

## Archivo de configuración

```bash
# .env.local  (crearlo en la raíz del proyecto)
VITE_GOOGLE_SHEETS_CSV_URL=https://docs.google.com/spreadsheets/d/TU_ID/pub?output=csv
VITE_REFRESH_INTERVAL=10000   # milisegundos (default: 10 segundos)
```

---

## Estructura del proyecto

```
src/
├── components/
│   ├── layout/       Header.tsx
│   ├── common/       LastUpdateBadge, AlertBanner, ConfigModal
│   ├── cards/        StatCard, StatsCards
│   ├── charts/       Specialty, TimeSeries, Origin, StreetSituation,
│   │                 AgeDistribution, Coverage, Gender, Neighborhood
│   ├── filters/      FiltersBar (búsqueda + filtros combinables)
│   ├── table/        RecordsTable (con modal de detalle)
│   ├── specialty/    SpecialtyDetail (vista de detalle por especialidad)
│   └── presentation/ PresentationMode (pantalla grande / proyector)
├── pages/            DashboardHome
├── context/          DataContext (estado global + filtros)
├── hooks/            useSheetData (fetch CSV + polling)
├── utils/            normalize, statistics, csvParser, export
├── data/             mockData (90 registros de prueba)
└── types/            index.ts
```

---

## Funcionalidades incluidas

- **Dashboard en vivo** con 7 KPI cards y auto-refresh configurable
- **8 gráficos**: barras, área, torta, dona, barras horizontales
- **Vista detallada por especialidad** — clic en cualquier barra del gráfico
- **Filtros combinables**: especialidad, procedencia, situación de calle, cobertura, género, localidad, rango horario
- **Buscador** por nombre, DNI, teléfono, localidad, especialidad
- **Tabla de registros** con DNI enmascarado y modal de detalle completo
- **Alertas automáticas**: alta demanda y situación de calle
- **Modo presentación** — pantalla completa para proyectar (ESC para salir)
- **Exportación**: CSV de registros filtrados + CSV de resumen estadístico
- **Datos de prueba**: 90 registros realistas cuando no hay URL configurada
- **Animaciones** con Framer Motion en toda la UI
- **Responsive**: celular, tablet, notebook, pantalla grande
- **Modal de configuración** para cambiar la URL sin tocar código

---

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo → http://localhost:5173 |
| `npm run build` | Compilar para producción (genera /dist) |
| `npm run preview` | Preview del build de producción |

---

## Mejoras futuras posibles

- Login con Google para proteger el acceso
- Descarga de imagen del dashboard (html2canvas)
- Exportación a Excel con múltiples hojas
- Modo oscuro
- Backend Node/Express con Google Sheets API v4 para mayor seguridad
- Notificaciones push cuando hay alta demanda
- Comparación entre franjas horarias
