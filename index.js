const { Sequelize, DataTypes } = require("sequelize");
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/bookmarks2"
);

const express = require("express");
const app = express();

const Bookmarks = db.define("bookmark", {
  name: DataTypes.STRING,
  url: DataTypes.STRING,
});

const Category = db.define("category", {
  name: DataTypes.STRING,
  count: DataTypes.INTEGER,
});

Bookmarks.belongsTo(Category);
Category.hasMany(Bookmarks);

const syncAndSeed = async () => {
  console.log("test");
  await db.sync({ force: true });
  const [entertainment, news, job] = await Promise.all(
    ["Entertainment", "News", "Job"].map((category) =>
      Category.create({ name: category })
    )
  );
  Bookmarks.bulkCreate([
    {
      name: "Netflix",
      url: "netflix.com",
      categoryId: entertainment.id,
    },
    {
      name: "Hulu",
      url: "hulu.com",
      categoryId: entertainment.id,
    },
    {
      name: "NYtimes",
      url: "nytimes.com",
      categoryId: news.id,
    },
    {
      name: "LinkedIn",
      url: "linkedin.com",
      categoryId: job.id,
    },
  ]);
};

syncAndSeed();

module.exports = {
  models: {
    Bookmarks,
    Category,
  },
};
