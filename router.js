/*************************************
 * @project: 	Xenomorph NodeJS Server
 * @file:     Router script
 * @author: 	Mickaël POLLET <mickaelpollet@gmail.com>
 *************************************/

// Déclaration des dépendances
var fs = require('fs');            // Module de gestion du file system

// Fonction de routage
var routing = function(page, response) {

  // Chargement de la page
  if (page != '/favicon.ico') {                                                             // On vérifie qu'il ne s'agit pas d'un appel pour le favicon

    // Si aucune page n'est renseignée, on appelle la page d'index
    if (page == '/') {  page = '/index.html';  }

    // Récupération de la page
    fs.readFile('./views/' + page, 'utf-8', function(error, content) {
      if (error != null) {                                                                  // On vérifie si il y a une erreur au chargement de la page
        if (error.code == 'ENOENT') {                                                       // SI il y a une erreur et que c'est que le fichier n'existe pas...
          fs.readFile('./views/error.html', 'utf-8', function(error_error, error_content) { // On charge la page d'erreur
              response.writeHead(404, {"Content-Type" : "text/html"});                       // On attribue le code 404
              response.end(error_content);                                                  // On affiche la page d'erreur
          });
        }
      } else {                                                                              // SINON...
        response.writeHead(200, {"Content-Type" : "text/html"});                             // On affiche la page en question
        response.end(content);
      }

    });
  }
}

// Export de la fonction de routage
exports.routing = routing;
