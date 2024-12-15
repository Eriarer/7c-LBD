DELIMITER;

l.idlaboratorio, ds.fecha;

DROP VIEW IF EXISTS resumen_prestamos_por_laboratorio;

CREATE VIEW resumen_prestamos_por_laboratorio AS
SELECT l.idlaboratorio, p.fecha, COUNT(p.idprestamo) AS total_prestamos
FROM prestamo p
    JOIN laboratorio l ON p.idlaboratorio = l.idlaboratorio
GROUP BY
    l.idlaboratorio,
    p.fecha
WITH
    ROLLUP
ORDER BY l.idlaboratorio ASC, p.fecha ASC;

DROP VIEW IF EXIST horas_ocupads;

DROP VIEW IF EXISTS horas_ocupadas;

CREATE VIEW horas_ocupadas AS
SELECT fecha, GROUP_CONCAT(
        DISTINCT DATE_FORMAT(horaInicio, '%H:%i') SEPARATOR ', '
    ) AS horas_ocupadas
FROM (
        -- Prestamos con estado 'A'
        SELECT fecha, horaInicio
        FROM prestamo
        WHERE
            estado = 'A'
        UNION ALL
        -- Horario de profesores: expandir por fecha y días aplicables
        SELECT ADDDATE(
                '2024-12-15', INTERVAL days.day_offset
            ) AS fecha, hora_inicio AS horaInicio
        FROM horario_profesoreses
            CROSS JOIN (
                -- Generar días relativos (día de la semana y desplazamiento desde la base)
                SELECT 0 AS day_offset, 'SA' AS day_name
                UNION ALL
                SELECT 1, 'LU'
                UNION ALL
                SELECT 2, 'MA'
                UNION ALL
                SELECT 3, 'MI'
                UNION ALL
                SELECT 4, 'JU'
                UNION ALL
                SELECT 5, 'VI'
                UNION ALL
                SELECT 6, 'DO'
            ) AS days
        WHERE
            FIND_IN_SET(
                days.day_name,
                REPLACE (
                        horario_profesoreses.dias, ' ', ''
                    )
            ) > 0
            AND ADDDATE(
                '2024-12-15', INTERVAL days.day_offset
            ) BETWEEN '2024-12-01' AND '2024-12-31'
    ) AS horarios
GROUP BY
    fecha;

-- Generar días relativos (día de la semana y desplazamiento desde la base)