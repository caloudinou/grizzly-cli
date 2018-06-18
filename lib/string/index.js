
(function(global) {
    global.String.prototype.toUnderCase = function() {
        return this.replace(/[A-Z]/g, (char, index) => ((index !== 0 ? '_' : '') + char.toLowerCase()));
    };
    global.String.prototype.toDashCase = function() {
        return this.replace(/[A-Z]/g, (char, index) => ((index !== 0 ? '-' : '') + char.toLowerCase()));
    };
    global.String.prototype.toCapitalCase = function() {
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    };
    global.String.prototype.toPascalCase = function() {
        return this.split(/(\s|-|_)/).map(word => word.toCapitalCase()).join('');
    };
    global.String.prototype.tokamelCase = function() { //TODO: kamelCase -> CamelCase
        return this.split(/(\s|-|_)/).map((word, index) => (index === 0 ? word.toLowerCase() : word.toCapitalCase())).join('');
    };
    global.String.prototype.toAllWordsCapitalCase = function() {
        return this.split(/(\s|-|_)/).map(word => word.toCapitalCase()).join('');
    };
})(global);