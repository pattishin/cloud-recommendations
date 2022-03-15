const express = require('express');
const https = require('https');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Request helper that makes REST call to recommendations api
 */
const createGetRequest = (recommender) => new Promise((resolve, reject) => {
  const project = process.env.PROJECT;
  const location = process.env.LOCATION || 'us-central1-a';
  const url = `https://recommender.googleapis.com/v1/projects/${project}/locations/${location}/recommenders/${recommender}/recommendations`;

  const options = {
    headers: {
      'Authorization': `Bearer ${process.env.PROJ_TOKEN}`,
      'x-goog-user-project': project
    }
  };

  // TODO: Change to https.request to leverage POST
  https.get(url, options, function(res) {
    const { statusCode } = res;
    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
    }
    
    res.setEncoding('utf8');
    
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        resolve(parsedData);
      } catch (e) {
        reject(e);
      }
    });
  }).on('error', (e) => reject(e));
});

/**
 * POST /markClaimed
 * TODO: Needs implementation
 */ 
app.post('/markClaimed', async (req, res) => {
  // TODO: Use req.body of { "etag": "etag", "stateMetadata": STATE_METADATA }
  // To send to https://recommender.googleapis.com/v1/projects/${PROJECT}/locations/${LOCATION}/recommenders/${RECOMMENDER}/recommendations/${RECOMMENDER}:markClaimed
});

/**
 * GET /bundle
 * Description: Combining the relevant queries to recommendations api
 * to acheive whatever json data they require
 */ 
app.get('/bundle', async (req, res) => {
  let result;
  try {
    result = await Promise.all([
      createGetRequest('google.iam.policy.Recommender'),
      createGetRequest('google.compute.instance.MachineTypeRecommender')
    ]);
  } catch(e) {
    res.send(`Error: ${e.message}`);
  }

  res.json(result);
});

/**
 * GET /
 * Description: Proxy base for interfacing with recommendations api
 * https://cloud.google.com/recommender/docs/using-api#list_recommendations
 */ 
app.get('/', async (req, res) => {
  res.send('Welcome, please leverage the following apis: \n GET /bundle \n POST /markClaimed');
});

const port = parseInt(process.env.PORT) || 8080;

// Open your browser to http://localhost:8080
app.listen(port, () => console.log(`Listening on port ${port}`));

