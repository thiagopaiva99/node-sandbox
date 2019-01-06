module.exports = (app) => {
    const findAll = (filter = {}) => {
        return app.db('accounts').where(filter).select();
    };

    const save = async (account) => {
        return app.db('accounts').insert(account, '*');
    };

    return {
        findAll,
        save,
    };
};
