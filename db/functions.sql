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
    DECLARE v_current_estado ENUM('P','C','A','D','F');
    DECLARE v_total_cantidad_prestada INT DEFAULT 0;
    DECLARE v_inventario_cantidad INT DEFAULT 0;
    DECLARE v_prestamo_hora_inicio TIME;
    DECLARE v_prestamo_duracion INT;
    DECLARE v_cantidad_disponible INT DEFAULT 0;

    -- Obtener el estado y detalles del préstamo
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

    -- Calcular cantidad total prestada en intervalos conflictivos
    SELECT COALESCE(SUM(m.cantidad), 0) INTO v_total_cantidad_prestada
    FROM material m
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

    -- Calcular la cantidad disponible
    SET v_cantidad_disponible = v_inventario_cantidad - v_total_cantidad_prestada; 

    -- Verificar si la cantidad solicitada supera la cantidad disponible
    RETURN p_cantidad <= v_cantidad_disponible;
END$$

DELIMITER;