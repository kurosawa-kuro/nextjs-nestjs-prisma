// src/users/user.model.spec.ts

import { validate } from 'class-validator';
import { CreateUser, UpdateUser } from '@/models/user.model';

describe('User Model', () => {
  describe('CreateUser', () => {
    it('should pass validation with valid data', async () => {
      const user = new CreateUser();
      user.name = 'John Doe';
      user.email = 'john@example.com';
      user.password = 'Password123!';

      const errors = await validate(user);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid name', async () => {
      const user = new CreateUser();
      user.name = 'J'; // Invalid: less than 2 characters
      user.email = 'john@example.com';
      user.password = 'Password123!';

      const errors = await validate(user);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation with invalid email', async () => {
      const user = new CreateUser();
      user.name = 'John Doe';
      user.email = 'invalid-email'; // Invalid: not an email format
      user.password = 'Password123!';

      const errors = await validate(user);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with short password', async () => {
      const user = new CreateUser();
      user.name = 'John Doe';
      user.email = 'john@example.com';
      user.password = 'Pass1!'; // Invalid: less than 8 characters

      const errors = await validate(user);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should fail validation with password missing uppercase', async () => {
      const user = new CreateUser();
      user.name = 'John Doe';
      user.email = 'john@example.com';
      user.password = 'password123!'; // Invalid: missing uppercase

      const errors = await validate(user);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should fail validation with password missing lowercase', async () => {
      const user = new CreateUser();
      user.name = 'John Doe';
      user.email = 'john@example.com';
      user.password = 'PASSWORD123!'; // Invalid: missing lowercase

      const errors = await validate(user);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should fail validation with password missing number', async () => {
      const user = new CreateUser();
      user.name = 'John Doe';
      user.email = 'john@example.com';
      user.password = 'PasswordABC!'; // Invalid: missing number

      const errors = await validate(user);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should fail validation with password missing special character', async () => {
      const user = new CreateUser();
      user.name = 'John Doe';
      user.email = 'john@example.com';
      user.password = 'Password123'; // Invalid: missing special character

      const errors = await validate(user);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });
  });

  describe('UpdateUser', () => {
    it('should allow partial updates', async () => {
      const user = new UpdateUser();
      user.name = 'John Doe'; // Only updating name

      const errors = await validate(user);
      expect(errors.length).toBe(0);
    });

    it('should still validate provided fields', async () => {
      const user = new UpdateUser();
      user.email = 'invalid-email'; // Invalid: not an email format

      const errors = await validate(user);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });
  });
});
