DELIMITER $$

DROP TRIGGER IF EXISTS material_before_insert$$

CREATE TRIGGER material_before_insert 
BEFORE INSERT ON material
FOR EACH ROW 
BEGIN
    
    IF NOT validar_material_prestamo(
        NEW.idprestamo, 
        NEW.idlaboratorio, 
        NEW.idunidad, 
        NEW.cantidad
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No se puede insertar el material. Cantidad no disponible o préstamo inválido.';
    END IF;
END $$

DELIMITER;

DELIMITER $$

DROP TRIGGER IF EXISTS material_before_update$$

-- Trigger BEFORE UPDATE
CREATE TRIGGER material_before_update
BEFORE UPDATE ON material
FOR EACH ROW 
BEGIN
    
    IF NOT validar_material_prestamo(
        NEW.idprestamo, 
        NEW.idlaboratorio, 
        NEW.idunidad, 
        NEW.cantidad
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No se puede actualizar el material. Cantidad no disponible o préstamo inválido.';
    END IF;
END $$

DELIMITER;