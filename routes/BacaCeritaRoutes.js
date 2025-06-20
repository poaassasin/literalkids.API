const express = require("express");
const router = express.Router();
const bacaCeritaController = require("../controllers/BacaCeritaController");

const getAllCerita = bacaCeritaController.getAllCerita;
const getCeritaById = bacaCeritaController.getCeritaById;
const getPagesByStoryId = bacaCeritaController.getPagesByStoryId;

router.get("/", getAllCerita);
router.get("/:id", getCeritaById);
router.get("/:story_id/pages", getPagesByStoryId);

module.exports = router;
