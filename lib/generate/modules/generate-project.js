const Template = require('./template')
const { exec } = require('child_process')
const fs = require('fs')

/**
 * Generate Project
 */
class GenerateProject {
  /**
   * Template Router
   * @param name {string}
   * @return {string}
   */
  constructor (name) {
    this.name = name
    global.__base = process.cwd() + '/' + name
    global.__modules = __base + '/app/modules'

    this.urls = [
      __base + '/app/config/',
      __base + '/app/helpers/',
      __base + '/dist/',
      __base + '/tmp/',
      __base + '/test-run/'
    ]
    this.templateObj = null
    return this
  }

  /**
   * method to create project
   */
  make () {
    this.templateObj = new Template(['g', 'module', 'exemple', 'exemple'])
    this.urls.forEach(url => {
      this.templateObj.createDirectoriesRecurcive({directoryURL: url})
        .then(success => {
          console.log('::~~~~yes :: baby~~~~::', success)
          this.urls.forEach(directory => {
            let data = ''
            fs.writeFileSync(directory + '.gitkeep', data, 'utf8')
          })
          fs.writeFileSync(__base + '/app/index.js', this.indexModule(), 'utf8')
          fs.writeFileSync(__base + '/package.json', this.package(), 'utf8')
          fs.writeFileSync(__base + '/.gitignore', this.gitignore(), 'utf8')
          fs.writeFileSync(__base + '/readme.md', this.readme(), 'utf8')
          this.exec()
        }, error => { console.log(error) })
    })
  }

  exempleModelCore () {
    return `
  constructor(){
    //initialization of data base
    gz.moduleMongoDB.db.subscribe( () => {
      db.collection('test-exemple').insertOne({_id: 1, name: 'pascal-AAA', post: 'supervisor'}).then(success => { console.log(success)}, error => { console.log(error)});
    })
  }

  checkModel(value, instance){
    return (instance === 'Array' ? value instanceof eval(instance) : typeof value === instance)
  }

  findByName(value){
    if(!this.checkModel(value, 'string')) return Promise.reject(new Error('error type string'));
    return db.collection('test-exemple').findOne({ name: value });
  }

  insertOfTestUser(body){
    if(!this.checkModel(body.name, 'string')) return Promise.reject(new Error('error type string'));
    if(!this.checkModel(body.post, 'string')) return Promise.reject(new Error('error type string'));
    return Promise.resolve({});
  }
} 	
  	`
  }
  exempleControllerDetail () {
    return `

  detail(req, res) {

    Exemple.findByName(req.params.id)
      .then(success => {
        res.status(200).send({ 'test-user' : success });
      })
      .catch(error => {
        res.status(400).send({ 'error' : error });
      })
  }`
  }
  exempleControllerCreate () {
    return `
  create(req, res) {
    Exemple.insertOfTestUser(req.body).then(success => {
      res.status(200).send({ 'test-user' : success });
    })
  }  	
  	`
  }
  exempleRoute () {
    return `
{
	path: '/:id',
	method: 'get',
	handler: ExempleCtrl.detail
},  	
  	`
  }

  /**
   * Template Index Module
   * @return {string}
   */
  indexModule () {
    return `
/**
 * dependencies on gz
 */
require('./lib');

/**
 * load the class AppModules in gz and all methode
 */
gz.loadBootstrap();

/**
 * config loaded
 */
$GzLoadServerModules({
   moduleDB:null,
   middlewareCORS: null,
   authentication: null,
   logger: null,
   declaration:[
       'exemple'
   ]
});

/**
 * launch the server
 */
gz.start();
`
  }
  /**
   * Template package.json
   * @return {string}
   */
  package () {
    return `
{
  "name": "${this.name.toString().toDashCase()}",
  "version": "0.0.1",
  "main": "app/index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": "The application made with grizzly-cli",
  "dependencies": {
    "grizzly-cli": "git://github.com/caloudinou/grizzly-cli.git#feature/alpha-version",
    "async": "^2.6.0"
  }
}
  	`
  }
  /**
   * Template .gitignore
   * @return {string}
   */
  gitignore () {
    return `
# See http://help.github.com/ignore-files/ for more about ignoring files.

# macOS
.DS_Store

# compiled output
dist
tmp
build
logs

# misc
.sass-cache
connect.lock
coverage/*
libpeerconnection.log
npm-debug.log*
yarn-error.log
testem.log
npm-debug.log
testem.log
docs
release
public
test-run


# compiled output
dist
tmp

# dependencies
node_modules
bower_components

# ide
.idea
  	`
  }
  /**
   * Template Readme.md
   * @return {string}
   */
  readme () {
    return `
# this project is make with grizzly-cli
#### grizzly-cli used express compress and helmet
`
  }

  /**
   * Exec
   */
  exec () {
    exec(`cd ${this.name} && npm i`, (error, stdout, stderr) => {
      if (error) {
        console.error(`[ error ] ${error}`)
        return
      }
      console.log(`[ stdout ] ${stdout}`)
      console.log(`[ stderr ] ${stderr}`)
    })
  }
}

module.exports = GenerateProject
