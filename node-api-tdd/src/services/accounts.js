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

    return {
        findAll,
        find,
        save,
    };
};
