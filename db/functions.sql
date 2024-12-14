CREATE FUNCTION fun_prestamos_por_usuario(idUsuario lab_managment.usuario.idusuario%TYPE)
RETURNS VARCHAR(150)
DETERMINISTIC
BEGIN
  DECLARE prestamosUsuario INT;
  DECLARE promedioPrestamos DECIMAL(10,2);
  DECLARE desviacionEstandar DECIMAL(10,2);
  DECLARE rangoSuperior DECIMAL(10,2);
  DECLARE rangoInferior DECIMAL(10,2);
  DECLARE resultado VARCHAR(150);

  -- Calcular la cantidad de préstamos del usuario
  SELECT COUNT(*) 
  INTO prestamosUsuario
  FROM prestamo
  WHERE idusuario = idUsuario;

  -- Calcular el promedio de préstamos y la desviación estándar
  SELECT AVG(prestamosTotales), STDDEV(prestamosTotales)
  INTO promedioPrestamos, desviacionEstandar
  FROM (
    SELECT idusuario, COUNT(*) AS prestamosTotales
    FROM prestamo
    GROUP BY idusuario
  ) AS subquery;

  -- Definir el rango superior e inferior usando la desviación estándar
  SET rangoSuperior = promedioPrestamos + desviacionEstandar;
  SET rangoInferior = promedioPrestamos - desviacionEstandar;

  -- Comparar la cantidad de préstamos con el rango
  IF prestamosUsuario > rangoSuperior THEN
    SET resultado = CONCAT('El usuario ha realizado ', prestamosUsuario, ' préstamos, por encima del rango superior (', ROUND(rangoSuperior, 2), ').');
  ELSEIF prestamosUsuario < rangoInferior THEN
    SET resultado = CONCAT('El usuario ha realizado ', prestamosUsuario, ' préstamos, por debajo del rango inferior (', ROUND(rangoInferior, 2), ').');
  ELSE
    SET resultado = CONCAT('El usuario ha realizado ', prestamosUsuario, ' préstamos, dentro del rango promedio (', ROUND(rangoInferior, 2), ' - ', ROUND(rangoSuperior, 2), ').');
  END IF;

  RETURN resultado;
END$$

DELIMITER;

USE `lab_managment`;

DELIMITER $$

CREATE FUNCTION fun_prestamo_finalizados(idLab INT, fechaInicio DATE, fechaFin DATE)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE totalFinalizados INT;

    -- Calcular el total de préstamos finalizados (estado 'F') en el periodo
    SELECT COUNT(*)
    INTO totalFinalizados
    FROM prestamo
    WHERE idlaboratorio = idLab 
      AND estado = 'F'
      AND fecha BETWEEN fechaInicio AND fechaFin;

    RETURN IFNULL(totalFinalizados, 0);
END$$

DELIMITER;
-- Funcion para validacion de presatmos

DELIMITER $$

DROP FUNCTION IF EXISTS `validar_material_prestamo` $$

CREATE FUNCTION `validar_material_prestamo` (
    p_idprestamo INT, 
    p_idlaboratorio INT, 
    p_idunidad INT, 
    p_cantidad INT
)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    -- Declaraciones de variables
    DECLARE v_current_estado ENUM('P','C','A','D','F');
    DECLARE v_prestamo_hora_inicio TIME;
    DECLARE v_prestamo_duracion INT;
    DECLARE v_inventario_cantidad INT DEFAULT 0;
    DECLARE v_total_cantidad_prestada INT DEFAULT 0;
    DECLARE v_cantidad_disponible INT;
    
    -- Variables para el cursor
    DECLARE v_cursor_idprestamo INT;
    DECLARE v_cursor_horaInicio TIME;
    DECLARE v_cursor_duracion INT;
    DECLARE v_cursor_cantidad INT;
    DECLARE v_done INT DEFAULT FALSE;
    
    -- Cursor para préstamos conflictivos
    DECLARE conflicto_cursor CURSOR FOR 
    SELECT 
        p.idprestamo, 
        p.horaInicio, 
        p.duracion,
        COALESCE(m.cantidad, 0) as cantidad
    FROM prestamo p
    LEFT JOIN material m ON p.idprestamo = m.idprestamo
    WHERE 
        p.idlaboratorio = p_idlaboratorio
        AND p.estado = 'A'
        AND m.idunidad = p_idunidad
        AND (
            -- Condiciones de superposición de intervalos de tiempo
            (p.horaInicio <= (SELECT horaInicio FROM prestamo WHERE idprestamo = p_idprestamo)
             AND ADDTIME(p.horaInicio, SEC_TO_TIME(p.duracion * 3600)) > (SELECT horaInicio FROM prestamo WHERE idprestamo = p_idprestamo))
            OR
            (p.horaInicio >= (SELECT horaInicio FROM prestamo WHERE idprestamo = p_idprestamo)
             AND p.horaInicio < ADDTIME((SELECT horaInicio FROM prestamo WHERE idprestamo = p_idprestamo), SEC_TO_TIME((SELECT duracion FROM prestamo WHERE idprestamo = p_idprestamo) * 3600)))
        );
    
    -- Declaración de handler para el fin del cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    
    -- Obtener el estado y detalles del préstamo actual
    SELECT estado, horaInicio, duracion 
    INTO v_current_estado, v_prestamo_hora_inicio, v_prestamo_duracion
    FROM prestamo 
    WHERE idprestamo = p_idprestamo;
    
    -- Validar estado del préstamo
    IF v_current_estado NOT IN ('P', 'A') THEN
        RETURN FALSE;
    END IF;
    
    -- Obtener la cantidad en inventario
    SELECT cantidad INTO v_inventario_cantidad
    FROM inventario 
    WHERE idlaboratorio = p_idlaboratorio 
      AND idunidad = p_idunidad;
    
    -- Abrir el cursor
    OPEN conflicto_cursor;
    
    -- Recorrer los préstamos conflictivos
    read_loop: LOOP
        FETCH conflicto_cursor 
        INTO v_cursor_idprestamo, v_cursor_horaInicio, v_cursor_duracion, v_cursor_cantidad;
        
        -- Salir si no hay más registros
        IF v_done THEN
            LEAVE read_loop;
        END IF;
        
        -- Sumar la cantidad de préstamos conflictivos
        SET v_total_cantidad_prestada = v_total_cantidad_prestada + v_cursor_cantidad;
    END LOOP;
    
    -- Cerrar el cursor
    CLOSE conflicto_cursor;
    
    -- Calcular cantidad disponible
    SET v_cantidad_disponible = v_inventario_cantidad - v_total_cantidad_prestada;
    
    -- Verificar si la cantidad solicitada supera la cantidad disponible
    RETURN p_cantidad <= v_cantidad_disponible;
END $$

DELIMITER;