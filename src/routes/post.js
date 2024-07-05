const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');
// const file =  require('../files')
//Upload
const { getPlaiceholder } = require("plaiceholder");
//multer--------------------------------------------
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get('/all', postController.getAll);
router.get('/documents', postController.getDocuments);
router.get('/document_category', postController.getDocumentCategory);
router.get('/documents_checked', postController.getDocumentsChecked);
router.get('/all_document', postController.getAllDocument);
router.get('/all_document_new', postController.getAllDocumentNew);
router.get('/all_document_view', postController.getAllDocumentView);
router.get('/all_document_pending', postController.getAllDocumentPending);
router.get('/all_document_pending_over', postController.getAllDocumentPendingOver);
router.get('/all_document_checked', postController.getAllDocumenChecked);
router.get('/all_document_name', postController.getAllDocumentName);
router.get('/details/:id', postController.getDetails);
router.post('/', upload.single("file"), postController.create);
router.put('/:id', upload.single("file"), postController.update);
router.put('/updatedStatus/:id', postController.updateStatusPost);
router.patch('/updatedView/:id', postController.updateViewPost);
router.delete('/:id', postController.deletePost);

module.exports = router;
