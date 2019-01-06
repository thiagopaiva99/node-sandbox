module.exports = (app) => {
    const findAll = (req, res) => {
        app.services.accounts.findAll()
            .then(users => res.status(200).json(users));
    };

    const createAccount = async (req, res) => {
        const result = await app.services.accounts.save(req.body);

        if (result.error) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result[0]);
    };

    return {
        findAll,
        createAccount,
    };
};
