const path = require('path');

let env = 'local';

(function(global){
    let gz = global.gz || {};
    global.__base = process.cwd();
    global.__baseGz = path.dirname(module.parent.filename).split(/(\\|\/)(lib|config|modules|helpers)/)[0];
    global.__app = `${__base}/app`;
    global.__lib = `${__baseGz}/lib`;
    global.__config = `${__app}/config`;
    global.__modules = `${__app}/modules`;
    global.__helpers = `${__app}/helpers`;

    global.rootRequire = (name) => require(__base + (/^\//.test(name)? '' : '/') + name);

})(global);