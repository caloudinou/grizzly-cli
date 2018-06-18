(function(global){
    global.gz = global.gz || {};

    global.$GzLoadServerModules = (obj) => {
      gz.bootstrapApp = gz.bootstrapApp || {};

      let CORS = obj.middlewareCORS ?  obj.middlewareCORS : gz.default.middlewareCORS;
      let auth = obj.authentication || gz.default.funcDefaultNext;
      gz.bootstrapApp.middlewareCORS.Set(CORS);
      gz.bootstrapApp.authentication.Set(auth);

      gz.bootstrapApp.logger = obj.logger || gz.default.funcDefaultNext;

      gz.moduleDB = {
          default: gz.moduleMongoDB,
          none: gz.funcDefaultNext,
          otherDb: obj.moduleDB
      };

      let type = (obj.moduleDB == null || obj.moduleDB === 'default')
        ? 'default'
        : ((obj.moduleDB !== 'none') ? 'other' : 'none'); //obj.moduleDB);

      gz.bootstrapApp.moduleDB = type; // @TODO: à implémenter :: gz.moduleDB[type];
      gz.bootstrapApp.moduleHandler = obj.declaration.map(module => require(`${__modules}/${module}`));
    };
})(global);




