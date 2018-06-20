/**
 * Publish/Subscribe Pattern
 */
class PublishSubscribe {
    /**
     * @constructor
     */
    constructor() {
        this.handlers = [];
    }

    /**
     * subscribe to event publish
     * @param event
     * @param handler
     * @param context
     */
    subscribe(event, handler, context) {
        if (typeof context === 'undefined') { context = handler; }
        this.handlers.push({ event: event, handler: handler.bind(context) });
    }

    /**
     * publish event for subscribe
     * @param event
     * @param args
     */
    publish(event, args) {
        this.handlers.forEach(topic => {
            if (topic.event === event) {
                topic.handler(args)
            }
        })
    }
}

module.exports = PublishSubscribe;
