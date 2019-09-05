module.exports = (app) => {
    const find = (userId, filter = {}) => {
        return app.db('transactions')
            .join('accounts', 'accounts.id', 'transactions.acc_id')
            .where(filter)
            .andWhere('accounts.user_id', '=', userId);
    };

    const save = async (transaction) => {
        return app.db('transactions').insert(transaction, '*');
    };

    return {
        find,
        save,
    };
};
