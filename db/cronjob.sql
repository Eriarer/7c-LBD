DELIMITER $$

DROP EVENT IF EXISTS denegar_prestamos_vencidos $$

CREATE EVENT  denegar_prestamos_vencidos
ON SCHEDULE EVERY 1 HOUR
STARTS CURRENT_TIMESTAMP
DO
BEGIN
  UPDATE prestamo
  SET estado = 'D'
  WHERE estado = 'P' 
    AND TIMESTAMP(fecha, horaInicio) + INTERVAL duracion HOUR < NOW();
END$$

DELIMITER;