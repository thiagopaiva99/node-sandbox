const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/accounts';
let user;

beforeAll(async () => {
    const response = await app.services.users.save({
        name: 'User Account',
        email: `user_account_${Date.now()}@mail.com`,
        password: '123456',
    });

    user = { ...response[0] };
});

test('should inser an account with success', () => {
    return request(app).post(MAIN_ROUTE)
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
    return request(app).get(MAIN_ROUTE)
        .then((response) => {
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
        });
});
