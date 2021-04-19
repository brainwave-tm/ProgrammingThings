// Create a new Router //
const {Router} = require("express");
const feedController = require("../controllers/feed.controller");
const router = Router();

router.get("/recent", feedController.recent);

module.exports = router;