-- ============================================================================
-- 06_procedures.sql
-- Procedimientos almacenados para la capa de abstracción SQL
-- El frontend solo llama a RPCs, nunca hace SQL embebido
--
-- ACID:
--   Atomicity   : Cada función es una transacción única. Si falla algo,
--                 rollback automático de todos los cambios.
--   Consistency : FKs, UNIQUEs y CHECKs validan la integridad antes del commit.
--   Isolation   : Las escrituras usan serialización implícita de PostgreSQL.
--                 Los reads usan snapshot isolation (STABLE).
--   Durability  : Al retornar exitosamente, la transacción se hace COMMIT.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- create_registro
-- Inserta un registro completo + sus relaciones de impedimentos y urgencias
-- Recibe un JSONB con la estructura del formulario
-- ATÓMICO: si falla cualquier INSERT, rollback total automático
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION encuesta.create_registro(p_data JSONB)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_registro_id UUID;
    v_impedimentos JSONB;
    v_urgencias JSONB;
    v_nombre TEXT;
    v_dni TEXT;
    v_rango_etario_id SMALLINT;
    v_cobertura_id SMALLINT;
    v_residencia_id SMALLINT;
    v_situacion_laboral_id SMALLINT;
    v_impedimento JSONB;
BEGIN
    -- ============================================================
    -- 1. VALIDACIÓN DE ENTRADA (antes de cualquier write)
    -- ============================================================

    v_nombre := NULLIF(TRIM(p_data->>'nombre_completo'), '');
    v_dni := NULLIF(TRIM(p_data->>'dni'), '');
    v_rango_etario_id := (p_data->>'rango_etario_id')::SMALLINT;
    v_cobertura_id := (p_data->>'cobertura_id')::SMALLINT;
    v_residencia_id := (p_data->>'residencia_id')::SMALLINT;
    v_situacion_laboral_id := (p_data->>'situacion_laboral_id')::SMALLINT;

    v_impedimentos := p_data->'impedimentos';
    v_urgencias := p_data->'urgencias';

    -- Validar campos obligatorios
    IF v_nombre IS NULL THEN
        RAISE EXCEPTION 'campo_obligatorio: nombre_completo';
    END IF;

    IF v_dni IS NULL THEN
        RAISE EXCEPTION 'campo_obligatorio: dni';
    END IF;

    IF v_rango_etario_id IS NULL THEN
        RAISE EXCEPTION 'campo_obligatorio: rango_etario_id';
    END IF;

    IF v_cobertura_id IS NULL THEN
        RAISE EXCEPTION 'campo_obligatorio: cobertura_id';
    END IF;

    IF v_residencia_id IS NULL THEN
        RAISE EXCEPTION 'campo_obligatorio: residencia_id';
    END IF;

    IF v_situacion_laboral_id IS NULL THEN
        RAISE EXCEPTION 'campo_obligatorio: situacion_laboral_id';
    END IF;

    -- Validar que los catálogos existen (consistencia FK anticipada)
    IF NOT EXISTS (SELECT 1 FROM lookup.rango_etario WHERE id = v_rango_etario_id) THEN
        RAISE EXCEPTION 'rango_etario_id_invalido: %', v_rango_etario_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM lookup.cobertura WHERE id = v_cobertura_id) THEN
        RAISE EXCEPTION 'cobertura_id_invalido: %', v_cobertura_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM lookup.residencia WHERE id = v_residencia_id) THEN
        RAISE EXCEPTION 'residencia_id_invalido: %', v_residencia_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM lookup.situacion_laboral WHERE id = v_situacion_laboral_id) THEN
        RAISE EXCEPTION 'situacion_laboral_id_invalido: %', v_situacion_laboral_id;
    END IF;

    -- Validar impedimentos si vienen
    IF v_impedimentos IS NOT NULL AND jsonb_typeof(v_impedimentos) = 'array' AND jsonb_array_length(v_impedimentos) > 0 THEN
        FOR v_impedimento IN SELECT * FROM jsonb_array_elements(v_impedimentos) LOOP
            IF NOT EXISTS (SELECT 1 FROM lookup.impedimentos WHERE id = v_impedimento::SMALLINT) THEN
                RAISE EXCEPTION 'impedimento_id_invalido: %', v_impedimento;
            END IF;
        END LOOP;
    END IF;

    -- Validar urgencias: no null, array, máx 3
    IF v_urgencias IS NULL OR jsonb_typeof(v_urgencias) != 'array' THEN
        RAISE EXCEPTION 'urgencias_debe_ser_array';
    END IF;

    IF jsonb_array_length(v_urgencias) = 0 THEN
        RAISE EXCEPTION 'urgencias_vacio: debe seleccionar al menos 1';
    END IF;

    IF jsonb_array_length(v_urgencias) > 3 THEN
        RAISE EXCEPTION 'urgencias_maximo_3: recibió %', jsonb_array_length(v_urgencias);
    END IF;

    -- Validar que cada urgencia existe
    FOR v_impedimento IN SELECT * FROM jsonb_array_elements(v_urgencias) LOOP
        IF NOT EXISTS (SELECT 1 FROM lookup.urgencias_gobierno WHERE id = v_impedimento::SMALLINT) THEN
            RAISE EXCEPTION 'urgencia_id_invalido: %', v_impedimento;
        END IF;
    END LOOP;

    -- ============================================================
    -- 2. INSERTS (transacción atómica: si algo falla, rollback total)
    -- ============================================================

    -- Insertar registro principal
    INSERT INTO encuesta.registros (
        nombre_completo,
        dni,
        rango_etario_id,
        cobertura_id,
        residencia_id,
        situacion_laboral_id
    ) VALUES (
        v_nombre,
        v_dni,
        v_rango_etario_id,
        v_cobertura_id,
        v_residencia_id,
        v_situacion_laboral_id
    ) RETURNING id INTO v_registro_id;

    -- Insertar impedimentos (si aplica)
    IF v_impedimentos IS NOT NULL AND jsonb_array_length(v_impedimentos) > 0 THEN
        INSERT INTO rel.registro_impedimentos (registro_id, impedimento_id)
        SELECT
            v_registro_id,
            imp.value::SMALLINT
        FROM jsonb_array_elements(v_impedimentos) AS imp(value);
    END IF;

    -- Insertar urgencias
    INSERT INTO rel.registro_urgencias (registro_id, urgencia_id)
    SELECT
        v_registro_id,
        urg.value::SMALLINT
    FROM jsonb_array_elements(v_urgencias) AS urg(value);

    -- Si llegamos acá, COMMIT automático al salir de la función
    RETURN v_registro_id;

