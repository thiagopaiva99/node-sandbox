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

test('should not auth user with wrong password', () => {
    const email = `thiago_${Date.now()}@mail.com`;

    return app.services.users.save({
        name: 'Thiago',
        email,
        password: '123456',
    })
    .then(() => {
        return request(app).post('/auth/signin')
            .send({ email, password: '654321' })
            .then((response) => {
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('error', 'Usuário ou senha inválidos');
            });
    });
});

test('should not login user that dont exists', () => {
    return request(app).post('/auth/signin')
        .send({ email: 'usuario123@gmail.com', password: '654321' })
        .then((response) => {
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Usuário ou senha inválidos');
        });
});
