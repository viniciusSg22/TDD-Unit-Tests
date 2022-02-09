const request = require('supertest');

const app = require("../../src/app");
const truncate = require('../utils/truncate');
const factory = require("../factories");

describe('Authentication', () => {
    beforeEach(async () => {
        await truncate();
    });
    // it('should recive JWT token when authenticated with valid credentials', () => {})

    // it('should sum two numbers', () => {
    //     const x = 2
    //     const y = 4

    //     const sum = x + y

    //     expect(sum).toBe(6);
    // })

    // it('should register a user', async () => {
    //     const user = await User.create({
    //         name: 'zezinho',
    //         email: 'zezinho@gmail.com',
    //         password_hash: '12345678'
    //     })

    //     console.log(user)

    //     expect(user.email).toBe('zezinho@gmail.com')
    // })
    it('should authenticate with valid credentials', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response = await request(app)
            .post('/sessions').send({
                email: user.email,
                password: '123123'
            });

        expect(response.status).toBe(200)
    });

    it('should not authenticate with invalid credentials', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response = await request(app)
            .post('/sessions').send({
                email: user.email,
                password: '123456'
            });

        expect(response.status).toBe(401)
    });

    it('should return JWT token when authenticated', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response = await request(app)
            .post('/sessions').send({
                email: user.email,
                password: '123123'
            });

        expect(response.body).toHaveProperty('token');
    })

    it('should be able to access private routes when authenticated', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })

        const response = await request(app)
            .get('/dashboard').set('Authorization', `Bearer ${user.generateToken()}`)

        expect(response.status).toBe(200);
    })
    it('should not be able to access private routes without jwt token', async () => {
        const response = await request(app).get('/dashboard');

        expect(response.status).toBe(401);
    })

    it('should not be able to access private routes with invalid jwt token', async () => {
        const response = await request(app).get('/dashboard').set('Authorization', `Bearer 123`);

        expect(response.status).toBe(401);
    })
});