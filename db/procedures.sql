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

CREATE DEFINER=`glem`@`%` PROCEDURE `insertar_prestamo`(
    IN p_idlaboratorio INT,
    IN p_idusuario VARCHAR(60),
    IN p_fecha DATE,
    IN p_hora_inicio TIME,
    IN p_duracion INT, -- Duración en horas
    IN p_observaciones VARCHAR(300),
    OUT p_resultado VARCHAR(100),
    OUT mensaje VARCHAR(100)
)
BEGIN
    DECLARE v_hora_inicio TIME;
    DECLARE v_hora_cierre TIME;
    DECLARE v_dia_nombre VARCHAR(2);
    DECLARE p_hora_fin TIME;
	DECLARE v_dias VARCHAR(100);

    IF NOT EXISTS (SELECT 1 FROM laboratorio WHERE idlaboratorio = p_idlaboratorio) THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'El laboratorio especificado no existe.';
    END IF;

-- 2. Verificar que el idusuario exista
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE idusuario = p_idusuario) THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'El usuario especificado no existe.';
    END IF;

-- 3. Obtener el horario de servicio del laboratorio para el día especificado
    -- Mapeo de días en la nomenclatura 'Lu, Ma, Mi, Ju, Vi, Sa, Do'
    -- La función DAYOFWEEK() retorna un valor entre 1 (Domingo) y 7 (Sábado)
    CASE DAYOFWEEK(p_fecha)
        WHEN 1 THEN SET v_dia_nombre = 'DO'; -- Domingo
        WHEN 2 THEN SET v_dia_nombre = 'LU'; -- Lunes
        WHEN 3 THEN SET v_dia_nombre = 'MA'; -- Martes
        WHEN 4 THEN SET v_dia_nombre = 'MI'; -- Miércoles
        WHEN 5 THEN SET v_dia_nombre = 'JU'; -- Jueves
        WHEN 6 THEN SET v_dia_nombre = 'VI'; -- Viernes
        WHEN 7 THEN SET v_dia_nombre = 'SA'; -- Sábado
    END CASE;

	-- Obtener la cadena de días del horario del laboratorio
	SELECT dias
	INTO v_dias
	FROM horario_servicio
	WHERE idlaboratorio = p_idlaboratorio;

    -- Validar el horario del laboratorio para el día especificado
    SELECT hora_inicio, hora_cierre
    INTO v_hora_inicio, v_hora_cierre
    FROM horario_servicio
    WHERE idlaboratorio = p_idlaboratorio
	AND FIND_IN_SET(v_dia_nombre, REPLACE(v_dias, ' ', '')) > 0
    LIMIT 1;
		
	-- Si no se encuentra horario válido, retornar error
    IF v_hora_inicio IS NULL OR 
		v_hora_cierre IS NULL OR 
        FIND_IN_SET(v_dia_nombre, REPLACE(v_dias, ' ', '')) = 0 
    THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'ERROR: No hay horario válido para la fecha especificada.';
    END IF;

    -- 4. Validar que la hora del préstamo esté dentro del horario de servicio
    SET p_hora_fin = ADDTIME(p_hora_inicio, SEC_TO_TIME(p_duracion * 3600));
    
    SET mensaje = CONCAT('Hora de fin de prestamo:', p_hora_fin);

    -- Validar que la hora de inicio y fin estén dentro del horario permitido
    IF  p_hora_inicio <= v_hora_inicio OR p_hora_fin > v_hora_cierre THEN
         SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'ERROR: Horario del préstamo no válido.';
    END IF;

    -- 5. Insertar el registro si todo es válido
    INSERT INTO prestamo (idlaboratorio, idusuario, fecha, horaInicio, duracion, observaciones, estado)
    VALUES (p_idlaboratorio, p_idusuario, p_fecha, p_hora_inicio, p_duracion, p_observaciones, 'P');

    SET p_resultado = 'El préstamo ha sido registrado correctamente.';
END$$

DELIMITER;