require('./global-constant');

const distGlobal = require(`${__lib}/parameters-handler/dist-parameters.json`);
let distProject;
try {
  distProject = require(`${__config}/dist-parameters`);
} catch(e) {
  console.log('you are not config/dist-parameters')
  distProject = {};
}

let paramEnv = process.argv.find( arg => new RegExp('--env=').test(arg));

let env = paramEnv ? paramEnv.toString().replace('--env=', '') : 'local';

let parameters;


try {
  parameters = require(`${__config}/${env}-parameters`);
} catch(e) {
  console.log('you are not config/env-parameters')
  parameters = {};
}

(function(global) {
    global.gz = global.gz || {};
    gz.parameters = gz.parameters || {};

    let config = Object.assign({}, distGlobal, distProject, parameters);
    Object.keys(config).forEach(key => {
        Object.defineProperty(gz.parameters, key, {
             // __proto__: null,
            // enumerable: false,
            // configurable: false,
            writable: false,
            value: config[key]
        });
    });

})(global);
