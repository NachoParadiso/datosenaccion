-- ============================================================================
-- 05_relaciones.sql
-- Tablas puente para opciones múltiples
-- ============================================================================

-- Impedimentos (muchos a muchos)
CREATE TABLE rel.registro_impedimentos (
    registro_id UUID NOT NULL REFERENCES encuesta.registros(id) ON DELETE CASCADE,
    impedimento_id SMALLINT NOT NULL REFERENCES lookup.impedimentos(id),

    PRIMARY KEY (registro_id, impedimento_id)
);

-- Urgencias de gobierno (muchos a muchos, máx 3 por registro)
CREATE TABLE rel.registro_urgencias (
    registro_id UUID NOT NULL REFERENCES encuesta.registros(id) ON DELETE CASCADE,
    urgencia_id SMALLINT NOT NULL REFERENCES lookup.urgencias_gobierno(id),

    PRIMARY KEY (registro_id, urgencia_id)
);
