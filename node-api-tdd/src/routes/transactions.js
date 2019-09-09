const express = require('express');
const ContentForbiddenError = require('../errors/contentForbiddenError');

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

    const update = (req, res, next) => {
        const { id } = req.params;
        const { body } = req;

        app.services.transactions.update(id, body)
            .then(transaction => res.status(200).json(transaction[0]))
            .catch(next);
    };

    const remove = (req, res, next) => {
        const { id } = req.params;

        app.services.transactions.remove(id)
            .then(() => res.status(200))
            .catch(next);
    };

    const validateUserRelatedToTransaction = (req, res, next) => {
        const { id } = req.user;
        const filter = { 'transactions.id': req.params.id };

        app.services.transactions.find(id, filter)
            .then((transactions) => {
                if (transactions.length > 0) {
                    return next();
                }

                throw new ContentForbiddenError();
            })
            .catch(next);
    };

    const router = express.Router();

    router.param('id', validateUserRelatedToTransaction);

    router.get('/', findAll);
    router.post('/', save);
    router.get('/:id', findOne);
    router.put('/:id', update);
    router.delete('/:id', remove);

    return router;
};
