import 'dotenv/config';
import prisma from '../src/lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@proodos.app' },
    update: {},
    create: {
      email: 'demo@proodos.app',
      name: 'Demo User',
      passwordHash,
      roadmaps: {
        create: {
          title: 'Full Stack Development',
          description: 'Mastering modern web development from frontend to backend.',
          categories: {
            create: [
              {
                name: 'Frontend',
                order: 1,
                skills: {
                  create: [
                    { title: 'HTML', order: 1, status: 'COMPLETED', resourceUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
                    { title: 'CSS', order: 2, status: 'COMPLETED', resourceUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
                    { title: 'JavaScript', order: 3, status: 'IN_PROGRESS', resourceUrl: 'https://javascript.info' },
                    { title: 'TypeScript', order: 4, resourceUrl: 'https://www.typescriptlang.org/docs/' },
                    { title: 'React', order: 5, resourceUrl: 'https://react.dev' },
                  ]
                }
              },
              {
                name: 'Backend',
                order: 2,
                skills: {
                  create: [
                    { title: 'Node.js', order: 1, resourceUrl: 'https://nodejs.org/docs/' },
                    { title: 'Express.js', order: 2, resourceUrl: 'https://expressjs.com' },
                    { title: 'NestJS', order: 3, resourceUrl: 'https://docs.nestjs.com' },
                  ]
                }
              },
              {
                name: 'Database',
                order: 3,
                skills: {
                  create: [
                    { title: 'PostgreSQL', order: 1 },
                    { title: 'Prisma', order: 2 },
                  ]
                }
              },
              {
                name: 'DevOps',
                order: 4,
                skills: {
                  create: [
                    { title: 'Git', order: 1, status: 'COMPLETED' },
                    { title: 'Docker', order: 2 },
                    { title: 'CI/CD', order: 3 },
                  ]
                }
              }
            ]
          }
        }
      }
    }
  });

  console.log('Database seeded successfully! Demo user:', user.email);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
