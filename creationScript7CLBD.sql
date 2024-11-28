-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;

SET
    @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS,
    FOREIGN_KEY_CHECKS = 0;

SET
    @OLD_SQL_MODE = @@SQL_MODE,
    SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema lab_managment
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema lab_managment
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `lab_managment`;

USE `lab_managment`;

-- -----------------------------------------------------
-- Table `lab_managment`.`equipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lab_managment`.`equipo` (
    `idequipo` INT NOT NULL,
    `nombre` VARCHAR(45) NULL DEFAULT NULL,
    `descripcion` VARCHAR(200) NULL DEFAULT NULL,
    `disponible` TINYINT NULL DEFAULT NULL,
    PRIMARY KEY (`idequipo`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `lab_managment`.`laboratorio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lab_managment`.`laboratorio` (
    `idlaboratorio` INT NOT NULL,
    `plantel` VARCHAR(4) NULL DEFAULT NULL,
    `num_ed` INT NULL DEFAULT NULL,
    `aula` VARCHAR(6) NULL DEFAULT NULL,
    `departamento` VARCHAR(80) NULL DEFAULT NULL,
    `cupo` INT NULL DEFAULT NULL,
    PRIMARY KEY (`idlaboratorio`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `lab_managment`.`horario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lab_managment`.`horario` (
    `idhorario` INT NOT NULL,
    `idlaboratorio` INT NULL DEFAULT NULL,
    `hora_inicio` DATE NULL DEFAULT NULL,
    `hora_cierre` DATE NULL DEFAULT NULL,
    `dias` VARCHAR(50) NULL DEFAULT NULL,
    `descripcion` VARCHAR(300) NULL DEFAULT NULL,
    PRIMARY KEY (`idhorario`),
    INDEX `fk_horario_laboratorio` (`idlaboratorio` ASC) VISIBLE,
    CONSTRAINT `fk_horario_laboratorio` FOREIGN KEY (`idlaboratorio`) REFERENCES `lab_managment`.`laboratorio` (`idlaboratorio`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `lab_managment`.`inventario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lab_managment`.`inventario` (
    `idlaboratorio` INT NOT NULL,
    `idunidad` INT NOT NULL,
    `cantidad` INT NULL DEFAULT NULL,
    PRIMARY KEY (`idlaboratorio`, `idunidad`),
    INDEX `fk_inventario_unidad` (`idunidad` ASC) VISIBLE,
    INDEX `fk_inventario_laboratorio` (`idlaboratorio` ASC) VISIBLE,
    CONSTRAINT `fk_inventario_laboratorio` FOREIGN KEY (`idlaboratorio`) REFERENCES `lab_managment`.`laboratorio` (`idlaboratorio`),
    CONSTRAINT `fk_inventario_unidad` FOREIGN KEY (`idunidad`) REFERENCES `lab_managment`.`equipo` (`idequipo`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `lab_managment`.`responsable`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lab_managment`.`responsable` (
    `idresponsable` VARCHAR(60) NOT NULL,
    `nombre` VARCHAR(60) NULL DEFAULT NULL,
    `tipo` ENUM('E', 'P', 'A') NULL DEFAULT NULL,
    `activo` TINYINT NOT NULL DEFAULT '1',
    PRIMARY KEY (`idresponsable`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `lab_managment`.`lab_res`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lab_managment`.`lab_res` (
    `idlaboratorio` INT NOT NULL,
    `idresponsable` VARCHAR(60) NOT NULL,
    PRIMARY KEY (
        `idlaboratorio`,
        `idresponsable`
    ),
    INDEX `fk_lab_res_responsable` (`idresponsable` ASC) VISIBLE,
    INDEX `fk_lab_res_laboratorio` (`idlaboratorio` ASC) VISIBLE,
    CONSTRAINT `fk_lab_res_laboratorio` FOREIGN KEY (`idlaboratorio`) REFERENCES `lab_managment`.`laboratorio` (`idlaboratorio`),
    CONSTRAINT `fk_lab_res_responsable` FOREIGN KEY (`idresponsable`) REFERENCES `lab_managment`.`responsable` (`idresponsable`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `lab_managment`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lab_managment`.`usuario` (
    `idusuario` VARCHAR(60) NOT NULL,
    `nombre` VARCHAR(60) NOT NULL,
    `apellido` VARCHAR(60) NULL,
    `carrera` VARCHAR(45) NULL,
    `correo` VARCHAR(100) NOT NULL,
    `tipo` ENUM('A', 'M', 'E') NULL DEFAULT 'E',
    `activo` TINYINT NOT NULL DEFAULT '1',
    PRIMARY KEY (`idusuario`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `lab_managment`.`prestamo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lab_managment`.`prestamo` (
    `idprestamo` INT NOT NULL AUTO_INCREMENT,
    `idlaboratorio` INT NOT NULL,
    `idusuario` VARCHAR(60) NOT NULL,
    `fecha` DATE NULL DEFAULT NULL,
    `observaciones` VARCHAR(300) NULL DEFAULT NULL,
    `estado` ENUM('P', 'C', 'A', 'D', 'F') NULL DEFAULT NULL,
    PRIMARY KEY (`idprestamo`),
    INDEX `fk_prestamo_laboratorio` (`idlaboratorio` ASC) VISIBLE,
    INDEX `fk_prestamo_usuario` (`idusuario` ASC) VISIBLE,
    CONSTRAINT `fk_prestamo_laboratorio` FOREIGN KEY (`idlaboratorio`) REFERENCES `lab_managment`.`laboratorio` (`idlaboratorio`),
    CONSTRAINT `fk_prestamo_usuario` FOREIGN KEY (`idusuario`) REFERENCES `lab_managment`.`usuario` (`idusuario`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `lab_managment`.`material`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lab_managment`.`material` (
    `idprestamo` INT NOT NULL AUTO_INCREMENT,
    `idlaboratorio` INT NOT NULL,
    `idunidad` INT NOT NULL,
    PRIMARY KEY (
        `idprestamo`,
        `idlaboratorio`,
        `idunidad`
    ),
    INDEX `fk_material_prestamo1_idx` (`idprestamo` ASC) VISIBLE,
    INDEX `fk_material_inventario1_idx` (
        `idlaboratorio` ASC,
        `idunidad` ASC
    ) VISIBLE,
    CONSTRAINT `fk_material_inventario1` FOREIGN KEY (`idlaboratorio`, `idunidad`) REFERENCES `lab_managment`.`inventario` (`idlaboratorio`, `idunidad`),
    CONSTRAINT `fk_material_prestamo1` FOREIGN KEY (`idprestamo`) REFERENCES `lab_managment`.`prestamo` (`idprestamo`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

USE `lab_managment`;

-- -----------------------------------------------------
-- Placeholder table for view `lab_managment`.`vista_laboratorio_detalle`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lab_managment`.`vista_laboratorio_detalle` (
    `idlaboratorio` INT,
    `plantel` INT,
    `num_ed` INT,
    `aula` INT,
    `departamento` INT,
    `cupo` INT,
    `idequipo` INT,
    `equipo_nombre` INT,
    `equipo_descripcion` INT,
    `cantidad_inventario` INT,
    `responsables` INT
);

-- -----------------------------------------------------
-- Placeholder table for view `lab_managment`.`vista_prestamos_detallados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lab_managment`.`vista_prestamos_detallados` (
    `idprestamo` INT,
    `fecha` INT,
    `observaciones` INT,
    `estado` INT,
    `idlaboratorio` INT,
    `plantel` INT,
    `aula` INT,
    `idusuario` INT,
    `usuario_nombre` INT,
    `usuario_apellido` INT,
    `carrera` INT,
    `idequipo` INT,
    `material_nombre` INT,
    `material_descripcion` INT
);

-- -----------------------------------------------------
-- View `lab_managment`.`vista_laboratorio_detalle`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lab_managment`.`vista_laboratorio_detalle`;

USE `lab_managment`;

CREATE OR REPLACE VIEW vista_laboratorio_detalle AS
SELECT
    l.idlaboratorio,
    l.plantel,
    l.num_ed,
    l.aula,
    l.departamento,
    l.cupo,
    e.idequipo,
    e.nombre AS equipo_nombre,
    e.descripcion AS equipo_descripcion,
    i.cantidad AS cantidad_inventario,
    GROUP_CONCAT(DISTINCT r.nombre) AS responsables
FROM
    laboratorio l
    LEFT JOIN inventario i ON l.idlaboratorio = i.idlaboratorio
    LEFT JOIN equipo e ON i.idunidad = e.idequipo
    LEFT JOIN lab_res lr ON l.idlaboratorio = lr.idlaboratorio
    LEFT JOIN responsable r ON lr.idresponsable = r.idresponsable
GROUP BY
    l.idlaboratorio,
    e.idequipo;

-- -----------------------------------------------------
-- View `lab_managment`.`vista_prestamos_detallados`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `lab_managment`.`vista_prestamos_detallados`;

USE `lab_managment`;

CREATE OR REPLACE VIEW vista_prestamos_detallados AS
SELECT
    p.idprestamo,
    p.fecha,
    p.observaciones,
    p.estado,
    l.idlaboratorio,
    l.plantel,
    l.aula,
    u.idusuario,
    u.nombre AS usuario_nombre,
    u.apellido AS usuario_apellido,
    u.carrera,
    e.idequipo,
    e.nombre AS material_nombre,
    e.descripcion AS material_descripcion
FROM
    prestamo p
    JOIN laboratorio l ON p.idlaboratorio = l.idlaboratorio
    JOIN usuario u ON p.idusuario = u.idusuario
    JOIN material m ON p.idprestamo = m.idprestamo
    JOIN equipo e ON m.idunidad = e.idequipo;

USE `lab_managment`;

DELIMITER $$

USE `lab_managment` $$

CREATE
DEFINER=`glem`@`%`
TRIGGER `lab_managment`.`prestamo_BEFORE_INSERT`
BEFORE INSERT ON `lab_managment`.`prestamo`
FOR EACH ROW
BEGIN
	IF NEW.fecha < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot create a prestamo with a date before today';
    END IF;
END$$

DELIMITER;

USE `lab_managment`;

DELIMITER $$

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

SET SQL_MODE = @OLD_SQL_MODE;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;