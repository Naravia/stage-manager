import express from "express";
import { createUser, createVerificationTokenForUser, getUserById, verifyUser } from "../services/database.js";
import { sendWelcomeEmail } from '../services/email.js';

const router = express.Router();

router
    .route('/')
    .post((req, res) => {
        const {
            username,
            password,
            email
        } = req.body;
        if (!username) {
            res.status(400).send({ message: 'You must include a show name.' });
            return;
        }
        if (!password) {
            res.status(400).send({ message: 'You must iunclude a password.' });
        }
        if (!email) {
            res.status(400).send({ message: 'You must include an email.' });
        }
        createUser(username, password, email)
            .then(results => {
                const userRecord = results;
                createVerificationTokenForUser(userRecord.id)
                    .then(results => {
                        const {token} = results;
                        sendWelcomeEmail(userRecord.email, userRecord.username, token);
                        res.status(201).send(userRecord);
                    })
                    .catch(err => res.status(500).send({ message: err.message }))
            })
            .catch(err => res.status(500).send({ message: err.message }));
    });

router
    .route('/:id')
    .get((req, res) => {
        getUserById(req.params.id)
            .then(result => {
                if (result === null) {
                    res.status(404).send({});
                } else {

                    res.send(result);
                }
            })
            .catch(err => res.status(500).send({ message: err.message }));
    });

router
    .route('/:id/verify/:token')
    .get((req, res) => {
        verifyUser(req.params.id, req.params.token)
            .then(() => res.status(204).send())
            .catch(err => res.status(500).send({message: err.message}));
    })

export default router;