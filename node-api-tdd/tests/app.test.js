const request = require('supertest');

const app = require('../src/app');

test('should response on root route', () => {
    return request(app).get('/')
        .then((response) => {
            expect(response.status).toBe(200);
        });
});
