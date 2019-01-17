const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

const secret = 'Secret!';

module.exports = (app) => {
    const signin = (req, res, next) => {
        app.services.users.findOne({
            email: req.body.email,
        })
        .then((user) => {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };

                const token = jwt.encode(payload, secret);

                res.status(200).json({ token });
            }
        })
        .catch(error => next(error));
    };

    return {
        signin,
    };
};
