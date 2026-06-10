const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = 5000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/users') {
    req.body.createdAt = new Date().toISOString();
    req.body.isActive = true;
  }
  next();
});

server.use('/api', router);

server.listen(port, () => {
  console.log(`JSON Server running on port ${port}`);
});