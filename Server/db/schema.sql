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
        action VARCHAR(30) NOT NULL
);

CREATE TABLE imgData (
        id INTEGER PRIMARY KEY,
        imgId INTEGER NOT NULL,
        dataId INTEGER NOT NULL
);

