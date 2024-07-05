const router = require("express").Router();
const categoryController = require('../controllers/category_controller')
const upload = require('../middlewares/Upload');

router.post("/create", upload,categoryController.create);
router.get("/all", categoryController.getAll);
router.put("/update/:id", upload, categoryController.update);
router.get("/details/:id", categoryController.details);
router.delete("/delete/:id", categoryController.deleteController);

module.exports = router;