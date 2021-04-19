// Create a new Router //
const {Router} = require("express");
const eventController = require("../controllers/event.controller");
const router = Router();

router.post("/new", eventController.post);
router.get("/", eventController.get);

module.exports = router;