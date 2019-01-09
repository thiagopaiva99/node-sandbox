const request = require('supertest');
const app = require('../../src/app');

const email = `user_${Date.now()}@mail.com`;

test('should return all users', () => {
    return request(app).get('/users')
        .then((response) => {
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
        });
});

test('should insert a user with success', () => {
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

test('should not insert a user without a name', () => {
    return request(app).post('/users')
        .send({
            email,
            password: '123456',
        })
        .then((response) => {
            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe('Nome é um atributo obrigatório');
        });
});

test('should not insert a user without an email', async () => {
    const result = await request(app).post('/users')
        .send({
            name: 'Thiago',
            password: '123456',
        });

    expect(result.status).toBe(400);
    expect(result.body.error.message).toBe('Email é um atributo obrigatório');
});

test('should not insert a user without a password', (done) => {
    request(app).post('/users')
        .send({
            name: 'Thiago',
            email,
        })
        .then((response) => {
            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe('Senha é um atributo obrigatório');

            done();
        });
});

test('should not insert a user with an email that already exists', () => {
    return request(app).post('/users')
    .send({
        name: 'Thiago',
        email,
        password: '123456',
    })
    .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.error.message).toBe('Já existe um usuário com esse email');
    });
});
