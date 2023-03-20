const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

//http://localhost:3001/api/products/
router.get("/", async (req, res) => {
  // finds all products from SQL server
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    //Sends back clear status and the all the product data
    res.status(200).json(productData);
  } catch (err) {
    //gives server err if no res is given from SQL server
    res.status(500).json(err);
  }
});

//http://localhost:3001/api/products/{userInput}
router.get("/:id", async (req, res) => {
  // finds a single product by the given `id`
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    //Checks to see if requested product exist
    if (!productData) {
      res.status(404).json({ message: "No Product found!" });
      return;
    }
    //responds with clear status and the requested product data
    res.status(200).json(productData);
  } catch (err) {
    //gives server err if no res is given from SQL sever
    res.status(500).json(err);
  }
});

//http://localhost:3001/api/products/{userInput}
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

//http://localhost:3001/api/products/{userInput}
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

//http://localhost:3001/api/products/{userInput}
router.delete("/:id", async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    //Checks to see if given id exist in database
    if (!productData) {
      res.status(404).json({ message: "No Product found!" });
      return;
    }

    //Responds with Confrimation and status
    res.status(200).json("Product Was Deleted!");
  } catch (err) {
    //Responds with server error code
    res.status(500).json(err);
  }
});

module.exports = router;
