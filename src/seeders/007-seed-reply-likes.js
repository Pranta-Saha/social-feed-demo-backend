import { v4 as uuidv4 } from 'uuid';

export const up = async (queryInterface, Sequelize) => {
  // Get all replies and users
  const replies = await queryInterface.sequelize.query(
    'SELECT id FROM "Replies"',
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const users = await queryInterface.sequelize.query(
    'SELECT id FROM "Users"',
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  if (replies.length === 0 || users.length === 0) {
    console.warn('No replies or users found. Skipping reply likes seeding.');
    return;
  }

  const replyIds = replies.map(r => r.id);
  const userIds = users.map(u => u.id);
  const replyLikes = [];
  const usedCombinations = new Set();

  // Create reply likes with unique userId-replyId combinations
  for (let i = 0; i < Math.min(replyIds.length * userIds.length, 20); i++) {
    let replyId, userId, combination;
    let attempts = 0;

    do {
      replyId = replyIds[Math.floor(Math.random() * replyIds.length)];
      userId = userIds[Math.floor(Math.random() * userIds.length)];
      combination = `${replyId}-${userId}`;
      attempts++;
    } while (usedCombinations.has(combination) && attempts < 10);

    if (!usedCombinations.has(combination)) {
      usedCombinations.add(combination);
      replyLikes.push({
        id: uuidv4(),
        replyId,
        userId,
        createdAt: new Date(),
      });
    }
  }

  return queryInterface.bulkInsert('ReplyLikes', replyLikes);
};

export const down = (queryInterface, Sequelize) => {
  return queryInterface.bulkDelete('ReplyLikes', null, {});
};
