const express = require('express');

module.exports = (app) => {
    const findAll = (req, res, next) => {
        const { id } = req.user;

        app.services.transactions.find(id)
            .then(transaction => res.status(200).json(transaction))
            .catch(next);
    };

    const save = (req, res, next) => {
        const { body } = req;

        app.services.transactions.save(body)
            .then(transaction => res.status(201).json(transaction[0]))
            .catch(next);
    };

    const findOne = (req, res, next) => {
        const { id: transactionId } = req.params;
        const { id: userId } = req.user;

        app.services.transactions.findOne(userId, transactionId)
            .then(transaction => res.status(200).json(transaction))
            .catch(next);
    };

    const router = express.Router();

    router.get('/', findAll);
    router.post('/', save);
    router.get('/:id', findOne);

    return router;
};
