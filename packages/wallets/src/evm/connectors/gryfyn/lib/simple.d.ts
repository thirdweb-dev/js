/// <reference types="node" />
import EventEmitter from 'events';

declare class GryFynProvider extends EventEmitter {
    constructor(log: string);
    myMethod(): boolean;
}
export default GryFynProvider;
