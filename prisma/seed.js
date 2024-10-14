const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");
const seed = async (numUsers = 5, numPlaylists = 5) => {
  for (let i = 0; i < numUsers; i++) {
    const username = faker.internet.userName();

    const playlists = Array.from({ length: numPlaylists }, (_, j) => {
      const playlistName = faker.music.genre();
      const description = faker.commerce.productDescription();
      return {
        name: playlistName,
        description,
      };
    });

    await prisma.user.create({
      data: {
        username,
        playlists: {
          create: playlists,
        },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
