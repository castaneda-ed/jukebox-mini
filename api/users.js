const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: +id },
      include: { playlists: true },
    });
    if (user) {
      res.json(user);
    } else {
      next({ status: 404, message: `User with id: ${id} does not exist` });
    }
  } catch (e) {
    next(e);
  }
});

router.post("/:id/playlists", async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return next({
      status: 404,
      message: "Provid a name and description for the playlist",
    });
  }
  try {
    const playlist = await prisma.playlist.create({
      data: { name, description, ownerId: +id },
    });
    res.status(201).json(playlist);
  } catch (e) {
    next(e);
  }
});
