-- ============================================================================
-- 02_lookup_tables.sql
-- Tablas catálogo (opciones fijas del formulario)
-- ============================================================================

-- Rango etario
CREATE TABLE lookup.rango_etario (
    id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion TEXT NOT NULL,
    orden SMALLINT NOT NULL,
    UNIQUE (descripcion)
);

-- Cobertura médica
CREATE TABLE lookup.cobertura (
    id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion TEXT NOT NULL,
    orden SMALLINT NOT NULL,
    UNIQUE (descripcion)
);

-- Residencia / procedencia
CREATE TABLE lookup.residencia (
    id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion TEXT NOT NULL,
    orden SMALLINT NOT NULL,
    UNIQUE (descripcion)
);

-- Situación laboral
CREATE TABLE lookup.situacion_laboral (
    id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion TEXT NOT NULL,
    orden SMALLINT NOT NULL,
    UNIQUE (descripcion)
);

-- Impedimentos (opción múltiple)
CREATE TABLE lookup.impedimentos (
    id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion TEXT NOT NULL,
    orden SMALLINT NOT NULL,
    UNIQUE (descripcion)
);

-- Urgencias de gobierno (opción múltiple, máx 3)
CREATE TABLE lookup.urgencias_gobierno (
    id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion TEXT NOT NULL,
    orden SMALLINT NOT NULL,
    UNIQUE (descripcion)
);
