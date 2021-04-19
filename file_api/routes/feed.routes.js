// Create a new Router //
const {Router} = require("express");
const feedController = require("../controllers/feed.controller");
const router = Router();

router.get("/recent-faces", feedController.recent_faces);

module.exports = router;