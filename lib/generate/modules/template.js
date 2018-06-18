const fs = require('fs')

class Template {
  /**
   *
   * @param params
   */
  constructor (params) {
    this.command = {
      generate: params[1],
      nameDirectory: params[2].split('/')[0],
      name: (params[2].split('/')[1] || params[2].split('/')[0])
    }

    this.schemaModule = [
      {
        directory: 'controllers',
        nameDirectoryModule: `${this.command.nameDirectory}`,
        names: [
          `${this.command.name}`,
          `${this.command.name}s`
        ]
      },
      {
        directory: 'routers',
        nameDirectoryModule: `${this.command.nameDirectory}`,
        names: [
          `${this.command.name}`,
          `${this.command.name}s`
        ]
      },
      {
        directory: 'models',
        nameDirectoryModule: `${this.command.nameDirectory}`,
        names: [
          `${this.command.name}`
        ]
      },
      {
        directory: 'helpers',
        names: [],
        nameDirectoryModule: `${this.command.nameDirectory}`
      },
      {
        directory: 'index',
        names: ['index'],
        nameDirectoryModule: `${this.command.nameDirectory}`
      }
    ]

    this.schemaController = [
      {
        directory: 'controllers',
        nameDirectoryModule: `${this.command.nameDirectory}`,
        names: [
          `${this.command.name}`
        ]
      },
      {
        directory: 'routers',
        nameDirectoryModule: `${this.command.nameDirectory}`,
        names: [
          `${this.command.name}`,
          `${this.command.name}s`
        ]
      }
    ]
    this.exec(this[`schema${this.command.generate.toString().toCapitalCase()}`])
  }

  /**
   *
   * @param collection
   */
  exec (collection) {
    let tabSucces = []

    collection.forEach(obj => {
      obj.directoryURL = `${__modules}/${obj.nameDirectoryModule.toString().toDashCase()}/${(obj.directory === 'index') ? '' : obj.directory + '/'}`
      this.createDirectoriesRecurcive(obj)
        .then(
          success => success.names.map(name => this.pathCreate(success.directory, success.nameDirectoryModule, name, success.directoryURL)),
          error => { console.log('::error::', error) }
        )
    })
  }

  /**
   * create file
   * @param name
   */
  pathCreate (directory, nameDirectoryModule, name, directoryURL) {
    let fileURL = `${directoryURL}${name.toString().toDashCase()}.${directory.replace(/s$/, '')}.js`

    if (directory === 'helpers') fileURL = `${directoryURL}/.gitkeep`
    if (directory === 'index') fileURL = `${directoryURL}/index.js`

    let data = this[directory](nameDirectoryModule, name)

    return fs.writeFileSync(fileURL, data, 'utf8')
  }

  /**
   * Template Controller
   * @param nameDirectory {string}
   * @param name {string}
   * @return {string}
   */
  controllers (nameDirectory, name) {
    return `
/**
 * Controller ${name.toPascalCase()}
 * 
 * @class ${name.toPascalCase()}
 * @classdesc : all method for the router ${name.toString().toDashCase()}
 *
 * @file : /app/modules/${nameDirectory.toString().toDashCase()}/controllers/${name.toString().toDashCase()}.controller.js
 * 
 * @date : ${new Date(Date.now()).toLocaleDateString()}
 */
	  
const ${name.toString().toPascalCase()} = require(\`\${__modules}/${nameDirectory.toString().toDashCase()}/models/${name.toString().toDashCase()}.model\`);
const async = require('async');

class ${name.toString().toPascalCase()}Ctrl {
  constructor(){}

  ${/s$/.test(name) ? 'list' : 'detail'}(req, res) {
	res.status(501).send({ error : 'NOT IMPLEMENTED: ${name.toString().toPascalCase()} ${/s$/.test(name) ? 'list\'' : 'detail: \' + req.params.id'}});
  }

  ${/s$/.test(name) ? 'create_many' : 'create'}(req, res) {
	res.status(501).send({ error : 'NOT IMPLEMENTED: ${name.toString().toPascalCase()}${/s$/.test(name) ? 'create many\'' : 'create: \' + req.params.id'}});
  }

  ${/s$/.test(name) ? 'modify_many' : 'modify'}(req, res) {
	res.status(501).send({ error : 'NOT IMPLEMENTED: ${name.toString().toPascalCase()} ${/s$/.test(name) ? 'modify many\'' : 'modify: \' + req.params.id'}});
  }

  ${/s$/.test(name) ? 'delete_all' : 'delete'}(req, res) {
	res.status(501).send({ error : 'NOT IMPLEMENTED: ${name.toString().toPascalCase()} ${/s$/.test(name) ? 'delete all\'' : 'delete: \' + req.params.id'}});
  }
}

module.exports = new ${name.toString().toPascalCase()}Ctrl();
`
  }

