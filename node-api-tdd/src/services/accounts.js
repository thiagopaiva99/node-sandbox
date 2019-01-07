module.exports = (app) => {
    const findAll = (filter = {}) => {
        return app.db('accounts').where(filter).select();
    };

    const find = (filter) => {
        return findAll(filter).first();
    };

    const save = async (account) => {
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
