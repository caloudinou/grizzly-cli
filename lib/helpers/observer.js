/**
 * Observable Pattern
 */
class Observer {
    /**
     * @constructor
     * @param model
     * @param data
     */
    constructor(model, data = null) {
        this.handlers = [];
        global[model] = data;
        Object.observe(global[model], this.publish);
    }

    /**
     * publish
     * @param change
     */
    publish(change){
        console.log('publish',change.type, change.name, change.oldValue);
        this.handlers.forEach(topics => {
            topics.handler(change);
        });
    }

    /**
     * subscribe
     * @param handler
     * @param handlerError
     * @param context
     */
    subscribe(handler, handlerError, context) {
        if (typeof context === 'undefined')  context = handler;
        this.handlers.push({
            handler: handler.bind(context),
            handlerError: handlerError.bind(context)
        });
    }
}

module.exports = Observer;
