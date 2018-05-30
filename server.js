const path = require('path');
const fs = require('fs');
const Express = require('express');
const bodyParser = require('body-parser');
const App = Express();
const swaggerUiAssetPath = require("swagger-ui-dist").getAbsoluteFSPath()

App.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin||'*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  return next();
});

App.use(bodyParser.json());

App.use('/', Express.static(path.resolve('./public')))
App.get('/swagger', (req, res) => res.sendFile(path.resolve('./public','swagger.html')));
App.use('/swagger/dist', Express.static(swaggerUiAssetPath));

//API
const ApiRouter = Express.Router({mergeParams: true});

ApiRouter.use(async (req, res, next) => {
  //Randomly send a 500 error

  if (Math.random() < 0.005) {
    return res.status(500).send("Unknown Error")
  }

  next();
})


const SORT_FUNCS = {
  'survey_date': (a,b) => (
    (new Date(a.survey_date)).getTime() - (new Date(b.survey_date)).getTime()
  ),
  'full_name': (a,b) => (
    a.full_name.localeCompare(b.full_name)
  ),
  'email': (a,b) => (
    a.full_name.localeCompare(b.full_name)
  )
}

//
// Get All users
//
ApiRouter.route('/users')
  .get(async (req, res) => {
    let users = require('./src/server/data/users.json');

    const limit = req.query.limit||20;
    const page = Math.min(Math.max((req.query.page||1) - 1, 0), Math.ceil(users.length / limit)-1);

    if (req.query.sort && SORT_FUNCS[req.query.sort]) {
      users = users.sort(SORT_FUNCS[req.query.sort]);
    }

    if (req.query.order && req.query.order.toLowerCase()==='desc') {
      users = users.reverse();
    }

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
