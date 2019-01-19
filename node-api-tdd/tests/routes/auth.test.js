const request = require('supertest');
const app = require('../../src/app');

test('should create an user via signup', () => {
    const email = `thiago_${Date.now()}@mail.com`;

    return request(app).post('/auth/signup')
        .send({
            name: 'Thiago',
            email,
            password: '123456',
        })
        .then((response) => {
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('name');
            expect(response.body).toHaveProperty('email');
            expect(response.body).not.toHaveProperty('password');
        })
});

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

test('should not access a protected route without token', () => {
    return request(app).get('/v1/users')
        .then((response) => {
            expect(response.status).toBe(401);
        });
});
