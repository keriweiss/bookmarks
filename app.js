const {
  db,
  models: { Bookmarks, Category },
} = require("./index");

const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(require("method-override")("_method"));
app.use(express.urlencoded({ extended: false }));

// const count = (id) => {
//   debugger;
//   return Bookmarks.findAndCountAll({
//     where: { categoryId: id },
//   });
// };

app.get("/", async (req, res, next) => {
  try {
    // const bookmarks = await Bookmarks.findAll({
    //   include: Category,
    // });
    let theCount;
    const test2 = async (id) => {
      const count = await Bookmarks.findAndCountAll({
        where: { categoryId: 1 },
      }).then((result) => {
        theCount = result;
      });
      return count();
    };
    test2();
    console.log(test2());
    const category = await Category.findAll({
      include: [Bookmarks],
    });
    const count = await Bookmarks.findAndCountAll({
      where: { categoryId: 1 },
    });
    // .then((result) => (idid = result));
    const content = `<!DOCTYPE html>
    <html>
        <head></head>
        <body>
        <h1>Bookmarks</h1>
        <div>
        <h2>Add A Bookmark</h2>
        <form method='POST' action='/?_method=POST'>
        Category: 
        <select name = 'category'>${category.map(
          (category) => `<option value=${category.id}>${category.name}</option>`
        )}</select>
        Bookmark Name: <input name = 'name' /> Bookmark URL: <input name = 'url' />
        <button>Save</button>
        </form>
        </div>
        <div>
        <h2>Categories</h2>
        ${category
          .map(
            (cat) =>
              `<li><a href ='/category/${cat.id}'>${cat.name}</a>(${cat.bookmarks.length})</li>`
          )
          .join("")}
        </div>
        </body>
        </html

    `;
    res.send(content);
  } catch (err) {
    next(err);
  }
});

app.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const { category, name, url } = req.body;
    Bookmarks.create({
      name: name,
      url: url,
      categoryId: category,
    });
    res.redirect("/");
  } catch (err) {
    newxt(err);
  }
});

app.get("/category/:id", async (req, res, next) => {
  try {
    const detail = await Bookmarks.findAll({
      where: { categoryId: req.params.id },
    });
    const content = `<!DOCTYPE html>
    <html>
    <head></head>
    <body>
    <nav><a href='/'>Home</a></nav>
    <div>
    ${detail
      .map(
        (bookmark) =>
          `<p>${bookmark.name}<form method="POST" action="/category/${bookmark.categoryId}?_method=DELETE"><button name="purchase" value ="${bookmark.id}">x</button></form></p>`
      )
      .join("")}
    </div>
    </body>
    </html>
    `;
    res.send(content);
  } catch (err) {
    next(err);
  }
});

app.delete("/category/:id", async (req, res, next) => {
  try {
    const bookmark = await Bookmarks.findByPk(req.body.purchase);
    await bookmark.destroy();
    res.redirect(`/category/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 1337;

app.listen(port, () => console.log(`listening in port ${port}`));
