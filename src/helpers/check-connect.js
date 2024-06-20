"use strict";

const mongose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 5000;

const countConnect = () => {
  const numConnection = mongose.connections.length;
  console.log(`Number of Connection: ${numConnection}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = numCores * 5;

    console.log(`Active connection: ${numConnection}`);
    console.log(`Memory Usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log(`Connection overload dectected!`);
      // Send notify
    }
  }, _SECOND);
};

module.exports = {
  countConnect,
  checkOverload,
};
