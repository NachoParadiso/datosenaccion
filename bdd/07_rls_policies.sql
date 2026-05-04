-- ============================================================================
-- 07_rls_policies.sql
-- Row Level Security policies
-- El anon user solo puede leer via procedures (SECURITY DEFINER)
-- Las escrituras se hacen solo via procedures con SECURITY DEFINER
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE encuesta.registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE rel.registro_impedimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE rel.registro_urgencias ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura (anon puede leer todo)
CREATE POLICY "anon puede leer registros"
    ON encuesta.registros
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "anon puede leer registro_impedimentos"
    ON rel.registro_impedimentos
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "anon puede leer registro_urgencias"
    ON rel.registro_urgencias
    FOR SELECT
    TO anon
    USING (true);

-- Políticas para catálogos (solo lectura, para todos)
ALTER TABLE lookup.rango_etario ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookup.cobertura ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookup.residencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookup.situacion_laboral ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookup.impedimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookup.urgencias_gobierno ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon puede leer catálogos"
    ON lookup.rango_etario FOR SELECT TO anon USING (true);
CREATE POLICY "anon puede leer catálogos"
    ON lookup.cobertura FOR SELECT TO anon USING (true);
CREATE POLICY "anon puede leer catálogos"
    ON lookup.residencia FOR SELECT TO anon USING (true);
CREATE POLICY "anon puede leer catálogos"
    ON lookup.situacion_laboral FOR SELECT TO anon USING (true);
CREATE POLICY "anon puede leer catálogos"
    ON lookup.impedimentos FOR SELECT TO anon USING (true);
CREATE POLICY "anon puede leer catálogos"
    ON lookup.urgencias_gobierno FOR SELECT TO anon USING (true);
