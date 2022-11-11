import express from "express";
import { createUser, getUserById } from "../services/database.js";

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
            res.status(400).send({message: 'You must include a show name.'});
            return;
        }
        if (!password) {
            res.status(400).send({message: 'You must iunclude a password.'});
        }
        if (!email) {
            res.status(400).send({message: 'You must include an email.'});
        }
        createUser(username, password, email)
            .then(results => res.status(201).send(results))
            .catch(err => res.status(500).send({message: err.message}));
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
            .catch(err => res.status(500).send({message: err.message}));
    });

export default router;