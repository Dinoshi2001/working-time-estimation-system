const express = require("express");
const router = express.Router();
const { saveSettings, getAllSettings } = require("../controllers/settingsController");

router.post("/", saveSettings);       
router.get("/", getAllSettings);      

module.exports = router;
