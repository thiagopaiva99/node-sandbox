module.exports = (app) => {
    const findAll = (req, res, next) => {
        app.services.accounts.findAll()
            .then(users => res.status(200).json(users))
            .catch(error => next(error));
    };

    const find = (req, res, next) => {
        const { id } = req.params;

        app.services.accounts.find({ id })
            .then(account => res.status(200).json(account))
            .catch(error => next(error));
    };

    const createAccount = async (req, res, next) => {
        const { body } = req;

        app.services.accounts.save(body)
            .then(result => res.status(201).json(result[0]))
            .catch(error => next(error));
    };

    const update = (req, res, next) => {
        const { id } = req.params;
        const { body } = req;

        app.services.accounts.update(id, body)
            .then(account => res.status(200).json(account[0]))
            .catch(error => next(error));
    };

    const remove = (req, res, next) => {
        const { id } = req.params;

        app.services.accounts.delete(id)
            .then(() => res.status(204).send())
            .catch(error => next(error));
    };

    return {
        findAll,
        find,
        createAccount,
        update,
        delete: remove,
    };
};
