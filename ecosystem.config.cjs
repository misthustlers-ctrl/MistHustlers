const path = require("path");

module.exports = {
  apps: [
    {
      name: "misthustlers",
      cwd: __dirname,
      script: path.join(__dirname, "backend", "server.js"),
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "450M",
      env: {
        NODE_ENV: "production",
        PORT: 9000,
        HOST: "127.0.0.1",
        TRUST_PROXY: "loopback",
      },
    },
  ],
};
