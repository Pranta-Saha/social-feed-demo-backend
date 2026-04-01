import { v4 as uuidv4 } from 'uuid';

export const up = async (queryInterface, Sequelize) => {
  // Get all comments and users
  const comments = await queryInterface.sequelize.query(
    'SELECT id FROM "Comments"',
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const users = await queryInterface.sequelize.query(
    'SELECT id FROM "Users"',
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  if (comments.length === 0 || users.length === 0) {
    console.warn('No comments or users found. Skipping replies seeding.');
    return;
  }

  const commentIds = comments.map(c => c.id);
  const userIds = users.map(u => u.id);
  const replies = [];

  // Create replies on comments
  for (let i = 0; i < 15; i++) {
    replies.push({
      id: uuidv4(),
      content: `This is a reply to comment #${i + 1}. ${['Exactly!', 'You nailed it!', 'I couldn\'t agree more!', 'Great point!', 'Absolutely!'][i % 5]}`,
      commentId: commentIds[i % commentIds.length],
      authorId: userIds[i % userIds.length],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  }

  return queryInterface.bulkInsert('Replies', replies);
};

export const down = (queryInterface, Sequelize) => {
  return queryInterface.bulkDelete('Replies', null, {});
};
