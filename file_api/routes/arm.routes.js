// Create a new Router //
const {Router} = require("express");
const armController = require("../controllers/arm.controller");
const router = Router();

// router.post("/new", eventController.post);
router.post("/arm-home", armController.arm_home);
router.get("/disarm-home", armController.disarm_home);

module.exports = router;