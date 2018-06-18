/**
 * Created by 90001054 on 15/09/2017.
 */

/**
 * Général Dépendancies
 */
(function (global) {
    gz.server      = {};
    gz.server.$e   = require('express');
    gz.compression = require('compression');
    gz.security    = require('helmet');
    gz.bodyParser = require('body-parser');
    gz.server.app  = gz.server.$e();
    gz.default     =  gz.default ||{};
    gz.default.middlewareCORS = require(`${__lib}/router-handler/middlewareCORS`);
    gz.initialization = {
      base: function () {

        // compression response
        gz.server.app.use(gz.compression());

        // security all route
        gz.server.app.use(gz.security({
          referrerPolicy: {policy: 'unsafe-url'},
          hpkp: {
            maxAge: 7776000,
            sha256s: ['Gr1z5lY42=', 'Fr4m3w0r5='],
            contentSecurityPolicy: {
              directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
              }
            }
          }
        }));

        gz.server.app.use(gz.bodyParser.urlencoded({extended: true}));
        gz.server.app.use(gz.bodyParser.json());
      },
      start:function(){
        gz.initialization.base();
        gz.bootstrapApp.middlewareCORS = gz.bootstrapApp.middlewareCORS||{};
        gz.bootstrapApp.authentication = gz.bootstrapApp.authentication||{};

        new Observable().observe(gz.bootstrapApp.middlewareCORS);
        new Observable().observe(gz.bootstrapApp.authentication);
        gz.bootstrapApp.middlewareCORS.subscribe(() => gz.initialization.middlewareCORS());
        gz.bootstrapApp.authentication.subscribe(() => gz.initialization.authentication());
      },
      middlewareCORS: function() {
        gz.server.app.use(gz.bootstrapApp.middlewareCORS.Get());
      },
      authentication: function () {
        gz.server.app.use(gz.bootstrapApp.authentication.Get());
      }
    };
    /**
     *
     * @param objRouter{{ name: string, mode:  'classic-mvc' || 'hybrid-mvc', router: string[]}}
     * @constructor
     */
    global.$GzRouter =  function (objRouter) {
        let router = gz.server.$e.Router();
        objRouter.routes.forEach(route => {
            router[route.method](route.path, route.handler)
        });
        gz.server.app.use(`/${objRouter.name}`, router);
    };
    /**
     *
     * @param moduleDefinition{{name:string, }}
     * @constructor
     */
    global.$GzModule = function(moduleDefinition) {
        moduleDefinition
            .router
            .forEach(type => {
                let method = (!(moduleDefinition.mode) || moduleDefinition.mode === 'classic-mvc') ? 'controller' : 'router';
                return require(`${__modules}/${moduleDefinition.name}/${method}s/${type}.${method}.js`);
            });
    };
})(global);

