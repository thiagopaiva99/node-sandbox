const passport = require('passport');
const passportJwt = require('passport-jwt');

const secret = 'Secret!';

const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
    const params = {
        secretOrKey: secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };

    const strategy = new Strategy(params, (payload, done) => {
        app.services.users.findOne({ id: payload.id })
            .then((user) => {
                if (user) {
                    done(null, { ...payload });
                } else {
                    done(null, false);
                }
            })
            .catch(error => done(error, false));
    });

    passport.user(strategy);

    return {
        authenticate: () => passport.authenticate('jwt', { session: false }),
    };
};
