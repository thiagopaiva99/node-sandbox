const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');

const secret = 'Secret!';

module.exports = (app) => {
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

    return {
        signin,
    };
};
