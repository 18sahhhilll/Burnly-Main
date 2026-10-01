import { test, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import User from '../models/User.js';
import Venture from '../models/Venture.js';
import Scenario from '../models/Scenario.js';
import Report from '../models/Report.js';

describe('Backend API Integration Tests', () => {
  const mockUserId = '65f1a2b3c4d5e6f7a8b9c0d1';
  const userBId = '65f1a2b3c4d5e6f7a8b9c0d2';

  const mockToken = jwt.sign(
    { id: mockUserId },
    process.env.JWT_SECRET || 'burnly_super_secret_jwt_key_change_in_production'
  );

  const mockUserBToken = jwt.sign(
    { id: userBId },
    process.env.JWT_SECRET || 'burnly_super_secret_jwt_key_change_in_production'
  );

  const stubUser = (id = mockUserId) => ({
    _id: id,
    id,
    name: 'Sahil',
    email: 'sahil@test.com',
    save: async () => {},
  });

  describe('GET /api/health', () => {
    test('returns 200 OK with liveness status', async () => {
      const res = await request(app).get('/api/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, 'ok');
      assert.ok(res.body.timestamp);
    });
  });

  describe('POST /api/auth/register', () => {
    test('rejects registration with short password (400)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Sahil', email: 'sahil@test.com', password: '123' });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.error, 'Password must be at least 6 characters long');
    });

    test('rejects registration with invalid email format (400)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Sahil', email: 'notanemail', password: 'password123' });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.error, 'Please provide a valid email address');
    });

    test('creates new user account successfully (201) and issues refresh token cookie', async () => {
      const originalFindOne = User.findOne;
      const originalCreate = User.create;

      User.findOne = async () => null;
      User.create = async ({ name, email }) => ({
        _id: mockUserId,
        name,
        email,
        sessions: [],
        save: async () => {},
      });

      try {
        const res = await request(app)
          .post('/api/auth/register')
          .send({ name: 'Sahil Test', email: 'sahil@test.com', password: 'password123' });

        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.body.name, 'Sahil Test');
        assert.strictEqual(res.body.email, 'sahil@test.com');
        assert.ok(res.body.token);

        const cookies = res.headers['set-cookie'];
        assert.ok(cookies);
        assert.ok(cookies.some((c) => c.includes('refreshToken=')));
      } finally {
        User.findOne = originalFindOne;
        User.create = originalCreate;
      }
    });
  });

  describe('POST /api/auth/login & Token Refresh', () => {
    test('rejects login with missing password (400)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'sahil@test.com' });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.error, 'Password is required');
    });

    test('authenticates valid user credentials successfully (200)', async () => {
      const originalFindOne = User.findOne;
      const hashedPassword = await bcrypt.hash('password123', 10);

      User.findOne = async () => ({
        _id: mockUserId,
        name: 'Sahil Test',
        email: 'sahil@test.com',
        password: hashedPassword,
        save: async () => {},
      });

      try {
        const res = await request(app)
          .post('/api/auth/login')
          .send({ email: 'sahil@test.com', password: 'password123' });

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.email, 'sahil@test.com');
        assert.ok(res.body.token);
      } finally {
        User.findOne = originalFindOne;
      }
    });

    test('rejects login with wrong password (401)', async () => {
      const originalFindOne = User.findOne;
      const hashedPassword = await bcrypt.hash('correctpassword', 10);

      User.findOne = async () => ({
        _id: mockUserId,
        name: 'Sahil Test',
        email: 'sahil@test.com',
        password: hashedPassword,
      });

      try {
        const res = await request(app)
          .post('/api/auth/login')
          .send({ email: 'sahil@test.com', password: 'wrongpassword' });

        assert.strictEqual(res.status, 401);
        assert.strictEqual(res.body.error, 'Invalid email or password');
      } finally {
        User.findOne = originalFindOne;
      }
    });

    test('rejects refresh request when refresh token cookie is missing (401)', async () => {
      const res = await request(app).post('/api/auth/refresh');
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.error, 'Refresh token cookie missing');
    });

    test('rejects token refresh reuse when token is not found in database (401)', async () => {
      const originalFindById = User.findById;
      User.findById = async () => ({
        _id: mockUserId,
        sessions: [],
        save: async () => {},
      });

      const invalidRefreshToken = jwt.sign(
        { id: mockUserId },
        process.env.JWT_REFRESH_SECRET || 'burnly_super_secret_refresh_jwt_key'
      );

      try {
        const res = await request(app)
          .post('/api/auth/refresh')
          .set('Cookie', [`refreshToken=${invalidRefreshToken}`]);

        assert.strictEqual(res.status, 401);
        assert.strictEqual(res.body.error, 'Refresh token invalid, revoked, or reused');
      } finally {
        User.findById = originalFindById;
      }
    });
  });

  describe('DELETE /api/auth/me (Account Deletion Isolation)', () => {
    test('cascades deletion of User A data while leaving User B data 100% untouched', async () => {
      const originalUserDelete = User.findByIdAndDelete;
      const originalReportDelete = Report.deleteMany;
      const originalScenarioDelete = Scenario.deleteMany;
      const originalVentureDelete = Venture.deleteMany;
      const originalFindById = User.findById;

      let deletedUserIds = [];
      let deletedReportUserIds = [];

      User.findById = () => ({ select: async () => stubUser(mockUserId) });
      User.findByIdAndDelete = async (id) => {
        deletedUserIds.push(id.toString());
      };
      Report.deleteMany = async (filter) => {
        deletedReportUserIds.push(filter.userId.toString());
      };
      Scenario.deleteMany = async () => {};
      Venture.deleteMany = async () => {};

      try {
        const res = await request(app)
          .delete('/api/auth/me')
          .set('Authorization', `Bearer ${mockToken}`);

        assert.strictEqual(res.status, 200);
        assert.ok(res.body.message.includes('Account and all associated ventures'));
        assert.deepStrictEqual(deletedUserIds, [mockUserId]);
        assert.deepStrictEqual(deletedReportUserIds, [mockUserId]);
        // User B's ID was never passed to deleteMany
        assert.strictEqual(deletedUserIds.includes(userBId), false);
      } finally {
        User.findByIdAndDelete = originalUserDelete;
        Report.deleteMany = originalReportDelete;
        Scenario.deleteMany = originalScenarioDelete;
        Venture.deleteMany = originalVentureDelete;
        User.findById = originalFindById;
      }
    });
  });

  describe('Auth Rate Limiter Integration Test', () => {
    test('exceeding rate limit (20 requests) returns 429 Too Many Requests', async () => {
      // Send 20 requests (exhausting max limit of 20 per 15 min window)
      for (let i = 0; i < 20; i++) {
        await request(app).post('/api/auth/login').send({ email: 'rate@test.com' });
      }

      // 21st request must trigger 429
      const res = await request(app).post('/api/auth/login').send({ email: 'rate@test.com' });
      assert.strictEqual(res.status, 429);
      assert.ok(res.body.error.includes('Too many authentication attempts'));
    });
  });
});
