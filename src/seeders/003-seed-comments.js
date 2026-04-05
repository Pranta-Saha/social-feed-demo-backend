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
    console.warn("No posts or users found. Skipping comments seeding.");
    return;
  }

  const postIds = posts.map((p) => p.id);
  const userIds = users.map((u) => u.id);
  const comments = [];

  // Create comments on posts
  for (let i = 0; i < 20; i++) {
    comments.push({
      id: uuidv4(),
      content: `This is a comment on post #${i + 1}. ${["Great post!", "I totally agree!", "Interesting perspective!", "Thanks for sharing!", "Well said!"][i % 5]}`,
      postId: postIds[i % postIds.length],
      authorId: userIds[i % userIds.length],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  }

  return queryInterface.bulkInsert("Comments", comments);
};

export const down = (queryInterface, Sequelize) => {
  return queryInterface.bulkDelete("Comments", null, {});
};
