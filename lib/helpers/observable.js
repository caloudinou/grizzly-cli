/**
 * observable custom publish subscribe patern
 */
class Observable {
    /**
     * @constructor
     * @param opts
     */
    constructor(opts) {
        this.handlers = [];
    }

    /**
     * attach ojb to event
     * @param obj
     */
    observe(obj) {
        obj.data = Object.assign({},obj);
        obj.Set = this.Set;
        obj.Get = this.Get;
        obj.handlers = [];
        obj.publish = this.publish;
        obj.subscribe = this.subscribe;
    }

    /**
     * subscribe
     * @param handler
     * @param handlerError
     * @param context
     * @param event
     */
    subscribe(handler, handlerError, context, event = 'changeData') {
        this.handlers.push({
            event: event,
            handler: handler.bind(context || handler),
            handlerError: handlerError ? handlerError.bind(context || handlerError) : (e, arg) => {}
        });
    }

    /**
     * publish
     * @param event
     * @param args
     */
    publish(event, args) {
        this.handlers.forEach(topic => {
            if (topic.event === event) {
                try{
                    topic.handler(args);
                } catch(e){
                    topic.handlerError(e, args);
                }
            }
        });
    }

    /**
     * setter data
     * @param obj
     * @constructor
     */
    Set(obj){
        this.data = obj;
        this.publish('changeData', this.data);
    }

    /**
     * getter data
     * @return {*}
     * @constructor
     */
    Get(){
        return this.data;
    }
}

module.exports = Observable;
