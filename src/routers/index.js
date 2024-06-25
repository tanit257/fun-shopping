"use strict";

const express = require("express");
const { apiKey, checkPermission, asyncHandler } = require("../auth/checkAuth");
const { NotFoundError } = require("../core/error.response");

const router = express.Router();

//check apiKey
router.use(asyncHandler(apiKey));
//check Permission

// router.use(asyncHandler(checkPermission("WRITE")));

router.use("/v1/api", require("./access"));
// router.get('', (req, res) => {
//     const strCompress = 'Hello World';
//     res.status(200).json({message:'Hello from server side', app:'Natours',metadata: strCompress.repeat(10000)});
// })



// router.post('/', (req, res) => {
//     res.status(200).json({ message: 'Hello from server side', app: 'Natours' });
// });

module.exports = router;
