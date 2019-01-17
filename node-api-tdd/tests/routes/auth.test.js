const request = require('supertest');
const app = require('../../src/app');

test('should receive token at login', () => {
    const email = `thiago_${Date.now()}@mail.com`;
    return app.services.users.save({
        name: 'Thiago',
        email,
        password: '123456',
    })
    .then(() => {
        return request(app).post('/auth/signin')
            .send({ email, password: '123456' })
            .then((response) => {
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('token');
            });
    });
});
