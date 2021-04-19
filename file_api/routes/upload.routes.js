// Create a new Router //
const {Router} = require("express");
const uploadController = require("../controllers/upload.controller");
const router = Router();

router.post("/upload", uploadController.upload);

module.exports = router;