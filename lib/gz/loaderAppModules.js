(function(global){
    let gz = global.gz || {};
    gz.server = {};
    gz.server.$e = require('express');
    gz.server.app = gz.server.$e();

    global.$GzRouter = function (objRouter) {
        let router = gz.server.$e.Router();
        objRouter.routes.forEach(route => router[route.method](route.path, route.handler));
        gz.server.app.use(`/${objRouter.name}`, router);
    };

    global.$GzModule = function (moduleDefinition) {
        moduleDefinition
            .router
            .map(type => {
                let method = (!(moduleDefinition.mode) || moduleDefinition.mode === 'classic-mvc') ? 'controller' : 'router';
                return require(`${__modules}/${moduleDefinition.name}/${method}s/${type}.${method}.js`);
            })
    };

})(global);