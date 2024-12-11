CREATE VIEW horarios_disponibles AS
WITH
    horarios_ocupados AS (
        -- Horarios ocupados por profesores
        SELECT hp.idlaboratorio, hp.hora_inicio, hp.hora_cierre, hp.fecha AS fecha
        FROM horario_profesores hp
        UNION
        -- Horarios con préstamos aceptados
        SELECT p.idlaboratorio, p.hora_inicio, p.hora_cierre, DATE(p.fecha) AS fecha -- Aquí tomamos la fecha específica del préstamo
        FROM prestamo p
        WHERE
            p.estado = 'A'
    ),
    horarios_totales AS (
        -- Todos los horarios de laboratorios (aquí puedes definir los días de la semana que aplica)
        SELECT hs.idlaboratorio, hs.hora_inicio, hs.hora_cierre, hs.fecha -- Aquí también tomamos la fecha específica
        FROM horario_servicio hs
    )
    -- Seleccionar horarios disponibles
SELECT ht.idlaboratorio, ht.hora_inicio, ht.hora_cierre, ht.fecha -- Mostrar la fecha
FROM horarios_totales ht
WHERE
    NOT EXISTS (
        SELECT 1
        FROM horarios_ocupados ho
        WHERE
            ho.idlaboratorio = ht.idlaboratorio
            -- Comparar la fecha exacta, no solo el día de la semana
            AND ho.fecha = ht.fecha
            -- Verificar superposición de horarios
            AND NOT(
                ht.hora_cierre <= ho.hora_inicio
                OR ht.hora_inicio >= ho.hora_cierre
            )
    );