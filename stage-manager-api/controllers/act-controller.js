import express from "express";
import { createAct, getAllActs, getShowById } from "../services/database.js";

const router = express.Router();

router
    .route('/')
    .get((req, res) => {
        getAllActs()
            .then(results => res.send(results))
            .catch(err => res.status(500).send({message: err.message}));
    })
    .post((req, res) => {
        const {
            name,
            duration_estimate,
            performer,
            show_id
        } = req.body;
        if (!name) {
            res.status(400).send({message: 'You must include a show name.'});
            return;
        }
        createAct(name, duration_estimate, performer, show_id)
            .then(results => res.status(201).send(results))
            .catch(err => res.status(500).send({message: err.message}));
    });

router
    .route('/:id')
    .get((req, res) => {
        getShowById(req.params.id)
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