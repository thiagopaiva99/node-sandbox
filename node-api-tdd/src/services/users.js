const ValidationError = require('../errors/validationError');

module.exports = (app) => {
    const findAll = (filter = {}) => {
        return app.db('users').where(filter).select();
    };

    const save = async (user) => {
        if (!user.name) {
            throw new ValidationError('Nome é um atributo obrigatório');
        }

        if (!user.email) {
            throw new ValidationError('Email é um atributo obrigatório');
        }

        if (!user.password) {
            throw new ValidationError('Senha é um atributo obrigatório');
        }

        const userDB = await findAll({ email: user.email });

        if (userDB && userDB.length > 0) {
            throw new ValidationError('Já existe um usuário com esse email');
        }

        return app.db('users').insert(user, '*');
    };

    return {
        findAll,
        save,
    };
};
