# Estado del Proyecto — Datos en Acción
## Actualización: 2026-05-03

### Equipo
- Nacho Santarelli (NachoParadiso en GitHub, owner del repo)
- David Gustavo Sánchez Cabral (DavidSanchezCab, dagustasanchezcabral@gmail.com)
- Nicolás Méndez

### Qué se hizo hasta ahora (03/05/2026)

1. **Clonado y branch creado**
   - Repo: https://github.com/NachoParadiso/datosenaccion
   - Branch: `feat/supabase-integration`
   - Push pendiente: Nacho debe agregar a David como collaborator

2. **Database Schema (bdd/)** — Listo para ejecutar cuando Nacho cree Supabase
   - `01_schemas.sql` → Schemas: `lookup`, `encuesta`, `rel`
   - `02_lookup_tables.sql` → 6 tablas catálogo (PK, descripcion, orden)
   - `03_lookup_seed.sql` → Data semilla exacta del formulario
   - `04_encuesta_registros.sql` → Tabla principal con FKs + UNIQUE dni
   - `05_relaciones.sql` → Tablas puente (impedimentos, urgencias)
   - `06_procedures.sql` → RPCs ACID: create_registro, get_registros, get_catalogos, get_stats, delete_registro
   - `07_rls_policies.sql` → Row Level Security policies

3. **Frontend scaffold**
   - `src/lib/supabaseClient.ts` → Singleton Supabase
   - `src/services/supabaseService.ts` → Capa de abstracción (solo RPCs, sin SQL embebido)
   - `src/hooks/useSupabaseData.ts` → Hook con polling + fallback mock
   - `.env.example` → Actualizado con vars de Supabase
   - `src/types/index.ts` → Agregados RegistroSupabase, FiltrosSupabase, EstadisticasSupabase

4. **Google Apps Script**
   - `apps-script/FormTrigger.gs` → Trigger onFormSubmit que envía a Supabase RPC
   - Tiene mapeo de valores del formulario a IDs de catálogos
   - Incluye función de test (`testSendToSupabase`)

5. **README** → Actualizado con documentación completa de setup

### Pendiente para completar
- Nacho crea proyecto Supabase → pasa URL + anon key + service_role key
- Nacho agrega a David como collaborator del repo → hacer push
- Ejecutar SQL en Supabase (orden 01→07)
- Configurar .env.local con las keys
- Ajustar índices de columnas en Apps Script según formulario real
- Crear el Google Forms con la estructura definida
- Vincular Forms → Sheets → configurar Apps Script trigger

### Arquitectura
```
Google Forms → Google Sheets → Apps Script (onFormSubmit) → Supabase RPC → Dashboard React
```

### Lo que se puede avanzar HOY sin Supabase:
1. Armar el Google Forms
2. Preparar el Apps Script para que al menos guarde en Sheets
3. Adaptar los componentes del dashboard al nuevo esquema de datos
4. Actualizar types del frontend para coincidir con el nuevo formulario

---

## Resumen de Charts — Dashboard Secretaría de Bienestar
### Actualización: 2026-05-04

### 7 StatCards (KPIs rápidos)
Métricas de un vistazo para la Secretaría:
- **Total registros** → Personas encuestadas en total
- **Registros hoy** → Actividad del día en curso
- **Residencia top** → De dónde vienen la mayoría de encuestados (CABA, Conurbano, Otra provincia)
- **Sin cobertura médica** → % sin obra social/prepaga (crítico para políticas de salud pública)
- **Informal / desempleado** → Vulnerabilidad laboral
- **Situación laboral top** → Categoría laboral más frecuente
- **Top impedimento** → Mayor obstáculo para llegar a fin de mes

### 1. Situación Laboral — `SituacionLaboralChart` (Bar Chart)
- **Tipo**: Barras verticales con valores arriba de cada barra
- **Por qué**: Comparación directa de categorías laborales. Muestra informalidad y desempleo de un vistazo, datos clave para la Secretaría de Bienestar.

### 2. Evolución de Carga por Hora — `TimeSeriesChart` (Area Chart)
- **Tipo**: Área con gradiente, línea de "hora actual", badge de hora pico
- **Por qué**: Patrón temporal del operativo. Permite identificar horarios de mayor afluencia y planificar recursos humanos. La línea "Ahora" da contexto en tiempo real.

### 3. Residencia — `OriginChart` (Donut/Pie Chart)
- **Tipo**: Donut con porcentajes internos y leyenda
- **Por qué**: Distribución geográfica rápida. Permite ver si la mayoría viene de CABA, Conurbano u otras provincias. Útil para territorializar políticas.

### 4. Rango Etario — `RangoEtarioChart` (Bar Chart)
- **Tipo**: Barras verticales con 7 categorías de edad
- **Por qué**: Perfil demográfico del encuestado. Permite ver si predominan jóvenes, adultos o adultos mayores. Informa sobre qué tipo de servicios priorizar.

### 5. Cobertura Médica — `CoverageChart` (Bar Chart)
- **Tipo**: Barras verticales con colores semánticos (rojo para sin cobertura, verde para obra social)
- **Por qué**: Indicador de vulnerabilidad en salud. El color rojo llama la atención sobre quienes no tienen cobertura, dato crítico para la Secretaría.

### 6. Impedimentos para Fin de Mes — `ImpedimentosChart` (Horizontal Bar Chart)
- **Tipo**: Barras horizontales con valores a la derecha
- **Por qué**: Opción múltiple — un encuestado puede elegir varios. Las barras horizontales permiten leer etiquetas largas (ej: "La salud y medicamentos"). Muestra qué gastos son los más críticos para las familias.

### 7. Urgencias de Gobierno — `UrgenciasChart` (Horizontal Bar Chart)
- **Tipo**: Barras horizontales con valores a la derecha
- **Por qué**: Opción múltiple — hasta 3 por encuestado. Muestra qué problemas políticos/social preocupan más a la población encuestada. Data valiosa para la agenda de la Secretaría.

### RecordsTable — Tabla de Registros
- **Tipo**: Tabla expandible con búsqueda, ordenamiento y modal de detalle
- **Por qué**: Acceso granular a cada encuestado. DNI enmascarado por privacidad. Permite ver patrones individuales y detectar casos específicos.

### Charts removidos (del esquema anterior de salud):
- `SpecialtyChart` → Especialidades médicas (ya no aplica)
- `GenderChart` → Género (ya no aplica)
- `AgeDistributionChart` → Edad individual (reemplazado por RangoEtario)
- `NeighborhoodChart` → Barrio/localidad (reemplazado por Residencia)
- `StreetSituationChart` → Situación de calle (ya no se encuesta)

### Presentación
Modo fullscreen para proyectar/reuniones con los 4 big stats (total, sin cobertura, informal/desempleado, top impedimento) y los 6 charts distribuidos en 3 filas. Se sale con Esc o botón.
