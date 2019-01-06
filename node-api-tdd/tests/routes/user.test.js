const request = require('supertest');
const app = require('../../src/app');

test('should return all users', () => {
    return request(app).get('/users')
        .then((response) => {
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
        });
});

test('should insert a user with success', () => {
    const email = `user_${Date.now()}@mail.com`;

    return request(app).post('/users')
        .send({
            name: 'Thiago',
            email,
            password: '123456',
        })
        .then((response) => {
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('name', 'Thiago');
        });
});
