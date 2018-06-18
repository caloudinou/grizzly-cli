
const MongoDB = require('mongodb');

class MongoHandler {

  /**
   * Contruit l'instance et initialise l'URL d'accès à la base à une valeur par défaut.
   * @constructor
   */
  constructor () {
    this.baseName = require(`${__base.replace(/\/(app||app\/)$/, '')}/package`).name;
    this.MongoClient = MongoDB.MongoClient;
    // this.Server = MongoDB.Server;
    // this.ReplSetServers = MongoDB.ReplSetServers;
    this.ObjectID = MongoDB.ObjectID;
    // this.Binary = MongoDB.Binary;
    this.GridStore = MongoDB.GridStore;
    // this.Grid = MongoDB.Grid;
    // this.Code = MongoDB.Code;



    this.db = {};
    this.clientMongoDb = {};

    this.setParams();
    new Observable().observe(this.clientMongoDb);
    new Observable().observe(this.db);

    this._launchSubscribe();

    return this;
  }
  _launchSubscribe() {
    this.clientMongoDb.subscribe(
      () => {
        this.db.Set(this.clientMongoDb.Get().db(this.baseName))
      },
      error => {
        console.log('[mongoDB :: subscribe-client]','bad exec', error)
      }
    );

    this.db.subscribe(
      () => {
        global.db = this.db.Get();
        console.info('[mongoDB :: subscribe-db]', 'open transaction bdd');
        // db.collection('test-users').insertOne({ name: 'pascal', post: 'supervisor'}).then(success => { console.log(success)}, error => { console.log(error)});

      },
      error => {
        console.log('[mongoDB :: subscribe-db]','bad exec', error)
      }
    );
  }
  /**
   * Setter Url
   */
  setParams () {
    this.url = gz.parameters.mongodb;
    this.retryConnectionDelay = gz.parameters.mongodb.net.retry.delay;
    this.nbRetryConnection = gz.parameters.mongodb.net.retry.nb;

    console.log('[mongoDB :: setParams]', this.url);
    console.log('[mongoDB :: setParams]', this.retryConnectionDelay);
    console.log('[mongoDB :: setParams]', this.nbRetryConnection);
  }

  /**
   *
   * @param mongodb{Object}
   */
  set url(mongodb) {
     this._url = `mongodb://${
       mongodb.security.authorization === 'enabled'
         ? mongodb['users-standard'].user + ':' + mongodb['users-standard'].pwd + '@'
         : ''
       }${mongodb.net.bindIp}:${mongodb.net.port}/${this.baseName}`;
  }
  /**
   * Getter Url
   * @return {string}
   */
  get url(){
    return this._url;
  }
  set retryConnectionDelay(delay) {
    this._retryDelay = parseInt(delay ,0);
  }
  get retryConnectionDelay() {
    return this._retryDelay;
  }
  set nbRetryConnection(nbRetry) {
    this._nbRetryConnection = parseInt(nbRetry ,0);
  }
  get nbRetryConnection() {
    return this._nbRetryConnection;
  }
  /**
   * Connecte la base MongoDB et réessaie périodiquement jusqu'à ce que la connexion soit établie.
   * @returns {Promise}
   */
  connect() {
    console.log('[MongoDB :: connect]', 'connection ...');
    this.MongoClient.connect(this.url,(errorConnectMongoDb, clientMongoDb) => {
        if(errorConnectMongoDb) return this.reconnect(errorConnectMongoDb);
        this.clientMongoDb.Set(clientMongoDb);
      })
  }
  reconnect(err){
    console.log('[MongoDB :: reconnect]', this.nbRetryConnection);
    console.log('[MongoDB :: reconnect]', err);
    console.log('[MongoDB :: reconnect]',((this.nbRetryConnection === 0)
      ? 'Impossible de se connecter à la base de données.'
      : 'Impossible de se connecter à la base de données. Encore ' + this.nbRetryConnection + ' essais'));


    if (this.nbRetryConnection > 0) {

      setTimeout(() => {

        console.log('MongoDB :: reconnect', this.nbRetryConnection);
        this.nbRetryConnection--;
        console.log('end :: reconnect', this.nbRetryConnection);

        this.connect();

      }, this.retryConnectionDelay).bind(this);

    }
  }
}

module.exports = MongoHandler;
