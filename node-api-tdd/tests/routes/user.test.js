const request = require('supertest');
const app = require('../../src/app');

let email;

beforeEach(() => {
    email = `user_${Date.now()}@mail.com`;
});

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
            expect(response.body).not.toHaveProperty('password');
        });
});

test('should save the password crypted', async () => {
    const response = await request(app).post('/users')
        .send({
            name: 'Thiago',
            email,
            password: '123456',
        });

    expect(response.status).toBe(201);

    const { id } = response.body;

    const userDB = await app.services.users.findOne({ id });

    expect(userDB.password).not.toBeUndefined();
    expect(userDB.password).not.toBe('123456');
});

test('should not insert a user without a name', () => {
    return request(app).post('/users')
        .send({
            email,
            password: '123456',
        })
        .then((response) => {
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Nome é um atributo obrigatório');
        });
});

test('should not insert a user without an email', async () => {
    const result = await request(app).post('/users')
        .send({
            name: 'Thiago',
            password: '123456',
        });

    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Email é um atributo obrigatório');
});

test('should not insert a user without a password', (done) => {
    request(app).post('/users')
        .send({
            name: 'Thiago',
            email,
        })
        .then((response) => {
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Senha é um atributo obrigatório');

            done();
        });
});

test('should not insert a user with an email that already exists', async () => {
    const user = {
        name: 'Thiago',
        email: `thiago_${Date.now()}@gmail.com`,
        password: '123456',
    };

    const insertResponse = await request(app).post('/users')
        .send(user);

    expect(insertResponse.status).toBe(201);
    expect(insertResponse.body).toHaveProperty('name', 'Thiago');
    expect(insertResponse.body).not.toHaveProperty('password');

    return request(app).post('/users')
        .send(user)
        .then((response) => {
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Já existe um usuário com esse email');
        });
});
