const Koa = require('koa');
const app = new Koa();
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');

const PORT = process.env.PORT || 3000;

app.use(bodyParser());

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt} - ${ctx.status}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// router
const router = new KoaRouter();

router.get('index', '/', async (ctx) => {
  ctx.body = 'Hello';
});

router.post('/webhook', (ctx) => {
  console.log("Request Body:");
  console.log(JSON.stringify(ctx.request.body, null, 2));
  console.log('Request Headers:');
  console.log(JSON.stringify(ctx.request.headers, null, 2));
  ctx.status = 200;
});

router.head('/pdf', async (ctx) => {
  ctx.status = 200;
});

router.get('/pdf', async (ctx) => {
  ctx.redirect('https://app2.bsale.cl/view/61263/072071e70569.pdf');
});

app.use(router.routes());

app.listen(PORT);