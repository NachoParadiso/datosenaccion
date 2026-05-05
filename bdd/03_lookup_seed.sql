-- ============================================================================
-- 03_lookup_seed.sql
-- Data semilla de las tablas catálogo
-- Valores exactos del formulario UBA en Acción
-- ============================================================================

INSERT INTO lookup.rango_etario (descripcion, orden) VALUES
    ('Menos de 18 años', 1),
    ('18 a 24 años', 2),
    ('25 a 34 años', 3),
    ('35 a 44 años', 4),
    ('45 a 54 años', 5),
    ('55 a 64 años', 6),
    ('65 años o más', 7);

INSERT INTO lookup.cobertura (descripcion, orden) VALUES
    ('Obra social', 1),
    ('Prepaga', 2),
    ('PAMI', 3),
    ('Solo salud pública / no tengo cobertura', 4),
    ('Otro', 5);

INSERT INTO lookup.residencia (descripcion, orden) VALUES
    ('Ciudad Autónoma de Buenos Aires', 1),
    ('Conurbano Bonaerense', 2),
    ('Otra provincia', 3);

INSERT INTO lookup.situacion_laboral (descripcion, orden) VALUES
    ('Empleado/a en relación de dependencia', 1),
    ('Trabajo informal / en negro', 2),
    ('Monotributista / autónomo', 3),
    ('Desempleado/a (busco trabajo)', 4),
    ('No trabajo ni busco trabajo', 5);

INSERT INTO lookup.impedimentos (descripcion, orden) VALUES
    ('Supermercado', 1),
    ('El alquiler', 2),
    ('Los servicios (luz, gas, agua)', 3),
    ('El transporte', 4),
    ('La salud y medicamentos', 5),
    ('La educación / útiles', 6),
    ('Las deudas o créditos', 7),
    ('Llego a fin de mes sin problemas', 8);

INSERT INTO lookup.urgencias_gobierno (descripcion, orden) VALUES
    ('Inflación y costo de vida', 1),
    ('Empleo y salarios', 2),
    ('Salud pública', 3),
    ('Seguridad', 4),
    ('Educación', 5),
    ('Vivienda', 6),
    ('Jubilaciones y pensiones', 7),
    ('Corrupción e instituciones', 8),
    ('Pobreza e indigencia', 9);
