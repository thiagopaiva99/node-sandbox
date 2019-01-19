const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/accounts';
let user;

beforeAll(async () => {
    const response = await app.services.users.save({
        name: 'User Account',
        email: `user_account_${Date.now()}@mail.com`,
        password: '123456',
    });

    user = { ...response[0] };

    user.token = jwt.encode(user, 'Secret!');
});

test('should insert an account with success', () => {
    return request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .send({
            name: '#acc 1',
            user_id: user.id,
        })
        .then((response) => {
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('name', '#acc 1');
        });
});

test('should return all accounts', () => {
    return app.db('accounts')
        .insert({ name: 'Acc list', user_id: user.id })
        .then(() => request(app).get(MAIN_ROUTE).set('authorization', `bearer ${user.token}`))
        .then((response) => {
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
        });
});

test('should return an account by id', () => {
    return app.db('accounts')
        .insert({ name: 'Acc list', user_id: user.id }, ['id'])
        .then(account => request(app).get(`${MAIN_ROUTE}/${account[0].id}`).set('authorization', `bearer ${user.token}`))
        .then((response) => {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name', 'Acc list');
            expect(response.body).toHaveProperty('user_id', user.id);
        });
});

test('should update an account', () => {
    return app.db('accounts')
        .insert({ name: 'Acc to Update', user_id: user.id }, '*')
        .then(account => request(app).put(`${MAIN_ROUTE}/${account[0].id}`)
                            .set('authorization', `bearer ${user.token}`)
                            .send({ name: 'Acc Updated' }))
        .then((accountUpdated) => {
            expect(accountUpdated.status).toBe(200);
            expect(accountUpdated.body).toHaveProperty('name', 'Acc Updated');
        });
});

test('should delete an account', () => {
    return app.db('accounts')
        .insert({ name: 'Acc to Delete', user_id: user.id }, '*')
        .then(account => request(app).delete(`${MAIN_ROUTE}/${account[0].id}`).set('authorization', `bearer ${user.token}`))
        .then((response) => {
            expect(response.status).toBe(204);
        });
});

test('should not create account if name is empty', () => {
    return request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .send({
            user_id: user.id,
        })
        .then((response) => {
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Nome é um atributo obrigatório');
        });
});
