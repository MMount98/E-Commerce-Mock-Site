const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

//http://localhost:3001/api/tags
router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    //checks to see if category exist
    res.status(200).json(tagData);
  } catch (err) {
    //gives server err
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });
    //Checks to see if requested Tag exist
    if (!tagData) {
      res.status(404).json({ message: "No Tags found!" });
      return;
    }
    //responds with requested Tag
    res.status(200).json(tagData);
  } catch (err) {
    //gives server err
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const tagData = await Tag.create({
      tag_name: req.body.tag_name,
    });
    //responds with new category
    res.status(200).json(tagData);
  } catch (err) {
    //responds with server err
    res.status(400).json(err);
  }
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
