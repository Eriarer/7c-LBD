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

DROP PROCEDURE IF EXISTS `insertar_prestamo` $$

CREATE PROCEDURE insertar_prestamo (
    IN p_idlaboratorio INT,
    IN p_idusuario INT,
    IN p_fecha DATE,
    IN p_hora_inicio TIME,
    IN p_duracion INT,
    IN p_observaciones TEXT,
    OUT p_resultado TEXT,
    OUT mensaje TIME
)
BEGIN
    DECLARE v_hora_inicio TIME;
    DECLARE v_hora_cierre TIME;
    DECLARE v_dias VARCHAR(50);
    DECLARE v_dia_nombre VARCHAR(2);
    DECLARE v_hora_fin TIME;
    DECLARE v_conflictos INT;
    
    -- 1. Verificar si existe el laboratorio
    SELECT COUNT(*) INTO v_conflictos 
    FROM laboratorio 
    WHERE idlaboratorio = p_idlaboratorio;
    IF v_conflictos = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'El laboratorio especificado no existe.';
    END IF;
    
    -- 2. Verificar si existe el usuario
    SELECT COUNT(*) INTO v_conflictos 
    FROM usuario 
    WHERE idusuario = p_idusuario;
    IF v_conflictos = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'El usuario especificado no existe.';
    END IF;
    
    -- 3. Obtener el horario de servicio del laboratorio para la fecha
    SET v_dia_nombre = CASE DAYOFWEEK(p_fecha) 
        WHEN 1 THEN 'DO'
        WHEN 2 THEN 'LU'
        WHEN 3 THEN 'MA'
        WHEN 4 THEN 'MI'
        WHEN 5 THEN 'JU'
        WHEN 6 THEN 'VI'
        WHEN 7 THEN 'SA'
    END;
    
    SELECT dias, hora_inicio, hora_cierre INTO v_dias, v_hora_inicio, v_hora_cierre 
    FROM horario_servicio 
    WHERE idlaboratorio = p_idlaboratorio 
      AND FIND_IN_SET(v_dia_nombre, REPLACE(v_dias, ' ', '')) > 0 
    LIMIT 1;
    
    IF v_hora_inicio IS NULL OR v_hora_cierre IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'ERROR: No hay horario válido para la fecha especificada.';
    END IF;
    
    -- 4. Calcular la hora de fin del préstamo
    SET v_hora_fin = ADDTIME(p_hora_inicio, SEC_TO_TIME(p_duracion * 3600));
    
    -- 5. Validar la hora de inicio y fin del préstamo dentro del horario del laboratorio
    IF p_hora_inicio < v_hora_inicio OR v_hora_fin > v_hora_cierre THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'ERROR: Horario del préstamo no válido.';
    END IF;
    
    -- 6. Verificar que no se superponga con otros préstamos aceptados
    SELECT COUNT(*) INTO v_conflictos 
    FROM prestamo 
    WHERE idlaboratorio = p_idlaboratorio 
      AND estado = 'A' 
      AND p_fecha = fecha 
      AND (
          (p_hora_inicio BETWEEN horaInicio AND ADDTIME(horaInicio, SEC_TO_TIME(duracion * 3600))) OR
          (v_hora_fin BETWEEN horaInicio AND ADDTIME(horaInicio, SEC_TO_TIME(duracion * 3600))) OR
          (p_hora_inicio <= horaInicio AND v_hora_fin >= ADDTIME(horaInicio, SEC_TO_TIME(duracion * 3600)))
      );
    IF v_conflictos > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'ERROR: El horario del préstamo se superpone con otro préstamo aceptado.';
    END IF;
    
    -- 7. Verificar que no se superponga con el horario de profesor
    SELECT COUNT(*) INTO v_conflictos 
    FROM horario_profesor 
    WHERE idlaboratorio = p_idlaboratorio 
      AND FIND_IN_SET(v_dia_nombre, REPLACE(dias, ' ', '')) > 0 
      AND (
          (p_hora_inicio BETWEEN hora_inicio AND hora_cierre) OR
          (v_hora_fin BETWEEN hora_inicio AND hora_cierre) OR
          (p_hora_inicio <= hora_inicio AND v_hora_fin >= hora_cierre)
      );
    IF v_conflictos > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'ERROR: El horario del préstamo se superpone con el horario de un profesor.';
    END IF;
    
    -- 8. Insertar el préstamo
    INSERT INTO prestamo (idlaboratorio, idusuario, fecha, horaInicio, duracion, observaciones, estado) 
    VALUES (p_idlaboratorio, p_idusuario, p_fecha, p_hora_inicio, p_duracion, p_observaciones, 'P');
    
    -- 9. Retornar el mensaje de éxito
    SET p_resultado = 'El préstamo ha sido registrado correctamente.';
    SET mensaje = v_hora_fin;
END $$

DELIMITER;