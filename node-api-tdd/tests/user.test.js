const request = require('supertest');
const app = require('../src/app');

test('should return all users', () => {
    return request(app).get('/users')
        .then((response) => {
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('name', 'John Doe');
        });
});

test('should insert a user with success', () => {
    return request(app).post('/users')
        .send({
            name: 'Thiago',
            email: 'thiagopaiva99@gmail.com',
        })
        .then((response) => {
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('name', 'Thiago');
        });
});
