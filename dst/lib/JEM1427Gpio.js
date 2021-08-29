"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JEM1427Gpio = void 0;
const gpio = require("rpi-gpio");
const strict_event_emitter_1 = require("strict-event-emitter");
// 参考: https://mtrx.jp/info/jema.html
class JEM1427Gpio extends strict_event_emitter_1.StrictEventEmitter {
    constructor(monitorChannel, controlChannel) {
        super();
        this.monitorChannel = monitorChannel;
        this.controlChannel = controlChannel;
        this.initialized = false;
    }
    /**
     * 初期設定します
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            gpio.setMode(gpio.MODE_BCM);
            yield gpio.promise.setup(this.monitorChannel, gpio.DIR_IN, gpio.EDGE_BOTH);
            yield gpio.promise.setup(this.controlChannel, gpio.DIR_OUT);
            gpio.on('change', (channel, value) => {
                if (channel === this.monitorChannel) {
                    this.emit('change', value);
                }
            });
            this.initialized = true;
            this.emit('ready');
        });
    }
    /**
     * モニタ信号の値を取得します
     *
     * @returns true:運転|全閉|施錠|点灯 false:停止|全開|解錠|消灯
     */
    getMonitor() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnect();
            return gpio.promise.read(this.monitorChannel);
        });
    }
    /**
     * 制御信号にパルスを送ります
     */
    sendControl() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnect();
            yield gpio.promise.write(this.controlChannel, true);
            yield new Promise(resolve => setTimeout(resolve, 250));
            yield gpio.promise.write(this.controlChannel, false);
        });
    }
    checkConnect() {
        if (!this.initialized)
            throw new Error('Not connected.');
    }
}
exports.JEM1427Gpio = JEM1427Gpio;
//# sourceMappingURL=JEM1427Gpio.js.map