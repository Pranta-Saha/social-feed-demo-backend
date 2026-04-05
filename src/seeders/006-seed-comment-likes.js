import { v4 as uuidv4 } from "uuid";

export const up = async (queryInterface, Sequelize) => {
  // Get all comments and users
  const comments = await queryInterface.sequelize.query(
    'SELECT id FROM "Comments"',
    { type: queryInterface.sequelize.QueryTypes.SELECT },
  );

  const users = await queryInterface.sequelize.query('SELECT id FROM "Users"', {
    type: queryInterface.sequelize.QueryTypes.SELECT,
  });

  if (comments.length === 0 || users.length === 0) {
    console.warn("No comments or users found. Skipping comment likes seeding.");
    return;
  }

  const commentIds = comments.map((c) => c.id);
  const userIds = users.map((u) => u.id);
  const commentLikes = [];
  const usedCombinations = new Set();

  // Create comment likes with unique userId-commentId combinations
  for (let i = 0; i < Math.min(commentIds.length * userIds.length, 25); i++) {
    let commentId, userId, combination;
    let attempts = 0;

    do {
      commentId = commentIds[Math.floor(Math.random() * commentIds.length)];
      userId = userIds[Math.floor(Math.random() * userIds.length)];
      combination = `${commentId}-${userId}`;
      attempts++;
    } while (usedCombinations.has(combination) && attempts < 10);

    if (!usedCombinations.has(combination)) {
      usedCombinations.add(combination);
      commentLikes.push({
        id: uuidv4(),
        commentId,
        userId,
        createdAt: new Date(),
      });
    }
  }

  return queryInterface.bulkInsert("CommentLikes", commentLikes);
};

export const down = (queryInterface, Sequelize) => {
  return queryInterface.bulkDelete("CommentLikes", null, {});
};
