const express = require('express');

module.exports = (app) => {
    const findAll = (req, res, next) => {
        app.services.users.findAll()
            .then(users => res.status(200).json(users))
            .catch(error => next(error));
    };

    const createUser = async (req, res, next) => {
        try {
            const result = await app.services.users.save(req.body);

            return res.status(201).json(result[0]);
        } catch (error) {
            return next(error);
        }
    };

    const router = express.Router();

    router.get('/', findAll);
    router.post('/', createUser);

    return router;
};
