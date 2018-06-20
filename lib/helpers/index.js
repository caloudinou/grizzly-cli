const PublishSubscribe = require('./publish-subscribe');
const Mediator = require('./mediator');
const Observable = require('./observable');
const Observer = require('./observer');

(function(global) {
    let gz = global.gz = global.gz || {};
    gz.helpers = gz.helpers || {};

    /**
     * new Methode for GrizzlyFrameWork
     * @type {PublishSubscribe}
     * @type {Mediator}
     * @type {Observable}
     * @type {Observer}
     */
    global.PublishSubscribe = gz.helpers.PublishSubscribe = PublishSubscribe;
    global.Mediator = gz.helpers.Mediator = Mediator;
    global.Observable = gz.helpers.Observable = Observable;
    global.Observer = gz.helpers.Observer = Observer;

    /**
     * new pollyfil for GrizzlyFrameWork
     */

})(global);