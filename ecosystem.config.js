module.exports = {
  apps: [
    {
      name: 'openlaunch-api',
      cwd: './apps/api',
      script: 'dist/main.js',
      watch: false,
    },
    {
      name: 'openlaunch-web',
      cwd: './apps/web',
      script: './start.sh',
    }
  ],
};
