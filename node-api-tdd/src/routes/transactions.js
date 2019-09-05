const express = require('express');

module.exports = (app) => {
    const findAll = (req, res, next) => {
        const { id } = req.user;

        app.services.transactions.find(id)
            .then(transaction => res.status(200).json(transaction))
            .catch(error => next(error));
    };

    const save = (req, res, next) => {
        const { body } = req;

        app.services.transactions.save(body)
            .then(transaction => res.status(201).json(transaction[0]))
            .catch(error => next(error));
    };

    const router = express.Router();

    router.get('/', findAll);
    router.post('/', save);

    return router;
};
