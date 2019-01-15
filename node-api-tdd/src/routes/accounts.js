module.exports = (app) => {
    const findAll = (req, res) => {
        app.services.accounts.findAll()
            .then(users => res.status(200).json(users));
    };

    const find = (req, res) => {
        const { id } = req.params;

        app.services.accounts.find({ id })
            .then((account) => {
                return res.status(200).json(account);
            });
    };

    const createAccount = async (req, res) => {
        const { body } = req;

        app.services.accounts.save(body)
            .then(result => res.status(201).json(result[0]))
            .catch(error => res.status(400).json({ error: error.message }));
    };

    const update = (req, res) => {
        const { id } = req.params;
        const { body } = req;

        app.services.accounts.update(id, body)
            .then(account => res.status(200).json(account[0]));
    };

    const remove = (req, res) => {
        const { id } = req.params;

        app.services.accounts.delete(id)
            .then(() => res.status(204).send());
    };

    return {
        findAll,
        find,
        createAccount,
        update,
        delete: remove,
    };
};
