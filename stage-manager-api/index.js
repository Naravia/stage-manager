import bcrypt from 'bcrypt';
import config from 'config';
import express from 'express';

import {validateSchema} from './services/database.js';
import ActController from './controllers/act-controller.js';
import ShowController from './controllers/show-controller.js';
import UserController from './controllers/user-controller.js';

const dbConfig = config.get('dbConfig');
validateSchema()
    .then(() => {
        console.log('Schema OK!');
        const app = express();
        app.use(express.json());
        app.use('/acts', ActController);
        app.use('/shows', ShowController);
        app.use('/users', UserController);
        app.get('/test', (req, res) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash("giraffes", salt, (err, hash) => {
                    res.send({hash});
                })
            })
        })
        
        app.listen(3000, () => console.log(`Listening on http://localhost:3000`))
    })
    .catch(err => console.error(`Failed to validate schema. Reason: ${JSON.stringify(err)}`));
