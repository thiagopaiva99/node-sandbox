const ValidationError = require('../errors/validationError');

module.exports = (app) => {
    const findAll = (userId) => {
        return app.db('accounts').where({ user_id: userId }).select();
    };

    const find = (filter) => {
        return app.db('accounts').where(filter).first();
    };

    const save = async (account) => {
        if (!account.name) {
            throw new ValidationError('Nome é um atributo obrigatório');
        }

        return app.db('accounts').insert(account, '*');
    };

    const update = async (id, data) => {
        return app.db('accounts')
            .where({ id })
            .update(data, '*');
    };

    const remove = async (id) => {
        return app.db('accounts')
            .where({ id })
            .delete();
    };

    return {
        findAll,
        find,
        save,
        update,
        delete: remove,
    };
};
