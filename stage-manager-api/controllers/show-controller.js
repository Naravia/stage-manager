import express from "express";
import { createShow, getAllShows } from "../services/database.js";

const router = express.Router();

router.route('/')
    .get((req, res) => {
        getAllShows()
            .then(results => res.send(results))
            .catch(err => res.statusCode(500).send({message: err.message}));
    })
    .post((req, res) => {
        const {name} = req.body;
        if (!name) {
            res.statusCode(400).send({message: 'You must include a show name.'});
            return;
        }
        createShow(name)
            .then(results => res.send(results))
            .catch(err => res.statusCode(500).send({message: err.message}));
    });

export default router;