//node的http模块搭建的后端服务
/** 
const http = require('http');

const server = http.createServer(function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('hello world');
});

server.listen(3000, function() {
  console.log('服务已启动。。。');
});

server.on('error', (err) => {
  console.error('服务器错误:', err);
});
*/

// 使用express来搭建服务
const express = require('express')

const app = express()
app.get('/', function(req, res) {
  res.send('hello express')
})

// app.get('/user', function(req, res) {
//   console.log('==== 查询参数 ====');
//   console.log(req.query); // 如 ?name=John → { name: 'John' }

//   console.log('\n==== 路由参数 ====');
//   console.log(req.params); // 如 /users/:id → { id: '123' }

//   console.log('\n==== 请求体 ====');
//   console.log(req.body); // 需要 body-parser 中间件

//   console.log('\n==== 其他常用 ====');
//   console.log('Cookies:', req.cookies); // 需要 cookie-parser
//   console.log('IP:', req.ip);
//   console.log('路径:', req.path);
//   console.log('协议:', req.protocol);

//   res.send('user')
// })

// app.all('/about', function(req, res) {
//   res.send({
//     name: 'jackie',
//     age: 18
//   })
// })

// ----- 字符模式路由路径 ------
// app.get('/ab?cd', function(req, res) { // abcd/acd
//   res.send('ab?cd');
// });

// app.get('/ab+cd', function(req, res) { // ab+cd
//   res.send('ab+cd');
// });

// app.get('/ab*cd', function(req, res) { // ab...cd
//   res.send('ab*cd');
// });

// //----- 正则路由路径 ------
// app.get(/a/, function(req, res) {
//   res.send('/a/');
// });

// app.get(/.*fly$/, function(req, res) {
//   res.send('/.*fly$/');
// });


// ------- 路由拆分 --------
app.get('/user/list', function(req, res) {
  res.send(['jackie', 'lily'])
})

app.get('/user/detail', function(req, res) {
  res.send({
    name: 'jackie',
    age: 18
  })
})

app.get('/goods/list', function(req, res) {
  res.send(['可乐', '矿泉水'])
})

app.get('/goods/detail', function(req, res) {
  res.send({
    name: '可乐',
    price: 3
  })
})

const user = express.Router();
const goods = express.Router();

user.get('/list', function(req, res, next){
	res.send('/list');
});

goods.get('/detail', function(req, res, next){
	res.send('/detail');
});

goods.get('/list', function(req, res, next){
	res.send('/list');
});

user.get('/detail', function(req, res, next){
	res.send('/detail');
});

// app.use('/user', user) // 注册user路由
// app.use('/goods', goods) // 注册goods路



// -------- 中间件 ------------
function middleware(req, res, next) {
  console.log('这是一个全局中间件');
  next();
}

app.use(middleware) // 注册全局中间件

function logger(req, res, next) {
    const time = new Date()
    console.log(`[${time.toLocaleString()}] ${req.method} ${req.url}`);
    next();
  }  
app.use(logger)

app.get('/local', function(req, res, next) 
    {
        console.log('这是一个局部中间件');
        next()
    }, 
    function(req, res) {
        res.send('user');
    }
)

app.get('/user', function(req, res) {
  res.send('user')
})

app.get('/about', function(req, res) {
  res.send('about')
})


// ----------- 模板引擎 ------------

app.use(express.static('public')); // 注册静态资源中间件
// 指定模板存放目录
app.set('views', 'views');

// 指定模板引擎为 Handlebars
app.set('view engine', 'hbs');

app.get('/view_main', function(req, res) {
  res.render('view_main')
})

app.get('/view_about', function(req, res) {
  //throw new Error()

  res.render('view_about', {
    name: '小明',
    age: 18
  })
})


//测试连接
app.use(express.json());
app.post('/api/messages', (req, res) => {
  console.log('Received:', req.body.text);
  res.json({ status: 'Message received' });
});


app.use((req, res) => {
  res.status(404).render('404', { url : req.originalUrl });
});
app.use((err, req, res, next) => {
  res.status(500).render('500');
});



// app.listen(3000, function() {
//     console.log('服务已启动。。。');
//   });
  
  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
  });

app.on('error', (err) => {
    console.error('服务器错误:', err);
  });
