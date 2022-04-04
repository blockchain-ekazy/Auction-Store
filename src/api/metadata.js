const router = require("express").Router();

const { get_metadata_by_id } = require("./getItems");

router.get("/metadata/:id", get_metadata_by_id);
module.exports = router;
