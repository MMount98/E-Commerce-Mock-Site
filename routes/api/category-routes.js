const router = require("express").Router();
const { Category, Product } = require("../../models");

//ROUTES

// `http://localhost:3001/api/categories/`  GET - All categories
router.get("/", async (req, res) => {
  //Gets a category by id with product key
  try {
    const categoriesData = await Category.findAll({
      include: [{ model: Product }],
    });
    //checks to see if category exist
    res.status(200).json(categoriesData);
  } catch (err) {
    //gives server err
    res.status(500).json(err);
  }
});

// `http://localhost:3001/api/categories/{userInput}`  GET - Specfic Category
router.get("/:id", async (req, res) => {
  //Gets a Category by id with product
  try {
    const categoriesData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    //Checks to see if Category exist
    if (!categoriesData) {
      res.status(404).json({ message: "No category found!" });
      return;
    }
    //responds with given category
    res.status(200).json(categoriesData);
  } catch (err) {
    //gives server err
    res.status(500).json(err);
  }
});

// `http://localhost:3001/api/categories/`   POST - New Category
router.post("/", async (req, res) => {
  // create a new category
  try {
    const categoriesData = await Category.create({
      category_name: req.body.category_name,
    });
    //responds with new category
    res.status(200).json(categoriesData);
  } catch (err) {
    //responds with server err
    res.status(400).json(err);
  }
});

// `http://localhost:3001/api/categories/{userInput}`  PUT - Update Category
router.put("/:id", async (req, res) => {
  // Updates a category by id value
  try {
    const categoriesData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    //Checks to see if give id exist in database
    if (!categoriesData[0]) {
      res.status(404).json({ message: "No category Found!" });
      return;
    }
    //Responds with Confrimation and status
    res.status(200).json("Category was Updated!");
  } catch (err) {
    //Responds with server error code
    res.status(500).json(err);
  }
});

// `http://localhost:3001/api/categories/{userInput}`  DELETE - a Category
router.delete("/:id", async (req, res) => {
  //Deletes category by Id
  try {
    const categoriesData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    //Checks to see if give id exist in database
    if (!categoriesData) {
      res.status(404).json({ message: "No Category found!" });
      return;
    }

    //Responds with Confrimation and status
    res.status(200).json("Category Was Deleted!");
  } catch (err) {
    //Responds with server error code
    res.status(500).json(err);
  }
});

module.exports = router;
