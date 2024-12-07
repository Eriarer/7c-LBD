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