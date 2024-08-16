import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    password: bcrypt.hashSync('password123', 10),
    todos: {
      create: [
        { title: 'Buy groceries' },
        { title: 'Clean the house' },
      ],
    },
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    password: bcrypt.hashSync('password456', 10),
    todos: {
      create: [
        { title: 'Finish project report' },
        { title: 'Call mom' },
      ],
    },
  },
];

const categoryData: Prisma.CategoryCreateInput[] = [
  { title: 'Work' },
  { title: 'Personal' },
  { title: 'Shopping' },
  { title: 'Health' },
];

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data
  await prisma.categoryTodo.deleteMany();
  await prisma.todo.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create users and their todos
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }

  // Create categories
  for (const c of categoryData) {
    const category = await prisma.category.create({
      data: c,
    });
    console.log(`Created category with id: ${category.id}`);
  }

  // Assign categories to todos
  const todos = await prisma.todo.findMany();
  const categories = await prisma.category.findMany();

  for (const todo of todos) {
    // Randomly assign 1-2 categories to each todo
    const numCategories = Math.floor(Math.random() * 2) + 1;
    const selectedCategories = categories
      .sort(() => 0.5 - Math.random())
      .slice(0, numCategories);

    for (const category of selectedCategories) {
      await prisma.categoryTodo.create({
        data: {
          todoId: todo.id,
          categoryId: category.id,
        },
      });
      console.log(`Assigned category ${category.id} to todo ${todo.id}`);
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });