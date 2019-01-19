const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');

const secret = 'Secret!';

module.exports = (app) => {
    const router = express.Router();

    const signin = (req, res, next) => {
        app.services.users.findOne({
            email: req.body.email,
        })
        .then((user) => {
            if (!user) {
                throw new ValidationError('Usuário ou senha inválidos');
            }

            if (bcrypt.compareSync(req.body.password, user.password)) {
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };

                const token = jwt.encode(payload, secret);

                res.status(200).json({ token });
            } else {
                throw new ValidationError('Usuário ou senha inválidos');
            }
        })
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

    router.post('/signin', signin);
    router.post('/signup', createUser);

    return router;
};
