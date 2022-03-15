# cloud-recommendations
Containerizing recommendations API (Active Assist)

Leveraging APIs from GCP recommendations:
* https://cloud.google.com/recommender/docs/reference/rest
* https://cloud.google.com/recommender/docs/using-api#list_recommendations

Recommender IDs:
* https://cloud.google.com/recommender/docs/recommenders#recommenders

## Getting started

1. Verify you have a GCP project that exists and open up [cloud shell](https://cloud.google.com/shell/docs/using-cloud-shell)

```
gcloud config set project PROJECT_ID
gcloud services enable recommender.googleapis.com
```

2. Clone this repo in your shell environment and then execute the following to start the node.js server:

```
cd cloud-recommendations/

npm install
npm start // Starts the node.js server
```

3. Change the environment variables (project, etc) by modifying the `package.json` file. Find the `start` script.

4. To leverage Cloud Run to containerize & deploy your work, you just need to execute the following:
```
gcloud run deploy
```
5. Accept all the apis that need to be enabled for the deployment and once its completed deployment, take the url that is given and run it in your browser.

Current APIs:

```
GET /bundle // TODO: partial implementation
POST /markClaimed //TODO: needs implementation
```

Note: If you need to execute anything within the container, then a Dockerfile or equivalent must be created an image
to deployed. [Cloud Build](https://cloud.google.com/build/docs/build-push-docker-image) 
