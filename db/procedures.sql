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

DELIMITER $$

CREATE PROCEDURE `material_before_change` (
    IN p_idprestamo INT, 
    IN p_idlaboratorio INT, 
    IN p_idunidad INT, 
    IN p_cantidad INT
)
BEGIN
    -- Declarar las variables para el seguimiento y verificación
    DECLARE v_current_estado ENUM('P','C','A','D','F');
    DECLARE v_total_cantidad_prestada INT DEFAULT 0;
    DECLARE v_inventario_cantidad INT DEFAULT 0;
    DECLARE v_cantidad_disponible INT DEFAULT 0;

    -- Chequear si el prestamo existe y obtener su estado actual
    SELECT estado INTO v_current_estado 
    FROM prestamo 
    WHERE idprestamo = p_idprestamo;

    -- Validar que el prestamo esté en estado 'Pendiente' o 'Aceptado'
    IF v_current_estado NOT IN ('P', 'A') THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Material can only be modified for Pending or Accepted loans';
    END IF;

    -- Obtener la cantidad actual del inventario
    SELECT cantidad INTO v_inventario_cantidad
    FROM inventario 
    WHERE idlaboratorio = p_idlaboratorio 
      AND idunidad = p_idunidad;

    -- Calcular la cantidad total ya prestada para este material en franjas horarias conflictivas
    SELECT COALESCE(SUM(m.cantidad), 0) INTO v_total_cantidad_prestada
    FROM Material m
    JOIN prestamo p ON m.idprestamo = p.idprestamo
    JOIN prestamo p_actual ON p_actual.idprestamo = p_idprestamo
    WHERE m.idlaboratorio = p_idlaboratorio 
      AND m.idunidad = p_idunidad
      AND p.estado = 'A'
      AND (
          (p.horaInicio <= p_actual.horaInicio 
          AND ADDTIME(p.horaInicio, SEC_TO_TIME(p.duracion * 3600)) > p_actual.horaInicio)
          OR 
          (p.horaInicio >= p_actual.horaInicio 
          AND p.horaInicio < ADDTIME(p_actual.horaInicio, SEC_TO_TIME(p_actual.duracion * 3600)))
      );

    SET v_cantidad_disponible = v_inventario_cantidad - v_total_cantidad_prestada;

    -- Chequear si la cantidad solicitada excede la cantidad disponible en el inventario
    IF p_cantidad > v_cantidad_disponible THEN
      SIGNAL SQLSTATE '45000' 
      SET MESSAGE_TEXT = 'Requested material quantity exceeds available inventory in the given time slot';
    END IF;

END $$

DELIMITER;