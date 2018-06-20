const mbd = require('../mongodb-handler');
(function(global) {
  global.gz = global.gz || {};
  gz.loadBootstrap = () => {
    gz.bootstrapApp = class AppModule{constructor(){}};
    gz.initialization.base();
    gz.initialization.start();
  };
  gz.moduleMongoDB = new mbd();
  gz.starterBasicMongoDB = () => {
    let logRun = (req,res, next) => console.log('server run');
    gz.moduleMongoDB.db.subscribe(success => gz.server.app.listen(gz.parameters.server.net.port, logRun));
    gz.moduleMongoDB.connect();
  };
  gz.starterOther = () => {
    let logRun = (req,res, next) => console.log('server run :: no method basic gzMongodb');
    gz.server.app.listen(gz.parameters.server.net.port, logRun);
  };
  gz.start = () => {
    if( gz.bootstrapApp.moduleDB === 'default' ) {
      return gz.starterBasicMongoDB();
    } else {
      return gz.starterOther();
    }
  };
})(global);
