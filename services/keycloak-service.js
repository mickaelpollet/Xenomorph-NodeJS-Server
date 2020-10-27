var session = require('express-session');
var Keycloak = require('keycloak-connect');

let _keycloak;

var keycloakConfig = {
    serverUrl: 'https://auth.gringotts.net:8443/auth/',
    realm: 'Gringotts',
    clientId: 'Gringotts Back',
    sslRequired: "all",
    bearerOnly: true,
    verifyTokenAudience: true,
    useResourceRoleMappings: true,
    realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmp5end00DCsHReBAMatOCbMOXU5v7Re4k2ZnNy+uWZtOau6bT0jgctn+38XQq/nG1wzyQ/4/0kLPicgxlpAtACm8N6zJiwgi3/+/e01AJyXl5DIsn5E7d/QdxaxaHU+pjJpu2s51g+Db6/pu9+rrI0InSBJPh/XF/bX4OTvP0PI9estctJG4zm3GLTiu24qw3Ag9Dr9LEngFC19IiI65qiSo0ezvdazYf74F4lE3cu5Ef0L1P9P+bAgxzDTnPGmwvTggTb8APyqqnWsZy1XqbN1TTIxk3MGIAXu85Uy3ZoYaVBUu93MQWcMtF/2NPy0gGPOmQwKMEB2Hh5M5K7cJEwIDAQAB',
    confidentialPort: 0,
    credentials: {
        secret: '4f7892d6-f117-42ee-b992-540f36a9ce83'
    }
};

function initKeycloak() {
    if (_keycloak) {
        console.warn("Trying to init Keycloak Middleware again !");
        return _keycloak;
    } else {
        console.log("Keycloak Middleware initialization...");
        var memoryStore = new session.MemoryStore();
        _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
        console.log("Keycloak Middleware initialization : DONE");
        return _keycloak;
    }
}

function getKeycloak() {
    if (!_keycloak){
        console.error('Keycloak has not been initialized. Please called init first.');
    }
    return _keycloak;
}

module.exports = {
    initKeycloak,
    getKeycloak
};