const express = require("express");
const router = express.Router();
const { catchErrors } = require("./errorHandlers");

const testDataController = require("./testData.controller");

//Deal with creation and destruction of test data
router.get(
  "/delete",
  testDataController.isDevEnvironment,
  catchErrors(testDataController.deleteTestData)
);
router.get(
  "/create",
  testDataController.isDevEnvironment,
  catchErrors(testDataController.createTestData)
);
module.exports = router;