  /**
   * Template Router
   * @param nameDirectory {string}
   * @param name {string}
   * @return {string}
   */
  routers (nameDirectory, name) {
    return `
/**
 * Router ${name.toString().toDashCase()}
 *
 * @description defined the router for the controller
 *
 * @file : /app/modules/${nameDirectory.toString().toDashCase()}/routers/${name.toString().toDashCase()}.router.js
 * @date : ${new Date(Date.now()).toLocaleDateString()}
 */

const ${name.toPascalCase()}Ctrl = require(\`\${__modules}/${nameDirectory.toString().toDashCase()}/controllers/${name.toString().toDashCase()}.controller\`);

$GzRouter({
  name:'${name.toString().toDashCase()}',
  routes:[
	{
	  path: '/',
	  method: 'post',
	  handler: ${name.toString().toPascalCase()}Ctrl.${/s$/.test(name) ? 'create_many' : 'create'}
	},
	{
	  path: '/',
	  method: 'get',
	  handler: ${name.toString().toPascalCase()}Ctrl.${/s$/.test(name) ? 'list' : 'detail'}
	},
	{
	  path: '/',
	  method: 'put',
	  handler: ${name.toString().toPascalCase()}Ctrl.${/s$/.test(name) ? 'modify_many' : 'modify'}
	},
	{
	  path: '/',
	  method: 'delete',
	  handler: ${name.toString().toPascalCase()}Ctrl.${/s$/.test(name) ? 'delete_all' : 'delete'}
	},
  ]
});
`
  }

  /**
   * Template Model
   * @param nameDirectory {string}
   * @param name {string}
   * @return {string}
   */
  models (nameDirectory, name) {
    return `

/**
 * Model ${name.toPascalCase()}
 * 
 * @class ${name.toPascalCase()}
 * @classdesc : all method for request ${name} in BDD
 *
 * @file : /app/modules/${nameDirectory.toString().toDashCase()}/routers/${name.toString().toDashCase()}.router.js 
 * @date : ${new Date(Date.now()).toLocaleDateString()}
 */

class ${name.toPascalCase()} {
  constructor(){}
}

module.exports = new ${name.toPascalCase()}();
`
  }

  /**
   * Template Helpers
   * @param nameDirectory {string}
   * @param name {string}
   * @return {string}
   */
  helpers (nameDirectory, name) { return '' }

  /**
   * Template Index
   * @param nameDirectory {string}
   * @param name {string}
   * @return {string}
   */
  index (nameDirectory, name) {
    return `
/**
 * Module ${name.toPascalCase()}
 *
 * @file : /app/modules/${nameDirectory.toString().toDashCase()}/${name.toString().toDashCase()}.js 
 * @date : ${new Date(Date.now()).toLocaleDateString()}
 */

$GzModule({
	name: '${nameDirectory.toString().toDashCase()}',
	mode: 'hybrid-mvc',
	router: [
		'${nameDirectory.toString().toDashCase()}', 
		'${nameDirectory.toString().toDashCase()}s'
	]
});

class ${nameDirectory.toPascalCase()}Module {
	constructor(){}
}

module.exports = ${nameDirectory.toPascalCase()}Module;
`
  }

  /**
   *
   * @param url
   * @return {Promise<any>}
   */
  pathDirectory (url) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(url)) {
        fs.mkdir(url, (err) => {
          if (err) return reject(url)
          return resolve(url)
        })
      } else {
        return resolve(url)
      }
    })
  }

  /**
   *
   * @param obj
   * @return {Promise<any[]>}
   */
  createDirectoriesRecurcive (obj) {
    let urls = obj.directoryURL.split(/(\/|\\)/)
      .map(path => (path !== '' && !/^(\\|\\\\|\/)$/.test(path) && path)
        ? `${obj.directoryURL.substring(0, obj.directoryURL.indexOf(path))}${path}`
        : ''
      )
      .filter(urlTmp => (urlTmp && urlTmp !== ''))

    return new Promise((resolve, reject) => {
      Promise.all(urls.map(urlTmp => this.pathDirectory(urlTmp)))
        .then(() => resolve(obj))
        .catch(error => reject(error))
    })
  }
}

module.exports = Template
