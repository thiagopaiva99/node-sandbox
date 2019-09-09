module.exports = (app) => {
    const find = (userId, filter = {}) => {
        return app.db('transactions')
            .join('accounts', 'accounts.id', 'transactions.acc_id')
            .where(filter)
            .andWhere('accounts.user_id', '=', userId);
    };

    const findOne = (userId, transactionId, filter = {}) => {
        return app.db('transactions')
            .join('accounts', 'accounts.id', 'transactions.acc_id')
            .where(filter)
            .andWhere('accounts.user_id', '=', userId)
            .andWhere('transactions.id', '=', transactionId)
            .first();
    };

    const save = async (transaction) => {
        return app.db('transactions').insert(transaction, '*');
    };

    const update = async (id, transaction) => {
        return app.db('transactions')
            .where({ id })
            .update(transaction, '*');
    };

    const remove = (id) => {
        return app.db('transactions')
            .where({ id })
            .delete();
    };

    return {
        find,
        save,
        findOne,
        update,
        remove,
    };
};
