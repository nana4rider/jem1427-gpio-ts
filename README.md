# jem1427-gpio-ts

JEM1427(HA端子、JEM-A端子)をGPIOで操作するためのライブラリです。

## Usage
```ts
// BCM
const GPIO_CONTROL_CHANNEL = 20;
const GPIO_MONITOR_CHANNEL = 21;

const jema = new JEM1427Gpio(GPIO_CONTROL_CHANNEL, GPIO_MONITOR_CHANNEL);
await jema.init();

jema.on('ready', () => {
  console.log('Ready!');
});

jema.on('change', state => {
  console.log(`The door is ${state ? 'locked': 'unlocked'}.`);
});

if (await jema.getMonitor()) { // When the door is locked.
  await jema.sendControl(); // Unlock the door.
}
```
