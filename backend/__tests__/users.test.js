const request = require('supertest');
const express = require('express');
const usersRoute = require('../routes/users');

const app = express();
app.use(express.json());
app.use('/api/users', usersRoute);

// Mock the database
jest.mock('../database', () => ({
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
}));
const db = require('../database');

// Mock the email sender
jest.mock('../utils/email', () => jest.fn());
const sendEmail = require('../utils/email');


describe('User Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/users/register', () => {
        it('should register a new user and send a verification email', async () => {
            db.findUserByEmail.mockResolvedValue(null);
            const mockNewUser = { id: '1', email: 'test@example.com' };
            db.createUser.mockResolvedValue(mockNewUser);
            db.updateUser.mockResolvedValue({});
            sendEmail.mockResolvedValue();

            const res = await request(app)
                .post('/api/users/register')
                .send({
                    firstName: 'Test',
                    surname: 'User',
                    email: 'test@example.com',
                    password: 'password123',
                    userType: 'Client',
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.msg).toBe('Verification email sent');
            expect(db.findUserByEmail).toHaveBeenCalledWith('test@example.com');
            expect(db.createUser).toHaveBeenCalled();
            expect(sendEmail).toHaveBeenCalled();
        });

        it('should return 400 if user already exists', async () => {
            db.findUserByEmail.mockResolvedValue({ id: '1', email: 'test@example.com' });

            const res = await request(app)
                .post('/api/users/register')
                .send({
                    firstName: 'Test',
                    surname: 'User',
                    email: 'test@example.com',
                    password: 'password123',
                    userType: 'Client',
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.msg).toBe('User already exists');
        });
    });
});
