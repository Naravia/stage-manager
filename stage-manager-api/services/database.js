import bcrypt from 'bcrypt';
import config from 'config';
import mysql from 'mysql';
import randomstring from 'randomstring';

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

        let record = { name: showName };
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

export function createUser(username, password, email) {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(new Error(err.sqlMessage));
                return;
            }
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                let record = {
                    username,
                    password: hash,
                    email,
                    is_verified: false
                };

                connection.query(`INSERT INTO users SET ?`, record, (err, results) => {
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
        });
    });
}

export function createVerificationTokenForUser(userId) {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(new Error(err.sqlMessage));
                return;
            }
        });

        connection.query(`DELETE FROM user_verification_tokens WHERE user_id = ?`, [userId], (err, results) => {
            if (err) {
                reject(err);
                connection.end();
                return;
            }
        });

        const record = {
            user_id: userId,
            token: randomstring.generate()
        };

        connection.query(`INSERT INTO user_verification_tokens SET ?`, record, (err, results) => {
            if (err) {
                reject(err);
                connection.end();
                return;
            }

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

export function getUserById(id) {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(new Error(err.sqlMessage));
                return;
            }
        });

        connection.query(`SELECT * FROM users WHERE id = ?`, [id], (err, results) => {
            if (err) {
                reject(err);
                connection.end();
                return;
            }

            if (results.length === 0) {
                resolve(null);
            } else {
                let record = results[0];
                record.password = undefined;
                resolve(record);
            }

            connection.end();
        });
    });
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
                    
                    // Validate acts_shows table
                    connection.query(`SELECT 1 FROM acts_shows WHERE act_id=0 AND show_id=0`, err => {
                        if (err) {
                            reject(`Schema for 'acts_shows' table does not match.`);
                            connection.end();
                            return;
                        }
                        
                        // Validate users table
                        connection.query(`SELECT 1 FROM users WHERE id=0 AND username='' AND password='' AND email='' AND is_verified=0`, err => {
                            if (err) {
                                reject(`Schema for 'users' table does not match.`);
                                connection.end();
                                return;
                            }

                            // Validate user_verification_tokens table
                            connection.query(`SELECT 1 FROM user_verification_tokens WHERE user_id=0 AND token=''`, err => {
                                if (err) {
                                    reject(`Schema for 'user_verification_tokens' table does not match.`);
                                    connection.end();
                                    return;
                                }

                                resolve();
                            })
                        })
                    });
                });
            })
        });
    });
}

export function verifyUser(userId, verificationToken) {
    return new Promise((resolve, reject) => {
        const connection = createConnection();
        connection.connect(err => {
            if (err) {
                reject(new Error(err.sqlMessage));
                return;
            }
        })

        connection.query(
            `SELECT * FROM user_verification_tokens WHERE user_id = ? AND token = ? LIMIT 1`,
            [userId, verificationToken],
            (err, results) => {
                if (err) {
                    reject(err);
                    connection.end();
                    return;
                }

                if (results.length === 0) {
                    reject(new Error('The verification information is invalid or your account is already verified.'));
                    connection.end();
                    return;
                }

                connection.query(`UPDATE users SET is_verified = 1 WHERE id = ?`, [userId], (err, results) => {
                    if (err) {
                        reject(err);
                        connection.end();
                        return;
                    }

                    connection.query(`DELETE FROM user_verification_tokens WHERE user_id = ?`, [userId], (err, results) => {
                        if (err) {
                            reject(err);
                            connection.end();
                            return;
                        }

                        resolve();
                    });
                });
            }
        )
    })
}