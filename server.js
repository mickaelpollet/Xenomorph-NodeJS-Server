/*************************************
 * @project: 	Xenomorph NodeJS Server
 * @file:     Server script
 * @author: 	Mickaël POLLET <mickaelpollet@gmail.com>
 *************************************/

// Déclaration des dépendances globales
var http        = require('http');          // Modules de gestion du protocole http
var url         = require('url');           // Module de gestion des URL
var querystring = require('querystring');   // Module de gestion des paramètres de requêtes

// Déclaration des dépendances locales
var router      = require('./router');     // Module de gestion du routeur

// Déclaration des paramètres du serveur
var listen_port = 8080;

// Création du serveur Web
var server = http.createServer(function(request, response) {

  // Récupération des éléments de la requête
  var page    = url.parse(request.url).pathname;              // Récupération et parsing de l'url
  var params  = querystring.parse(url.parse(request.url).query);  // Récupération des paramètres envoyés

  // Affichage de la page depuis le routeur
  router.routing(page, response);
});

// Ecoute du port attribué pour le serveur
server.listen(listen_port);
