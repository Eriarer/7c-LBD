USE `lab_managment`;

DELIMITER;

DELIMITER $$

CREATE PROCEDURE actualizar_horario(
    IN p_idhorario INT,
    IN p_idlaboratorio INT,
    IN p_hora_inicio TIME,
    IN p_hora_cierre TIME,
    IN p_dias VARCHAR(20),
    IN p_descripcion VARCHAR(300)
)
BEGIN
    DECLARE solapamiento INT;

    -- Verificar solapamiento de horarios
    SELECT COUNT(*)
    INTO solapamiento
    FROM horario
    WHERE idlaboratorio = p_idlaboratorio
      AND idhorario != p_idhorario
      AND (
        (hora_inicio < p_hora_cierre AND hora_cierre > p_hora_inicio)
        AND (dias = p_dias)
      );

    IF solapamiento > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El horario se solapa con otro existente.';
    ELSE
        UPDATE horario
        SET hora_inicio = p_hora_inicio,
            hora_cierre = p_hora_cierre,
            dias = p_dias,
            descripcion = p_descripcion
        WHERE idhorario = p_idhorario;
    END IF;
END$$

DELIMITER;