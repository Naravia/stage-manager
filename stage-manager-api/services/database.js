import config from 'config';
import mysql from 'mysql';

const dbConfig = config.get('dbConfig');

function createConnection() {
    return mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        port: dbConfig.port
    });
}

export function createShow(showName) {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(err.sqlMessage);
                return;
            }
        });

        let record = {name: showName};
        connection.query(`INSERT INTO shows SET ?`, record, (err, results) => {
            if (err) {
                reject(err.message);
                connection.end();
                return;
            }

            record.id = results.insertId;
            resolve(record);
            connection.end();
        });
    });
}

export function getAllActs() {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(err.sqlMessage);
                return;
            }
        });

        connection.query(`SELECT * FROM acts`, (err, results) => {
            if (err) {
                reject(err.message);
                connection.end();
                return;
            }

            resolve(results);
            connection.end();
        });
    });
}

export function getAllShows() {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(err.sqlMessage);
                return;
            }
        });

        connection.query(`SELECT * FROM shows`, (err, results) => {
            if (err) {
                reject(err.message);
                connection.end();
                return;
            }

            resolve(results);
            connection.end();
        });
    })
}

export function validateSchema() {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(err.sqlMessage);
                return;
            }

            // Validate shows table
            connection.query(`SELECT 1 FROM shows WHERE id=0 AND name=''`, (error) => {
                if (error) {
                    reject(`Schema for 'shows' table does not match.`);
                    connection.end();
                    return;
                }

                // Validate acts table
                connection.query(`SELECT 1 FROM acts WHERE id=0 AND name='' AND duration_estimate='' AND performer=''`, err => {
                    if (err) {
                        reject(`Schema for 'acts' table does not match.`);
                        connection.end();
                        return;
                    }

                    resolve();
                });
            })
        });
    });
}