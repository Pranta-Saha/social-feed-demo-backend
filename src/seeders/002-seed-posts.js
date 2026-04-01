import { v4 as uuidv4 } from 'uuid';

export const up = async (queryInterface, Sequelize) => {
  // Get all users first
  const users = await queryInterface.sequelize.query(
    'SELECT id FROM "Users"',
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  if (users.length === 0) {
    console.warn('No users found. Skipping posts seeding.');
    return;
  }

  const userIds = users.map(u => u.id);
  const posts = [];

  // Create posts with different authors
  for (let i = 0; i < 15; i++) {
    posts.push({
      id: uuidv4(),
      content: `This is sample post #${i + 1}. ${['Check out this amazing feature!', 'Just started a new project!', 'Learning new technologies today.', 'Building something cool.', 'Great day for coding!'][i % 5]}`,
      image: null,
      isPrivate: i % 7 === 0, // Mark some as private
      authorId: userIds[i % userIds.length],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  }

  return queryInterface.bulkInsert('Posts', posts);
};

export const down = (queryInterface, Sequelize) => {
  return queryInterface.bulkDelete('Posts', null, {});
};
