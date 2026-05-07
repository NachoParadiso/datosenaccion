-- ============================================================================
-- 04_encuesta_registros.sql
-- Tabla principal de registros de encuesta
-- ============================================================================

CREATE TABLE encuesta.registros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marca_temporal TIMESTAMPTZ NOT NULL DEFAULT now(),
    nombre_completo TEXT NOT NULL,
    dni TEXT NOT NULL,
    rango_etario_id SMALLINT NOT NULL REFERENCES lookup.rango_etario(id),
    cobertura_id SMALLINT NOT NULL REFERENCES lookup.cobertura(id),
    residencia_id SMALLINT NOT NULL REFERENCES lookup.residencia(id),
    situacion_laboral_id SMALLINT NOT NULL REFERENCES lookup.situacion_laboral(id),

    CONSTRAINT unique_dni UNIQUE (dni)
);

-- Índice para búsqueda por dni
CREATE INDEX idx_registros_dni ON encuesta.registros (dni);

-- Índice para ordenamiento cronológico
CREATE INDEX idx_registros_marca_temporal ON encuesta.registros (marca_temporal DESC);

-- Trigger para actualizar marca_temporal en caso de updates
CREATE OR REPLACE FUNCTION encuesta.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.marca_temporal = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_timestamp
    BEFORE UPDATE ON encuesta.registros
    FOR EACH ROW
    EXECUTE FUNCTION encuesta.update_timestamp();
