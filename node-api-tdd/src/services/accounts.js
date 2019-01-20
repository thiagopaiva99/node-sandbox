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

        const hasAccount = await find({ name: account.name, user_id: account.user_id });

        if (hasAccount) {
            throw new ValidationError('Já existe uma conta com esse nome para esse usuário');
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
