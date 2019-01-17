module.exports = (app) => {
    app.route('/auth/signin')
        .post(app.routes.auth.signin);

    app.route('/users')
        .get(app.routes.users.findAll)
        .post(app.routes.users.createUser);

    app.route('/accounts')
        .get(app.routes.accounts.findAll)
        .post(app.routes.accounts.createAccount);

    app.route('/accounts/:id')
        .get(app.routes.accounts.find)
        .put(app.routes.accounts.update)
        .delete(app.routes.accounts.delete);
};
