const fs = require('fs');
const util = require('util')
const exec = util.promisify(require('child_process').exec)

class Exemple {
  constructor (basePath) {
    this.__base = basePath
    this.__modulesExemple = basePath + '/app/modules/exemple/'
    this.exempleReplaceObj = {
      model: {
        url: this.__modulesExemple + 'models/exemple.model.js',
        contentTarget: 'constructor(){}',
        contentReplace: this.exempleModelCore()
      },
      route: {
        url: this.__modulesExemple + 'routers/exemple.router.js',
        contentTarget: `
	{
	  path: '/',
	  method: 'get',
	  handler: ExempleCtrl.detail
	},`,
        contentReplace: this.exempleRoute()
      },
      controller: {
        url: this.__modulesExemple + 'controllers/exemple.controller.js',
        contentTarget: `
  detail(req, res) {
	res.status(501).send({ error : 'NOT IMPLEMENTED: Exemple detail: ' + req.params.id});
  }

  create(req, res) {
	res.status(501).send({ error : 'NOT IMPLEMENTED: Exemplecreate: ' + req.params.id});
  }`,
        contentReplace: this.exempleControllerDetail() + this.exempleControllerCreate()
      }
    }
    return this
  }
  init() {
      Object.keys(this.exempleReplaceObj).forEach(name => {
        this.replaceContent(name)
      })
  }
  replaceContent(name) {
    let data = null
    try {
      data = fs.readFileSync(this.exempleReplaceObj[name].url, 'utf8')
      console.log(data)
      data = data.replace(this.exempleReplaceObj[name].contentTarget, this.exempleReplaceObj[name].contentReplace);

      console.log(data)
    } catch(e) {
      console.log('\x1b[30m\x1b[41m%s\x1b[0m', '[ error ]')
      console.log('\x1b[31m%s\x1b[0m',  e.stack)
    }
    return data
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
  }`
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
  }
  `
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
   * Exec
   */
  async exec () {
    let { stdout, stderr } = await exec(`cd ${this.__base} && gz g module exemple`);

      if (stderr) {
        console.log('\x1b[30m\x1b[41m%s\x1b[0m', '[ stderr template exemple ]')
        console.log('\x1b[31m%s\x1b[0m',  stderr)
      }

      console.log('\x1b[30m\x1b[42m%s\x1b[0m', '[ stdout  template exemple ]')
      console.log('\x1b[32m%s\x1b[0m',  stdout)
    }
}

module.exports = Exemple