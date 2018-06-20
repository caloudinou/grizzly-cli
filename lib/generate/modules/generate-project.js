const Template = require('./template')
const TemplateExemple = require('./templates/exemple')
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
   * @todo: 4 last writeFlieSync to optimize
   */
  make () {
    this.templateObj = new Template(['g', 'module', 'exemple', 'exemple'])
    this.makeProject.then(() => {
      this.afterCreateProject()
    })
  }
  async makeProject(){
    await this.urls.forEach(url => {
      this.templateObj.createDirectoriesRecurcive({directoryURL: url})
        .then(success => {
          console.log('\x1b[30m\x1b[42m%s\x1b[0m', '[ success ]')
          console.log('\x1b[32m%s\x1b[0m',  JSON.stringify(success))
          this.urls.forEach(directory => {
            let data = ''
            fs.writeFileSync(directory + '.gitkeep', data, 'utf8')
          })
        }, error => {
          console.log('\x1b[30m\x1b[41m%s\x1b[0m', '[ error ]')
          console.log('\x1b[31m%s\x1b[0m',  error)
        })
    })
  }
  afterCreateProject () {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!  [---FMG---]  !!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    fs.writeFileSync(__base + '/app/index.js', this.indexModule(), 'utf8')
    fs.writeFileSync(__base + '/package.json', this.package(), 'utf8')
    fs.writeFileSync(__base + '/.gitignore', this.gitignore(), 'utf8')
    fs.writeFileSync(__base + '/readme.md', this.readme(), 'utf8')
    this.exec().then(() => {
      console.log('fmg')
      new TemplateExemple(__base).init()
    })
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
   * @todo: file read on readme.md in projet
   */
  readme () {
    let data = null
    try {
      data = fs.readFileSync(__dirname.split('lib')[0] + 'README.md', 'utf8')
      data.replace('# grizzly-cli\n> grizzly-cli used express compress and helmet',`
# ${this.name.toString().toDashCase()}
> this project is make with grizzly-cli. grizzly-cli used express compress and helmet`);
    } catch(e) {

      console.log('\x1b[30m\x1b[41m%s\x1b[0m', '[ error ]')
      console.log('\x1b[31m%s\x1b[0m',  e.stack)
      data = `
# ${this.name.toString().toDashCase()}
> this project is make with grizzly-cli. grizzly-cli used express compress and helmet
`;
    }
    return data
  }

  /**
   * Exec
   */
  async exec () {
    let { stdout, stderr } = await exec(`cd ${this.name} && npm i`)
      if (stdout) {
        console.log('\x1b[30m\x1b[42m%s\x1b[0m', '[ stdout ]')
        console.log('\x1b[32m%s\x1b[0m',  stdout)
      }
      if (stderr) {
        console.log('\x1b[30m\x1b[41m%s\x1b[0m', '[ stderr ]')
        console.log('\x1b[31m%s\x1b[0m',  stderr)
      }
  }
}

module.exports = GenerateProject
