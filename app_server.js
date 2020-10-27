// npm install -g express-generator
// npm install -g nodemon
// npm install --save-dev nodemon
// npm install express --save
// npm install cors
// npm install --save express body-parser
// npm install express-session keycloak-connect
// node app_server.js
// nodemon app_server.js


// Déclaration des variables
var fs            = require('fs');                // Librarie FileSystem
var http          = require('http');              // Librairie HTTP
var https         = require('https');             // Librairie HTTPS
var express       = require("express");           // Librairie Express
var bodyParser    = require("body-parser");       // Librarie BodyParser pour le HTML
var session       = require("express-session");   // Librarie Express Session pour la récupération des données du HEADER
var Keycloak      = require("keycloak-connect");  // Librarie Middleware Keycloak
var cors          = require('cors');              // Librarie CORS

const https_server_port = 9080;
const http_server_port  = 9081;

// App data
let safes = [
  { id: 1, lname: 'POTTER', fname: 'Harry', amount: 2500 },
  { id: 2, lname: 'GOBLIN', fname: 'Griphook', amount: 5248500  }
];

// Configuration TLS
var privateKey  = fs.readFileSync('app.gringotts.net.key', 'utf8');
var certificate = fs.readFileSync('app.gringotts.net.crt', 'utf8');

var credentials = { key: privateKey, cert: certificate };

// Préparation des données serveur
const memoryStore = new session.MemoryStore();

// Initialisation du serveur
const app = express();
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// Initialisation de Keycloak
var kConfig = {
  serverUrl: 'https://auth.gringotts.net:8443/auth/',
  realm: 'Gringotts',
  clientId: 'Gringotts Back',
  sslRequired: "all",
  bearerOnly: true,
  verifyTokenAudience: true,
  useResourceRoleMappings: true,
  realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmp5end00DCsHReBAMatOCbMOXU5v7Re4k2ZnNy+uWZtOau6bT0jgctn+38XQq/nG1wzyQ/4/0kLPicgxlpAtACm8N6zJiwgi3/+/e01AJyXl5DIsn5E7d/QdxaxaHU+pjJpu2s51g+Db6/pu9+rrI0InSBJPh/XF/bX4OTvP0PI9estctJG4zm3GLTiu24qw3Ag9Dr9LEngFC19IiI65qiSo0ezvdazYf74F4lE3cu5Ef0L1P9P+bAgxzDTnPGmwvTggTb8APyqqnWsZy1XqbN1TTIxk3MGIAXu85Uy3ZoYaVBUu93MQWcMtF/2NPy0gGPOmQwKMEB2Hh5M5K7cJEwIDAQAB',
  confidentialPort: 0,
  /*credentials: {
      secret: '4f7892d6-f117-42ee-b992-540f36a9ce83'
  }*/
};

/*
{
  "realm": "Gringotts",
  "auth-server-url": "https://auth.gringotts.net:8443/auth/",
  "ssl-required": "all",
  "resource": "Gringotts Back",
  "verify-token-audience": true,
  "credentials": {
    "secret": "4f7892d6-f117-42ee-b992-540f36a9ce83"
  },
  "use-resource-role-mappings": true,
  "confidential-port": 0
}
*/



// Ajout du CORS
app.use(cors());

// Ajout des sessions
app.use(
    session({
      secret: '4f7892d6-f117-42ee-b992-540f36a9ce83',
      resave: false,
      saveUninitialized: true,
      store: memoryStore})
);

//const keycloak = require('./services/keycloak-service.js').initKeycloak();
const keycloak = new Keycloak({ store: memoryStore }/*, kConfig*/);

// Démarrage de la session Keycloak
app.use(keycloak.middleware({
    logout: '/logout',
    admin: '/'
  })
);

// Récupération de la route
app.get("/get/vaults", keycloak.protect('Banker'), (req, res, next) => {
  console.log(keycloak);
  console.log(req.headers.authorization);
  //res.json(req.headers);
  res.json(safes);
});

// Récupération de la route
app.get("/get/vault/:user", /*keycloak.protect('Banker'),*/ (req, res, next) => {


  console.log('Vault searching...');
  //res.json(req.headers);
  console.log(req.headers.authorization);
  console.log(req.headers);
  //console.log(res);

  let response;

  for (let currentSafe of safes) {
    if (currentSafe.lname == req.params.user) {
      response = currentSafe;
    }
  }
  res.json(response);
});


// Lancement du serveur HTTPS
httpsServer.listen(https_server_port, () => {
    console.log("HTTPS Server running on port " + https_server_port);
});

// Lancement du serveur HTTP
httpServer.listen(http_server_port, () => {
  console.log("HTTP Server running on port " + http_server_port);
});