import { StrictEventEmitter } from 'strict-event-emitter';
interface EventsMap {
    ready: () => void;
    change: (state: boolean) => void;
}
export declare class JEM1427Gpio extends StrictEventEmitter<EventsMap> {
    private monitorChannel;
    private controlChannel;
    private initialized;
    constructor(monitorChannel: number, controlChannel: number);
    /**
     * 初期設定します
     */
    init(): Promise<void>;
    /**
     * モニタ信号の値を取得します
     *
     * @returns true:運転|全閉|施錠|点灯 false:停止|全開|解錠|消灯
     */
    getMonitor(): Promise<boolean>;
    /**
     * 制御信号にパルスを送ります
     */
    sendControl(): Promise<void>;
    private checkConnect;
}
export {};
//# sourceMappingURL=JEM1427Gpio.d.ts.map