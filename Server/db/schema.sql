DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS data;
DROP TABLE IF EXISTS imgData;

CREATE TABLE images (
        id INTEGER PRIMARY KEY,
        filename VARCHAR(30) NOT NULL
);

CREATE TABLE data (
        id INTEGER PRIMARY KEY,
        time VARCHAR(30) NOT NULL,
        F VARCHAR(15) NOT NULL,
        S VARCHAR(15) NOT NULL,
        Sensor1 VARCHAR(15) NOT NULL,
        Sensor2 VARCHAR(15) NOT NULL,
        State VARCHAR(5) NOT NULL,
        Valid VARCHAR(1) NOT NULL
);

CREATE TABLE imgData (
        id INTEGER PRIMARY KEY,
        imgId INTEGER NOT NULL,
        dataId INTEGER NOT NULL
);