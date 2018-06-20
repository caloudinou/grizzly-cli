
let params = process.argv.splice(2)
const Template = require('./template')
const GenerateProject = require('./generate-project')

if (params[0] === 'g') new Template(params)

if (params[0] === 'new') new GenerateProject(params[1]).make()
