"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeProxy = void 0;
function makeProxy(getThing) {
    return new Proxy({}, {
        defineProperty(_, property, attributes) {
            return Reflect.defineProperty(getThing(), property, attributes);
        },
        deleteProperty(_, property) {
            return Reflect.get(getThing(), property);
        },
        get(_, property) {
            return Reflect.get(getThing(), property, getThing());
        },
        getOwnPropertyDescriptor(_, property) {
            return Reflect.getOwnPropertyDescriptor(getThing(), property);
        },
        getPrototypeOf(_) {
            return Reflect.getPrototypeOf(getThing());
        },
        has(_, key) {
            return Reflect.has(getThing(), key);
        },
        isExtensible(_) {
            return Reflect.isExtensible(getThing());
        },
        ownKeys(_) {
            return Reflect.ownKeys(getThing());
        },
        preventExtensions(_) {
            return Reflect.preventExtensions(getThing());
        },
        set(_, property, value) {
            return Reflect.set(getThing(), property, value, getThing());
        },
        setPrototypeOf(_, proto) {
            return Reflect.setPrototypeOf(getThing(), proto);
        },
    });
}
exports.makeProxy = makeProxy;
//# sourceMappingURL=make_proxy.js.map