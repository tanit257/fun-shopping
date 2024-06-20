"use strict";

const express = require("express");

const router = express.Router();

router.use("/v1/api", require("./access"));
// router.get('', (req, res) => {
//     const strCompress = 'Hello World';
//     res.status(200).json({message:'Hello from server side', app:'Natours',metadata: strCompress.repeat(10000)});
// })

// router.post('/', (req, res) => {
//     console.log('ZO',req.body)
//     res.status(200).json({ message: 'Hello from server side', app: 'Natours' });
// });

module.exports = router;
