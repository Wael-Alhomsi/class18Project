drop table if exists houses;

CREATE TABLE houses(
id INT AUTO_INCREMENT key,
link varchar(255) UNIQUE,
market_date date NOT NULL,
location_country varchar(50) NOT NULL,
location_city varchar(50) NOT NULL,
location_address varchar(255),
location_coordinates_lat float,
location_coordinates_lng float,
size_living_area INT NOT NULL,
size_rooms INT NOT NULL,
price_value float NOT NULL,
price_currency varchar(3) NOT NULL, 
description text,
title text,
images text,
sold bit(1)
) Engine=InnoDB DEFAULT CHARSET=UTF8;


DELIMITER //
CREATE TRIGGER InsertFieldsLocationNotNull1 BEFORE INSERT ON houses
FOR EACH ROW BEGIN
  IF (NEW.location_address IS NULL AND NEW.location_coordinates_lat  IS NULL AND NEW.location_coordinates_lng  IS NULL) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'either \'location_address\' or \'location_coordinates_lat\' and \'location_coordinates_lng\' is required';
  END IF;
END//

CREATE TRIGGER InsertFieldsLocationNotNull2 BEFORE INSERT ON houses
FOR EACH ROW BEGIN
  IF (NEW.location_address IS NULL AND NEW.location_coordinates_lat  IS NULL) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'either \'location_address\' or \'location_coordinates_lat\' and \'location_coordinates_lng\' is required';
  END IF;
END//

CREATE TRIGGER InsertFieldsLocationNotNull3 BEFORE INSERT ON houses
FOR EACH ROW BEGIN
  IF (NEW.location_address IS NULL AND NEW.location_coordinates_lng  IS NULL) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'either \'location_address\' or \'location_coordinates_lat\' and \'location_coordinates_lng\' is required';
  END IF;
END//
DELIMITER ;




