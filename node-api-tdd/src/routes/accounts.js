const express = require('express');

module.exports = (app) => {
    const find = (req, res, next) => {
        app.services.accounts.findAll(req.user.id)
            .then(users => res.status(200).json(users))
            .catch(error => next(error));
    };

    const findOne = (req, res, next) => {
        const { id } = req.params;

        app.services.accounts.find({ id })
            .then((account) => {
                if (account.user_id !== req.user.id) {
                    return res.status(403).json({ error: 'Este recurso não pertence ao usuário' });
                }

                return res.status(200).json(account);
            })
            .catch(error => next(error));
    };

    const createAccount = async (req, res, next) => {
        const { body } = req;

        app.services.accounts.save({ ...body, user_id: req.user.id })
            .then(result => res.status(201).json(result[0]))
            .catch(error => next(error));
    };

    const update = (req, res, next) => {
        const { id } = req.params;
        const { body } = req;

        app.services.accounts.update(id, body)
            .then(account => res.status(200).json(account[0]))
            .catch(error => next(error));
    };

    const remove = (req, res, next) => {
        const { id } = req.params;

        app.services.accounts.delete(id)
            .then(() => res.status(204).send())
            .catch(error => next(error));
    };

    const router = express.Router();

    router.get('/', find);
    router.get('/:id', findOne);
    router.post('/', createAccount);
    router.put('/:id', update);
    router.delete('/:id', remove);

    return router;
};
