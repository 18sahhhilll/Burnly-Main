import { test, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import User from '../models/User.js';
import Venture from '../models/Venture.js';
import Scenario from '../models/Scenario.js';

describe('Venture API & Ownership Integration Tests', () => {
  const userA_id = '65f1a2b3c4d5e6f7a8b9c0a1';
  const userB_id = '65f1a2b3c4d5e6f7a8b9c0b2';

  const tokenA = jwt.sign({ id: userA_id }, process.env.JWT_SECRET || 'burnly_super_secret_jwt_key_change_in_production');
  const tokenB = jwt.sign({ id: userB_id }, process.env.JWT_SECRET || 'burnly_super_secret_jwt_key_change_in_production');

  const stubUser = (id, name) => ({
    _id: id,
    id,
    name,
    email: `${name.toLowerCase()}@test.com`,
  });

  describe('POST /api/ventures', () => {
    test('rejects creation without Bearer token (401)', async () => {
      const res = await request(app).post('/api/ventures').send({ name: 'Fintech Co' });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.error, 'Not authorized, no token provided');
    });

    test('rejects creation with empty venture name (400)', async () => {
      const originalFindById = User.findById;
      User.findById = () => ({ select: async () => stubUser(userA_id, 'UserA') });

      try {
        const res = await request(app)
          .post('/api/ventures')
          .set('Authorization', `Bearer ${tokenA}`)
          .send({ name: '   ' });

        assert.strictEqual(res.status, 400);
        assert.strictEqual(res.body.error, 'Venture name is required');
      } finally {
        User.findById = originalFindById;
      }
    });

    test('creates new venture and default base scenario for User A (201)', async () => {
      const originalFindById = User.findById;
      const originalVentureCreate = Venture.create;
      const originalScenarioCreate = Scenario.create;

      User.findById = () => ({ select: async () => stubUser(userA_id, 'UserA') });

      Venture.create = async (data) => ({
        _id: 'v-101',
        ...data,
      });

      Scenario.create = async (data) => ({
        _id: 's-101',
        ...data,
      });

      try {
        const res = await request(app)
          .post('/api/ventures')
          .set('Authorization', `Bearer ${tokenA}`)
          .send({ name: 'PayFlow India', stage: 'Seed' });

        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.body.name, 'PayFlow India');
        assert.strictEqual(res.body.userId, userA_id);
      } finally {
        User.findById = originalFindById;
        Venture.create = originalVentureCreate;
        Scenario.create = originalScenarioCreate;
      }
    });
  });

  describe('Ownership Isolation Tests (User A vs User B)', () => {
    test('prevents User B from accessing User A\'s venture by ID (404)', async () => {
      const originalFindById = User.findById;
      const originalFindOne = Venture.findOne;

      User.findById = () => ({ select: async () => stubUser(userB_id, 'UserB') });

      // Venture belongs to userA_id, so query with userB_id returns null
      Venture.findOne = async ({ _id, userId }) => {
        if (_id === 'v-101' && userId === userB_id) {
          return null;
        }
        return null;
      };

      try {
        const res = await request(app)
          .get('/api/ventures/v-101')
          .set('Authorization', `Bearer ${tokenB}`);

        assert.strictEqual(res.status, 404);
        assert.strictEqual(res.body.error, 'Venture profile not found or unauthorized');
      } finally {
        User.findById = originalFindById;
        Venture.findOne = originalFindOne;
      }
    });

    test('prevents User B from listing scenarios of User A\'s venture (404)', async () => {
      const originalFindById = User.findById;
      const originalVentureFindOne = Venture.findOne;

      User.findById = () => ({ select: async () => stubUser(userB_id, 'UserB') });
      Venture.findOne = async () => null; // User B does not own venture v-101

      try {
        const res = await request(app)
          .get('/api/scenarios?ventureId=v-101')
          .set('Authorization', `Bearer ${tokenB}`);

        assert.strictEqual(res.status, 404);
        assert.strictEqual(res.body.error, 'Venture profile not found or unauthorized');
      } finally {
        User.findById = originalFindById;
        Venture.findOne = originalVentureFindOne;
      }
    });

    test('prevents User B from deleting User A\'s venture (404)', async () => {
      const originalFindById = User.findById;
      const originalFindOneAndDelete = Venture.findOneAndDelete;

      User.findById = () => ({ select: async () => stubUser(userB_id, 'UserB') });
      Venture.findOneAndDelete = async () => null;

      try {
        const res = await request(app)
          .delete('/api/ventures/v-101')
          .set('Authorization', `Bearer ${tokenB}`);

        assert.strictEqual(res.status, 404);
        assert.strictEqual(res.body.error, 'Venture profile not found or unauthorized');
      } finally {
        User.findById = originalFindById;
        Venture.findOneAndDelete = originalFindOneAndDelete;
      }
    });
  });
});
