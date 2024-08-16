// // test/mock-factories.ts

// import { Todo } from '@prisma/client';
// import { User } from '@/lib/types';

// export const createMockUser = (override: Partial<User> = {}): User => ({
//   id: 1,
//   name: 'John Doe',
//   email: 'john@example.com',
//   avatar: null, // デフォルト値として null を設定
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   ...override,
// });

// export const createMockTodo = (override: Partial<Todo> = {}): Todo => ({
//   id: 1,
//   title: 'Test Todo',
//   userId: 1,
//   ...override,
// });
