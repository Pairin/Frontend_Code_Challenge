const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const Express = require('express');
const bodyParser = require('body-parser');
const App = Express();
const swaggerUiAssetPath = require("swagger-ui-dist").getAbsoluteFSPath()
const readFileAsync = promisify(fs.readFile);
const crypto = require('crypto');

const CIPHER_ALGORITHM='aes-256-ctr';
const PRIVATE_KEY='6N84Hn8VT7coVo0K9xzWJqfoHz8u1osPOCG8FAIP';

App.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
  const { origin } = req.headers;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Api-Key');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') 
  res.sendStatus(200);
  else 
    return next();
});

App.use(bodyParser.json());

App.use('/', Express.static(path.resolve('./public')))
App.get('/swagger', (req, res) => res.sendFile(path.resolve('./public','swagger.html')));
App.use('/swagger/dist', Express.static(swaggerUiAssetPath));

const AuthenticationRouter = Express.Router({mergeParams: true});

const allowed_keys = [];
const renew_keys = [];

const key_renew_map = {};

const DeleteKey = (api_key) => {
    const api_index = allowed_keys.findIndex(k=>k==api_key);
    allowed_keys.splice(api_index, 1);

    if (key_renew_map[api_key]) {
        const renew_index = renew_keys.findIndex(k=>k==key_renew_map[api_key]);
        renew_keys.splice(renew_index, 1);
    }

    delete key_renew_map[api_key];
}

const CheckApiKey = (api_key) => {
  if (!allowed_keys.includes(api_key)) {    
    return false;
  }

  const decipher = crypto.createDecipher(CIPHER_ALGORITHM, PRIVATE_KEY)
  const dec = decipher.update(api_key,'hex','utf8') + decipher.final('utf8');

  if (Date.now() - Number(dec) > 900000) {
    DeleteKey(api_key);

    return false;
  }

  return true;
}

AuthenticationRouter.route('/')
  .get(async (req, res) => {
    if (CheckApiKey(req.headers['x-api-key'])) {
      return res.status(200).send({status: "Success"});
    }
    res.status(401).send("Unauthorized");
  })
  .post(async (req, res) => {
    if (req.body.username=="test_user" && req.body.password=="TestPassword1") {
      const cipher = crypto.createCipher(CIPHER_ALGORITHM, PRIVATE_KEY);
      const api_key = cipher.update(`${Date.now()}`, 'utf8', 'hex') + cipher.final('hex');

      const renew_key = crypto.createHmac('sha256', PRIVATE_KEY)
                   .update(Math.random().toString(36))
                   .digest('hex');

      renew_keys.push(renew_key);
      allowed_keys.push(api_key);

      key_renew_map[api_key]=renew_key;

      return res.status(200).send({
        status: "Success",
        api_key: api_key,
        renew_key: renew_key
      });
    }
    res.status(401).send("401 Unauthorized");
  })
  .delete(async (req, res) => {
    if (req.headers['x-api-key']) {
      DeleteKey(req.headers['x-api-key']);
    }

    res.status(200).send({status: "Success"});
  })

AuthenticationRouter.route('/renew')
  .post((req, res) => {
    if (CheckApiKey(req.headers['x-api-key'])) {
      return res.status(200).send({
        status: "Success",
        api_key: req.headers['x-api-key']
      });
    }

    if (!req.body.renew_key || !renew_keys.includes(req.body.renew_key)) {
      return res.status(401).send("401 Unauthorized");
    }

    const cipher = crypto.createCipher(CIPHER_ALGORITHM, PRIVATE_KEY);
    const api_key = cipher.update(`${Date.now()}`, 'utf8', 'hex') + cipher.final('hex');

    allowed_keys.push(api_key);

    res.status(200).send({
      status: "Success",
      api_key: api_key
    });
  })

App.use('/authenticate', AuthenticationRouter);


//API
const ApiRouter = Express.Router({mergeParams: true});

ApiRouter.use(async (req, res, next) => {
  //Randomly send a 500 error

  if (Math.random() < 0.005) {
    return res.status(500).send("Unknown Error")
  }

  next();
})

//Authentication Check
ApiRouter.use((req, res, next) => {
  if (!req.headers['x-api-key'] || !CheckApiKey(req.headers['x-api-key'])) {
    return res.status(401).send("401 Unauthorized");
  }

  next();
});

//
// Get All users
//
ApiRouter.route('/users')
  .get(async (req, res) => {
    const users = require('./src/server/data/users.json');

    const limit = req.query.limit||20;
    const page = Math.min(Math.max((req.query.page||1) - 1, 0), Math.ceil(users.length / limit)-1);

    res.status(200).send({
      meta: {
        pages: Math.ceil(users.length / limit)-1,
        page: page+1,
        count: users.length,
        limit: limit
      },
      data: users.slice(Number(page*limit), Number(page*limit) + Number(limit))
    });
  })
  .all((req,res)=>res.status(405).send("405 Method Not Allowed"));

//
// Get Individual user
//
ApiRouter.route('/users/:id(\\d+)/')
  .get(async (req, res) => {
    const users = require('./src/server/data/users.json');

    const user = users.find(u=>Number(u.id)===Number(req.params.id));

    if (!user) {
      return res.status(404).send({
        code: 404,
        message: `User ${req.params.id} does not exist`,
        fields: "id"
      })
    }

    res.status(200).send(user);
  })
  .all((req,res)=>res.status(405).send("405 Method Not Allowed"));

ApiRouter.route('/users/:id(\\d+)/info')
  .get(async (req, res) => {
    const user_info = require('./src/server/data/user_info.json');
    const user = user_info.find(u=>Number(u.user_id)===Number(req.params.id));


    if (!user) {
      return res.status(404).send({
        code: 404,
        message: `User ${req.params.id} does not exist`,
        fields: "user_id"
      })
    }

    res.status(200).send(user);
  })
  .all((req,res)=>res.status(405).send("405 Method Not Allowed"));


App.use('/api', ApiRouter)

App.all('*', (req, res) => res.status(404).send({
  code: 404,
  message: "Page not found",
  fields: null
}))

const SERVER_PORT = process.env.SERVER_PORT || 3000;
App.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`))
