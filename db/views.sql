DELIMITER;

DROP VIEW IF EXISTS laboratorio_responsable;

CREATE VIEW laboratorio_responsable AS
SELECT res.idusuario, res.nombre, res.tipo, res.activo, lab.idlaboratorio, lab.plantel, lab.num_ed, lab.aula
FROM
    usuario AS res
    JOIN lab_res AS lr ON lr.idusuario = res.idusuario
    JOIN laboratorio AS lab ON lab.idlaboratorio = lr.idlaboratorio
ORDER BY res.idresponsable DESC;

DROP VIEW IF EXISTS prestamos_laboratorio;

CREATE VIEW prestamos_laboratorio AS
SELECT
    p.idprestamo,
    u.nombre AS usuario,
    l.plantel AS laboratorio,
    m.cantidad AS cantidad_material,
    p.fecha,
    p.horaInicio,
    p.duracion
FROM
    prestamo p
    JOIN usuario u ON p.idusuario = u.idusuario
    JOIN laboratorio l ON p.idlaboratorio = l.idlaboratorio
    JOIN material m ON p.idprestamo = m.idprestamo
WHERE
    p.idprestamo = (
        SELECT idprestamo
        FROM material
        GROUP BY
            idprestamo
        ORDER BY idprestamo
        LIMIT 1
    )
GROUP BY
    p.idprestamo;