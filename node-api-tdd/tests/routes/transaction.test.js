const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

let user1;
let user2;

let account1;
let account2;

const MAIN_ROUTE = '/v1/transactions';

const insertTransactionsData = () => {
    return app.db('transactions').insert([{
            description: 'T1',
            date: new Date(),
            ammount: 100,
            type: 'I',
            acc_id: account1.id,
        },
        {
            description: 'T2',
            date: new Date(),
            ammount: 300,
            type: 'O',
            acc_id: account2.id,
        },
    ], '*');
};

const cleanTables = async () => {
    await app.db('transactions').del();
    await app.db('accounts').del();
    await app.db('users').del();
};

const insertData = async () => {
    const users = await app.db('users').insert([
        {
            name: 'User #1',
            email: 'user1@gmail.com',
            password: '$2a$10$pU/7oY07JkxTPo4V7QSgKu9Lgal55nNzUqmFydPvl8LQggYt9D/WG',
        },
        {
            name: 'User #2',
            email: 'user2@gmail.com',
            password: '$2a$10$pU/7oY07JkxTPo4V7QSgKu9Lgal55nNzUqmFydPvl8LQggYt9D/WG',
        },
    ], '*');

    [user1, user2] = users;

    delete user1.password;
    delete user2.password;

    user1.token = jwt.encode(user1, 'Secret!');
    user2.token = jwt.encode(user1, 'Secret!');

    const accounts = await app.db('accounts').insert([
        {
            name: 'ACC #1',
            user_id: user1.id,
        },
        {
            name: 'ACC #2',
            user_id: user2.id,
        },
    ], '*');

    [account1, account2] = accounts;
};

beforeAll(async () => {
    await cleanTables();
    await insertData();
});

test('should list only the user transactions', (done) => {
    insertTransactionsData()
        .then(() => request(app).get(MAIN_ROUTE).set('authorization', `bearer ${user1.token}`))
        .then(async (response) => {
            await expect(response.status).toBe(200);
            await expect(response.body).toHaveLength(1);
            await expect(response.body[0].description).toBe('T1');

            done();
        });
});

test('should insert a transaction with success', () => {
    const transaction = {
        description: 'T3',
        date: new Date(),
        ammount: 350,
        type: 'O',
        acc_id: account1.id,
    };

    return request(app)
        .post(MAIN_ROUTE)
        .set('authorization', `bearer ${user1.token}`)
        .send(transaction)
        .then((response) => {
            expect(response.status).toBe(201);
            expect(response.body.acc_id).toBe(account1.id);
        });
});

test('should return a transaction by id', (done) => {
    const transaction = {
        description: 'T4',
        date: new Date(),
        ammount: 350,
        type: 'O',
        acc_id: account1.id,
    };

    return app.db('transactions')
        .insert(transaction, ['id'])
        .then((response) => {
            request(app).get(`${MAIN_ROUTE}/${response[0].id}`)
                .set('authorization', `bearer ${user1.token}`)
                .then((transactionResponse) => {
                    expect(transactionResponse.status).toBe(200);
                    expect(transactionResponse.body.description).toEqual('T4');

                    done();
                });
        });
});

test('should update a transaction', (done) => {
    const transactionToSave = {
        description: 'T5',
        date: new Date(),
        ammount: 350,
        type: 'O',
        acc_id: account1.id,
    };

    return app.db('transactions')
        .insert(transactionToSave, ['id'])
        .then((transaction) => {
            request(app).put(`${MAIN_ROUTE}/${transaction[0].id}`)
                .set('authorization', `bearer ${user1.token}`)
                .send({ description: 'T5 Updated' })
                .then((transactionResponse) => {
                    expect(transactionResponse.status).toBe(200);
                    expect(transactionResponse.body).toHaveProperty('description', 'T5 Updated');


                    done();
                });
        });
});

test('should remove a transaction', () => {
    const transactionToRemove = {
        description: 'T7',
        date: new Date(),
        ammount: 350,
        type: 'O',
        acc_id: account1.id,
    };

    return app.db('transactions')
        .insert(transactionToRemove, ['id'])
        .then((transaction) => {
            request(app).delete(`${MAIN_ROUTE}/${transaction[0].id}`)
                .set('authorization', `bearer ${user1.token}`)
                .then((response) => {
                    expect(response.status).toBe(200);
                });
        });
});

test('should not get a transaction from another user', () => {
    const transactionToRemove = {
        description: 'T8',
        date: new Date(),
        ammount: 350,
        type: 'O',
        acc_id: account2.id,
    };

    return app.db('transactions')
        .insert(transactionToRemove, ['id'])
        .then((transaction) => {
            request(app).get(`${MAIN_ROUTE}/${transaction[0].id}`)
                .set('authorization', `bearer ${user1.token}`)
                .then((response) => {
                    expect(response.status).toBe(403);
                    expect(response.body).toHaveProperty('error', 'Este recurso não pertence ao usuário');
                });
        });
});

test('should not update a transaction from another user', () => {
    const transactionToRemove = {
        description: 'T9',
        date: new Date(),
        ammount: 350,
        type: 'O',
        acc_id: account2.id,
    };

    return app.db('transactions')
        .insert(transactionToRemove, ['id'])
        .then((transaction) => {
            request(app).put(`${MAIN_ROUTE}/${transaction[0].id}`)
                .set('authorization', `bearer ${user1.token}`)
                .send({ description: 'T9 Updated' })
                .then((response) => {
                    expect(response.status).toBe(403);
                    expect(response.body).toHaveProperty('error', 'Este recurso não pertence ao usuário');
                });
        });
});

test('should not remove a transaction from another user', () => {
    const transactionToRemove = {
        description: 'T10',
        date: new Date(),
        ammount: 350,
        type: 'O',
        acc_id: account2.id,
    };

    return app.db('transactions')
        .insert(transactionToRemove, ['id'])
        .then((transaction) => {
            request(app).delete(`${MAIN_ROUTE}/${transaction[0].id}`)
                .set('authorization', `bearer ${user1.token}`)
                .then((response) => {
                    expect(response.status).toBe(403);
                    expect(response.body).toHaveProperty('error', 'Este recurso não pertence ao usuário');
                });
        });
});