EXCEPTION
    WHEN unique_violation THEN
        -- Rollback automático. Re-lanzar error descriptivo.
        IF SQLSTATE = '23505' AND SQLERRM LIKE '%unique_dni%' THEN
            RAISE EXCEPTION 'dni_duplicado: ya existe un registro con DNI %', v_dni;
        ELSE
            RAISE EXCEPTION 'violacion_unicidad: %', SQLERRM;
        END IF;
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'clave_foranea_invalida: %', SQLERRM;
    WHEN check_violation THEN
        RAISE EXCEPTION 'validacion_fallida: %', SQLERRM;
    WHEN OTHERS THEN
        -- Rollback automático de todo lo insertado en esta transacción
        RAISE;
END;
$$;

-- ---------------------------------------------------------------------------
-- get_registros
-- Retorna todos los registros aplanados con sus relaciones para el dashboard
-- STABLE: solo lectura, snapshot isolation, sin efectos colaterales
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION encuesta.get_registros()
RETURNS TABLE (
    id UUID,
    marca_temporal TIMESTAMPTZ,
    nombre_completo TEXT,
    dni TEXT,
    rango_etario TEXT,
    cobertura TEXT,
    residencia TEXT,
    situacion_laboral TEXT,
    impedimentos TEXT[],
    urgencias TEXT[]
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,
        r.marca_temporal,
        r.nombre_completo,
        r.dni,
        re.descripcion,
        co.descripcion,
        re2.descripcion,
        sl.descripcion,
        COALESCE(ARRAY_AGG(DISTINCT i.descripcion) FILTER (WHERE i.descripcion IS NOT NULL), '{}'),
        COALESCE(ARRAY_AGG(DISTINCT u.descripcion) FILTER (WHERE u.descripcion IS NOT NULL), '{}')
    FROM encuesta.registros r
    JOIN lookup.rango_etario re ON re.id = r.rango_etario_id
    JOIN lookup.cobertura co ON co.id = r.cobertura_id
    JOIN lookup.residencia re2 ON re2.id = r.residencia_id
    JOIN lookup.situacion_laboral sl ON sl.id = r.situacion_laboral_id
    LEFT JOIN rel.registro_impedimentos ri ON ri.registro_id = r.id
    LEFT JOIN lookup.impedimentos i ON i.id = ri.impedimento_id
    LEFT JOIN rel.registro_urgencias ru ON ru.registro_id = r.id
    LEFT JOIN lookup.urgencias_gobierno u ON u.id = ru.urgencia_id
    GROUP BY
        r.id, re.descripcion, co.descripcion,
        re2.descripcion, sl.descripcion;
END;
$$;

-- ---------------------------------------------------------------------------
-- get_registro_ultimo
-- Retorna el último registro insertado con todas sus relaciones
-- STABLE: solo lectura
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION encuesta.get_registro_ultimo()
RETURNS TABLE (
    id UUID,
    marca_temporal TIMESTAMPTZ,
    nombre_completo TEXT,
    dni TEXT,
    rango_etario TEXT,
    cobertura TEXT,
    residencia TEXT,
    situacion_laboral TEXT,
    impedimentos TEXT[],
    urgencias TEXT[]
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM encuesta.get_registros()
    ORDER BY marca_temporal DESC
    LIMIT 1;
END;
$$;

-- ---------------------------------------------------------------------------
-- get_catalogos
-- Retorna todos los catálogos con sus opciones ordenadas
-- STABLE: solo lectura
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION encuesta.get_catalogos()
RETURNS TABLE (
    catalogo TEXT,
    id SMALLINT,
    descripcion TEXT,
    orden SMALLINT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY SELECT 'rango_etario', id, descripcion, orden FROM lookup.rango_etario ORDER BY orden;
    RETURN QUERY SELECT 'cobertura', id, descripcion, orden FROM lookup.cobertura ORDER BY orden;
    RETURN QUERY SELECT 'residencia', id, descripcion, orden FROM lookup.residencia ORDER BY orden;
    RETURN QUERY SELECT 'situacion_laboral', id, descripcion, orden FROM lookup.situacion_laboral ORDER BY orden;
    RETURN QUERY SELECT 'impedimentos', id, descripcion, orden FROM lookup.impedimentos ORDER BY orden;
    RETURN QUERY SELECT 'urgencias_gobierno', id, descripcion, orden FROM lookup.urgencias_gobierno ORDER BY orden;
END;
$$;

-- ---------------------------------------------------------------------------
-- get_stats
-- Retorna estadísticas básicas para el dashboard en formato JSONB
-- STABLE: solo lectura, snapshot isolation
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION encuesta.get_stats()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_total INT;
    v_stats JSONB;
BEGIN
    SELECT COUNT(*) INTO v_total FROM encuesta.registros;

    v_stats := jsonb_build_object(
        'total_registros', v_total,
        'por_rango_etario', (
            SELECT jsonb_agg(jsonb_build_object('categoria', re.descripcion, 'cantidad', cnt))
            FROM (
                SELECT re2.descripcion, COUNT(r.id) AS cnt
                FROM lookup.rango_etario re2
                LEFT JOIN encuesta.registros r ON r.rango_etario_id = re2.id
                GROUP BY re2.id, re2.descripcion
                ORDER BY re2.orden
            ) re
        ),
        'por_cobertura', (
            SELECT jsonb_agg(jsonb_build_object('categoria', co.descripcion, 'cantidad', cnt))
            FROM (
                SELECT co2.descripcion, COUNT(r.id) AS cnt
                FROM lookup.cobertura co2
                LEFT JOIN encuesta.registros r ON r.cobertura_id = co2.id
                GROUP BY co2.id, co2.descripcion
                ORDER BY co2.orden
            ) co
        ),
        'por_residencia', (
            SELECT jsonb_agg(jsonb_build_object('categoria', re.descripcion, 'cantidad', cnt))
            FROM (
                SELECT re2.descripcion, COUNT(r.id) AS cnt
                FROM lookup.residencia re2
                LEFT JOIN encuesta.registros r ON r.residencia_id = re2.id
                GROUP BY re2.id, re2.descripcion
                ORDER BY re2.orden
            ) re
        ),
        'por_situacion_laboral', (
            SELECT jsonb_agg(jsonb_build_object('categoria', sl.descripcion, 'cantidad', cnt))
            FROM (
                SELECT sl2.descripcion, COUNT(r.id) AS cnt
                FROM lookup.situacion_laboral sl2
                LEFT JOIN encuesta.registros r ON r.situacion_laboral_id = sl2.id
                GROUP BY sl2.id, sl2.descripcion
                ORDER BY sl2.orden
            ) sl
        ),
        'top_impedimentos', (
            SELECT jsonb_agg(jsonb_build_object('impedimento', i.descripcion, 'cantidad', cnt))
            FROM (
                SELECT i2.descripcion, COUNT(*) AS cnt
                FROM rel.registro_impedimentos ri
                JOIN lookup.impedimentos i2 ON i2.id = ri.impedimento_id
                GROUP BY i2.id, i2.descripcion
                ORDER BY cnt DESC
            ) i
        ),
        'top_urgencias', (
            SELECT jsonb_agg(jsonb_build_object('urgencia', u.descripcion, 'cantidad', cnt))
            FROM (
                SELECT u2.descripcion, COUNT(*) AS cnt
                FROM rel.registro_urgencias ru
                JOIN lookup.urgencias_gobierno u2 ON u2.id = ru.urgencia_id
                GROUP BY u2.id, u2.descripcion
                ORDER BY cnt DESC
            ) u
        )
    );

    RETURN v_stats;
END;
$$;

-- ---------------------------------------------------------------------------
-- delete_registro
-- Elimina un registro y sus relaciones (CASCADE por ON DELETE en las FKs)
-- ATÓMICO: si falla, rollback total
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION encuesta.delete_registro(p_registro_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Validar que existe
    IF NOT EXISTS (SELECT 1 FROM encuesta.registros WHERE id = p_registro_id) THEN
        RAISE EXCEPTION 'registro_no_encontrado: %', p_registro_id;
    END IF;

    DELETE FROM encuesta.registros WHERE id = p_registro_id;

EXCEPTION
    WHEN OTHERS THEN
        -- Rollback automático
        RAISE EXCEPTION 'error_al_eliminar: %', SQLERRM;
END;
$$;
