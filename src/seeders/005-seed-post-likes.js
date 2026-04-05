import { v4 as uuidv4 } from "uuid";

export const up = async (queryInterface, Sequelize) => {
  // Get all posts and users
  const posts = await queryInterface.sequelize.query('SELECT id FROM "Posts"', {
    type: queryInterface.sequelize.QueryTypes.SELECT,
  });

  const users = await queryInterface.sequelize.query('SELECT id FROM "Users"', {
    type: queryInterface.sequelize.QueryTypes.SELECT,
  });

  if (posts.length === 0 || users.length === 0) {
    console.warn("No posts or users found. Skipping post likes seeding.");
    return;
  }

  const postIds = posts.map((p) => p.id);
  const userIds = users.map((u) => u.id);
  const postLikes = [];
  const usedCombinations = new Set();

  // Create post likes with unique userId-postId combinations
  for (let i = 0; i < Math.min(postIds.length * userIds.length, 30); i++) {
    let postId, userId, combination;
    let attempts = 0;

    do {
      postId = postIds[Math.floor(Math.random() * postIds.length)];
      userId = userIds[Math.floor(Math.random() * userIds.length)];
      combination = `${postId}-${userId}`;
      attempts++;
    } while (usedCombinations.has(combination) && attempts < 10);

    if (!usedCombinations.has(combination)) {
      usedCombinations.add(combination);
      postLikes.push({
        id: uuidv4(),
        postId,
        userId,
        createdAt: new Date(),
      });
    }
  }

  return queryInterface.bulkInsert("PostLikes", postLikes);
};

export const down = (queryInterface, Sequelize) => {
  return queryInterface.bulkDelete("PostLikes", null, {});
};
