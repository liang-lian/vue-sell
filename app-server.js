const express = require('express');
const port = 8080;

const app = express();

const router = express.Router();

router.get('/', (req, res, next) => {
  req.url = '/index.html';
  next();
});

app.use(router);

// 数据
const data = require('./data.json');
const seller = data.seller;
const goods = data.goods;
const ratings = data.ratings;

const routes = express.Router();

// 数据接口
routes.get('/goods', (req, res) => {
  res.json({
    errno: 0,
    data: goods
  });
});
routes.get('/seller', (req, res) => {
  res.json({
    errno: 0,
    data: seller
  });
});
routes.get('/ratings', (req, res) => {
  res.json({
    errno: 0,
    data: ratings
  });
});

app.use('/api', routes);


// 定义静态文件
app.use(express.static('./dist'));

// 启动express
module.express = app.listen(port, (err) => {
  if (err) {
    
    console.log(err);
    return;
  }

  console.log(`http://localhost:${port}\n`);
});
