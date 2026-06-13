const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = 5000;

// Body parser middleware (already there)
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom middleware to ensure images array is preserved
server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/products') {
    if (req.body.images && !Array.isArray(req.body.images)) {
      req.body.images = [];
    }
  }
  next();
});

server.use('/api', router);
server.use(router); // Add this for direct access

server.listen(port, () => {
  console.log(`JSON Server running on port ${port}`);
});