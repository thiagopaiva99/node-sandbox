const supertest = require('supertest');

const request = supertest('http://localhost:3001');

test('should response on the 3001 port', () => {
    return request.get('/')
        .then((response) => {
            expect(response.status).toBe(200);
        });
});
