const PublishSubscribe = require('./publish-subscribe');
/**
 * Mediator Pattern
 */
class Mediator extends PublishSubscribe {
    /**
     * @constructor
     * @param opts
     */
    constructor(opts) {
        super();
    }

    /**
     * attach ojb to event
     * @param obj
     */
    attachToObject(obj) {
        obj.handlers = [];
        obj.publish = this.publish;
        obj.subscribe = this.subscribe;
    }
}

module.exports = Mediator;
