import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export const up = async (queryInterface, Sequelize) => {
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password456', 10);
  const hashedPassword3 = await bcrypt.hash('password789', 10);
  const hashedPassword4 = await bcrypt.hash('password000', 10);
  const hashedPassword5 = await bcrypt.hash('password111', 10);

  return queryInterface.bulkInsert('Users', [
    {
      id: uuidv4(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: hashedPassword1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: hashedPassword2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      password: hashedPassword3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      firstName: 'Alice',
      lastName: 'Williams',
      email: 'alice.williams@example.com',
      password: hashedPassword4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie.brown@example.com',
      password: hashedPassword5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down = (queryInterface, Sequelize) => {
  return queryInterface.bulkDelete('Users', null, {});
};
