import express from "express";
import { createShow, getActsForShow, getAllShows, getShowById } from "../services/database.js";

const router = express.Router();

router
    .route('/')
    .get((req, res) => {
        getAllShows()
            .then(results => res.send(results))
            .catch(err => res.status(500).send({message: err.message}));
    })
    .post((req, res) => {
        const {name} = req.body;
        if (!name) {
            res.status(400).send({message: 'You must include a show name.'});
            return;
        }
        createShow(name)
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
                    let show = result;
                    getActsForShow(show.id)
                        .then(results => {
                            show.acts = results;
                            res.send(show);
                        })
                        .catch(err => res.status(500).send({message: err.message}));
                }
            })
            .catch(err => res.status(500).send({message: err.message}));
    });

router
    .route('/:id/acts')
    .get((req, res) => {
        getActsForShow(req.params.id)
            .then(results => {
                res.send(results);
            })
            .catch(err => res.status(500).send({message: err.message}));
    })

export default router;