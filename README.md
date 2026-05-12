<div align="center">

# Datos en Acción

### Dashboard de Monitoreo Sociolaboral en Tiempo Real

**Pipeline ETL Live · Visual Analytics · Segmentación Multidimensional**

![React](https://img.shields.io/badge/React-18-087ea4?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3fcf8e?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-2-ff6b6b?style=flat-square)

</div>

---

## Resumen Ejecutivo

Datos en Acción es un **sistema de captura, procesamiento y visualización en vivo** de datos de encuesta sociolaboral. Diseñado para la **gestión pública basada en evidencia**, convierte respuestas de formulario en un tablero analítico interactivo con actualización cada **10 segundos** — sin recarga manual, sin intervención técnica.

El pipeline completo (Formulario → Base de Datos → Dashboard) opera bajo un principio de **seguridad por diseño**: sin SQL embebido en el frontend, todo el acceso a datos canalizado mediante **stored procedures** (RPCs) con `SECURITY DEFINER`.

> **Propósito**: Dotar a equipos de gestión de una herramienta de **Business Intelligence en tiempo real** para el monitoreo continuo de indicadores sociolaborales en territorio.

---

## Capacidades Analíticas

### ⚡ Live ETL Pipeline
Los datos fluyen desde el formulario hasta las visualizaciones en menos de **10 segundos** mediante polling reactivo. Sin procesos batch, sin latencia.

### 🔍 Visual Analytics Layer
**8 visualizaciones interactivas** sobre Recharts con tooltips, rankings, y detección automática de patrones predominantes (superlativo al 25%).

### 🎯 Segmentación en Vivo
Filtros combinables multi-dimensión: situación laboral, residencia, cobertura médica, rango etario, localidad, rango horario + búsqueda textual.

### 📊 Dual View Mode
- **Vista Pública**: 3 KPIs estratégicos + 3 gráficos de alto nivel
- **Vista Interna**: Dashboard completo con 8 gráficos, tabla de registros, exportación y filtros

### 🖥️ Presentation Mode
Pantalla completa optimizada para **reporting en vivo** en reuniones directivas. Toggle entre vista pública e interna sin salir de la proyección.

### 🔒 Data Governance
- DNI enmascarado automáticamente
- Row Level Security en base de datos
- Sin credenciales en frontend (solo anon key via Supabase)
- Todo acceso canalizado vía RPCs

### 📥 Exportación Analítica
Descarga CSV con dos modos: **registros filtrados** (con datos enmascarados) y **resumen estadístico** con métricas agregadas.

### ⚠️ Alertas Inteligentes
Detección automática de patrones: cobertura baja (< 40%), impedimentos predominantes (> 50%), basada en umbrales configurables.

---

## Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Frontend | React 18 + TypeScript | UI reactiva, tipado estático |
| Build | Vite 5 | Dev server + build optimizado |
| Estilos | Tailwind CSS 3 | Utility-first, responsive |
| Visualización | Recharts 2 | 8 tipos de gráficos interactivos |
| Animación | Framer Motion 11 | Transiciones fluidas |
| Backend | Supabase (PostgreSQL) | Base de datos+API+RPC |
| DB Schema | 3 schemas (lookup, encuesta, rel) | Datos normalizados + catálogos |
| Iconos | Lucide React | Sistema de iconos unificado |

---

## Arquitectura del Pipeline

```
Google Forms / API
       ↓
   Supabase PostgreSQL
   ├── lookup schema (catálogos)
   ├── encuesta.registros (datos maestros)
   ├── rel.* (relaciones M:N)
   └── RPCs (stored procedures)
       ↓
   supabaseService.ts (capa única de acceso)
       ↓
   useSupabaseData hook (polling cada 10s)
       ↓
   DataContext (estado global + filtros)
       ↓
   Dashboard React (3 modos de visualización)
```

**Principios**:
- **Sin SQL embebido**: todo el acceso a datos via `schema.rpc()` 
- **SECURITY DEFINER**: los procedures corren con permisos elevados, el frontend con el mínimo necesario
- **Snapshots aislados**: todas las lecturas son `STABLE`, sin bloqueos

---

## Quick Start

```bash
git clone <repo-url>
cd datos-en-accion
npm install
cp .env.example .env.local  # configurar credenciales Supabase
npm run dev                  # → http://localhost:5173
```

Sin configuración de Supabase, reemplazar por variables en `.env.local`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_INTERNAL_PASSWORD=clave_interna     # opcional
VITE_REFRESH_INTERVAL=10000              # default 10s
```

---

## Modos de Visualización

### 👁️ Vista Pública (default)
Tres indicadores estratégicos + tres gráficos: situación laboral, impedimentos y urgencias de gobierno. Ideal para **pantallas en espacios compartidos** o vistas ejecutivas rápidas.

### 🔐 Vista Interna
Dashboard completo habilitado por password: 8 gráficos, tabla con todos los registros, filtros combinables, búsqueda y exportación analítica.

### 🖥️ Modo Presentación
Pantalla completa para proyector. Incluye layout de 3 columnas por eje temático (Social / Económica / Política) + toggle interno.

---

## Visualizaciones Incluidas

| Visualización | Tipo | Insight Clave |
|--------------|------|---------------|
| Situación Laboral | Donut con etiquetas | Predominancia (umbral 25%) |
| Impedimentos Fin de Mes | Barras horizontales | Ranking + umbral superlativo |
| Urgencias Gobierno | Ranking con barras | Top 3 + scores |
| Evolución Horaria | Área con línea de ahora | Pico horario + tendencia |
| Rango Etario | Barras agrupadas | Distribución demográfica |
| Distribución por Edad | Barras secuenciales | Pirámide de edades |
| Residencia | Donut segmentado | CABA / Conurbano / Otras provincias |
| Cobertura Médica | Donut con colores | % sin cobertura |

---

## Casos de Uso

- **📋 Monitoreo de Gestión**: seguimiento continuo de indicadores sociolaborales durante operativos territoriales
- **📊 Reporting en Vivo**: proyección en reuniones directivas con datos actualizados al minuto
- **🔍 Análisis de Políticas Públicas**: segmentación de población por dimensión (laboral, cobertura, residencia, etaria) para detección de patrones y brechas
- **📈 Evaluación de Impacto**: línea de base temporal con evolución horaria y alertas automáticas de indicadores críticos
- **📁 Data Audit Trail**: exportación de registros para análisis externo con herramientas de BI

---

## Contexto del Proyecto

Desarrollado para la **Secretaría de Bienestar — Universidad de Buenos Aires**. Encuesta continua de caracterización sociolaboral aplicada durante operativos territoriales. Más de 90 registros de prueba incluidos para demostración sin conexión a base de datos.

---

## Licencia

Uso interno — Universidad de Buenos Aires.
