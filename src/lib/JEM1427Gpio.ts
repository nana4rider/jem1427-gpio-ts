import * as gpio from 'rpi-gpio';
import { StrictEventEmitter } from 'strict-event-emitter';

interface EventsMap {
  ready: () => void;
  change: (state: boolean) => void;
}

// 参考: https://mtrx.jp/info/jema.html
export class JEM1427Gpio extends StrictEventEmitter<EventsMap> {
  private initialized = false;

  constructor(private monitorChannel: number, private controlChannel: number) {
    super();
  }

  /**
   * 初期設定します
   */
  async init(): Promise<void> {
    gpio.setMode(gpio.MODE_BCM);

    await gpio.promise.setup(this.monitorChannel, gpio.DIR_IN, gpio.EDGE_BOTH);
    await gpio.promise.setup(this.controlChannel, gpio.DIR_OUT);

    gpio.on('change', (channel: number, value: boolean) => {
      if (channel === this.monitorChannel) {
        this.emit('change', value);
      }
    });

    this.initialized = true;
    this.emit('ready');
  }

  /**
   * モニタ信号の値を取得します
   *
   * @returns true:運転|全閉|施錠|点灯 false:停止|全開|解錠|消灯
   */
  async getMonitor(): Promise<boolean> {
    this.checkConnect();
    return gpio.promise.read(this.monitorChannel);
  }

  /**
   * 制御信号にパルスを送ります
   */
  async sendControl(): Promise<void> {
    this.checkConnect();
    await gpio.promise.write(this.controlChannel, true);
    await new Promise(resolve => setTimeout(resolve, 250));
    await gpio.promise.write(this.controlChannel, false);
  }

  private checkConnect(): void {
    if (!this.initialized) throw new Error('Not connected.');
  }
}
