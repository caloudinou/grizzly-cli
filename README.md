# grizzly-cli
> grizzly-cli used express compress and helmet

*This readme is a draft*
## requirements
node < 7.X.X

## install
`npm install -g git://github.com/caloudinou/grizzly-cli.git#develop`


## create project
`gz new` **[nameProject]**

## list command

npm run start : launch server with reload auto when save
npm run build : build app
npm run serve : launch server
npm run build-run : build and launch server
npm test : launch all test

#### configuration on your project
create in directory app/config your file [environment]-parameters.json :
> to dev make a local-parameters.json because by default the application is run local. and a production-parameter.json to build.
>> change the environement `npm run start --env=`**[environement]**

> **certain property will be next feature**
```js
{
  "mongodb":{
    "net":{
      "port": 27017,
      "bindIp": "127.0.0.1",
      "retry": {
        "delay": 500,
        "nb": 0
      }
    },
    "security":{
      "authorization": "enabled"
    },
    "users-standard": {
      "user": "my-app",
      "pwd": "azerty3",
      "roles": ["readWrite"]
    }
  },
  "server":{
    "net":{
      "port": 4242,
      "bindIp": "127.0.0.1",
      "url": "localhost",
      "protocol": "http"
    },
    "format" : {
      "RESTApi": true,
      "JSONApi": false
    }
  },
  "services":{
    "mailing": {},
    "sms": {},
    "push-notify":{}
  },
  "environments":[
    "dev",
    "local",
    "staging",
    "prod"
  ],
  "environment":{
    "prod": false,
    "type": "dev",
    "cache-api": 0,
    "log": {
      "level" : "higth",
      "targetSource": "./tmp/log"
    }
  },
  "ldap": {
    "desc": "Configuration auth LDAP (Active Directory)",

    "desc-enabled": "Active auth LDAP",
    "enabled": false,

    "desc-server": "URL server LDAP",
    "server": "LDAP://COMMUN.AD.TOTO.FR",

    "desc-baseDn": "search user",
    "baseDn": "dc=COMMUN,dc=AD,dc=TOTO,dc=fr",

    "desc-filter": "filter to search user",
    "filter": "(&(objectClass=user)(sAMAccountName=%s))",

    "group-desc": "group",
    "group":"COMMUN"
  }
}
```

## create module
`gz g module` **[nameModule]**

#### a module directory content :
module

    |
    |___controllers
    |
    |___models
    |
    |___routers
    |
    |___helpers (optional)
    |
    |__index.js

## route
###### file index.js description :

add your nameRoute in the `$GzModule`

the nameRoute -> **[nameRoute].router.js**

```js
$GzModule({
  name: [nameModule],
  mode: 'hybrid-mvc', ->(no change is a next feature)
  router: [
    [nameRoute],
    ...
  ]
})
```

###### route file in directory routers :
```js
$GzRouter({
  name: [nameRoute],
  routes: [
    {
      path: [pathOfRoute],
      method: [method HTTP request (get|post|patch|put|delete)],
      handler: [nameMethodController]
    }
  ]
})

```

## bdd
your directory app :

app

    |
    |___config
    |
    |___helpers
    |
    |___modules
    |
    |__index.js

###### to active bdd (beta):
app/index.js
```js
$GzLoadServerModules({
   moduleDB:null,
   ...
});
```
`moduleBD` (`null` or `'default'`|`'none'`|`'other'`)

* `null` or `default` active MongoDB
* `none` bdd no active
* `other` (next feature)

#### use the default bd
in the models use the object `db`
```js
 /**
  * @return Promise<T>
  */
 db.collection([YourNameOfCollection])
        .[methodMongo]()
```

#### subscribe in the bdd 'ok'
in the `constructor` in your model use `gz.moduleMongoDB.db.subscribe`:
```js
constructor () {

  // initialization of data base or check the data in initialization of app
  gz.moduleMongoDB.db.subscribe(() => {
    db.collection([YourNameOfCollection])
      .[methodMongo]()
  })

}
```



## create controller
`gz g controller` **[nameModule]**/**[nameController]**

## helpers

#### method string
| name | Description | Global |
| ------ | ----------- | ------ |
| `toUnderCase`| | :+1: |
| `toDashCase`| | :+1: |
| `toCapitalCase`| | :+1: |
| `toUpperCase`| | :+1: |
| `toPascalCase`| | :+1: |
| `tokamelCase`| | :+1: |
| `toAllWordsCapitalCase`| | :+1: |

#### method and pattern
| name | global | framework helper |
| ------ | ----------- | ------ |
| Mediator |  `Mediator` | `gz.helpers.Mediator`|
| Observable |  `Observable` | `gz.helpers.Observable`|
| PublishSubscribe |  `PublishSubscribe` | `gz.helpers.PublishSubscribe`|


#bug

fix bug :
bug first launch app => exemples.controler.js :
```js
const Exemples = require(`${__modules}/exemple/models/exemple.model`);
```
mongodb authentification faild :
local-parameters.json >
if you set user in your mongoDB
```
"mongodb":{
    "net":{
      "port": 27017,
      "bindIp": "127.0.0.1",
      "retry": {
        "delay": 500,
        "nb": 0
      }
    },
    "security":{
      "authorization": "enabled"
    },
    "users-standard": {
      "user": [your user bdd],
      "pwd": [your password],
      "roles": ["readWrite"]
    }
  },
```
if you dont have an user in your mongoDB
```
"mongodb":{
    "net":{
      ...
    },
    "security":{
      "authorization": "disable"
    },
    "users-standard": {
      ...
    }
  },
```

