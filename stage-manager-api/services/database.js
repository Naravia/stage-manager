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

export function createAct(actName, estimate, performer, showId) {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(new Error(err.sqlMessage));
                return;
            }
        });

        let record = {
            name: actName,
            duration_estimate: estimate,
            performer: performer
        };

        if (showId) {
            getShowById(showId)
                .then(result => {
                    if (!result) {
                        reject(`Show with ID ${showId} not found.`);
                        return;
                    }

                    connection.query(`INSERT INTO acts SET ?`, record, (err, results) => {
                        if (err) {
                            reject(err);
                            connection.end();
                            return;
                        }
                        
                        record.id = results.insertId;
                        const joinRecord = {
                            act_id: record.id,
                            show_id: showId
                        };
                        console.log(joinRecord);
                        connection.query(`INSERT INTO acts_shows SET ?`, joinRecord, (err) => {
                            if (err) {
                                reject(err);
                                connection.end();
                                return;
                            }

                            resolve(record);
                        });
                    })
                })
        } else {
            connection.query(`INSERT INTO acts SET ?`, record, (err, results) => {
                if (err) {
                    reject(err);
                    connection.end();
                    return;
                }
                
                record.id = results.insertId;
                resolve(record);
            })
        }
    })
}

export function createShow(showName) {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(new Error(err.sqlMessage));
                return;
            }
        });

        let record = {name: showName};
        connection.query(`INSERT INTO shows SET ?`, record, (err, results) => {
            if (err) {
                reject(err);
                connection.end();
                return;
            }

            record.id = results.insertId;
            resolve(record);
            connection.end();
        });
    });
}

export function getActsForShow(showId) {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(new Error(err.sqlMessage));
                return;
            }
        });

        connection.query(`SELECT * FROM acts_shows WHERE show_id = ?`, [showId], (err, results) => {
            if (err) {
                reject(err);
                connection.end();
                return;
            }

            if (results.length === 0) {
                resolve([]);
                return;
            }

            const actIds = results.map(result => result.act_id);
            connection.query(`SELECT * FROM acts WHERE id IN (?)`, [actIds], (err, results) => {
                if (err) {
                    reject(err);
                    connection.end();
                    return;
                }

                resolve(results);
                connection.end();
                return;
            });
        });
    });
}

export function getAllActs() {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(new Error(err.sqlMessage));
                return;
            }
        });

        connection.query(`SELECT * FROM acts`, (err, results) => {
            if (err) {
                reject(err);
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
                reject(new Error(err.sqlMessage));
                return;
            }
        });

        connection.query(`SELECT * FROM shows`, (err, results) => {
            if (err) {
                reject(err);
                connection.end();
                return;
            }

            resolve(results);
            connection.end();
        });
    })
}

export function getShowById(id) {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(new Error(err.sqlMessage));
                return;
            }
        });

        connection.query(`SELECT * FROM shows WHERE id = ?`, [id], (err, results) => {
            if (err) {
                reject(err);
                connection.end();
                return;
            }

            if (results.length === 0) {
                resolve(null);
            } else {
                resolve(results[0]);
            }

            connection.end();
        });
    })
}

export function validateSchema() {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(new Error(err.sqlMessage));
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