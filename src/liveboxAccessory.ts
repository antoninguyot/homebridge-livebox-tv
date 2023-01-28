import {Service, PlatformAccessory} from 'homebridge';

import {LiveboxPlatform} from './platform';
import {LiveboxInfo, LiveboxKey} from './types';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class LiveboxAccessory {
  private tvService: Service;
  private speakerService: Service;

  constructor(
      private readonly platform: LiveboxPlatform,
      private readonly accessory: PlatformAccessory,
  ) {
    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Orange')
      .setCharacteristic(this.platform.Characteristic.Model, accessory.context.device.friendlyName)
      .setCharacteristic(this.platform.Characteristic.SerialNumber, accessory.context.device.macAddress);

    // get the Television service if it exists, otherwise create a new Television service
    this.tvService = this.accessory.getService(this.platform.Service.Television)
        || this.accessory.addService(this.platform.Service.Television);
    // get the Television service if it exists, otherwise create a new Television service
    this.speakerService = this.accessory.getService(this.platform.Service.TelevisionSpeaker)
        || this.accessory.addService(this.platform.Service.TelevisionSpeaker);

    this.tvService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.friendlyName);
    this.speakerService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.friendlyName);

    this.tvService
      .setCharacteristic(
        this.platform.Characteristic.SleepDiscoveryMode,
        this.platform.Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE,
      );

    // register handlers for the On/Off Characteristic
    this.tvService.getCharacteristic(this.platform.Characteristic.Active)
      .onSet(this.setActive.bind(this))
      .onGet(this.getActive.bind(this));

    // register handlers for the Remote Characteristic
    this.tvService.getCharacteristic(this.platform.Characteristic.RemoteKey)
      .onSet(this.setRemoteKey.bind(this));

    this.speakerService
      .setCharacteristic(this.platform.Characteristic.VolumeControlType, this.platform.Characteristic.VolumeControlType.ABSOLUTE);
    this.speakerService.getCharacteristic(this.platform.Characteristic.VolumeSelector)
      .onSet(this.setVolume.bind(this));
    this.speakerService.getCharacteristic(this.platform.Characteristic.Active)
      .onGet(this.getActive.bind(this));
  }

  async getActive(): Promise<boolean> {
    const info: LiveboxInfo = await this.platform.client.ping();
    const status = info.activeStandbyState === '0';
    this.platform.log.debug('Got Livebox status : ' + (status ? 'on' : 'off'));
    return status;
  }

  async setActive(status): Promise<void> {
    const currentState = this.tvService.getCharacteristic(this.platform.Characteristic.Active).value;
    if (status !== currentState) {
      this.platform.log.debug('Turning Livebox : ' + (status ? 'on' : 'off'));
      await this.platform.client.togglePower();
    } else {
      this.platform.log.debug('Livebox already turned ' + (status ? 'on' : 'off'));
    }
  }

  async setVolume(value): Promise<void> {
    if (value as number === this.platform.Characteristic.VolumeSelector.INCREMENT) {
      this.platform.log.debug('Increasing volume');
      await this.platform.client.increaseVolume();
    } else if (value as number === this.platform.Characteristic.VolumeSelector.DECREMENT) {
      this.platform.log.debug('Decreasing volume');
      await this.platform.client.decreaseVolume();
    }
  }

  async setRemoteKey(value): Promise<void> {
    this.platform.log.debug('Remote key pressed : ' + value);
    switch (value) {
      case this.platform.Characteristic.RemoteKey.REWIND:
        await this.platform.client.sendKey(LiveboxKey.Rewind);
        break;
      case this.platform.Characteristic.RemoteKey.FAST_FORWARD:
        await this.platform.client.sendKey(LiveboxKey.FastForward);
        break;
      case this.platform.Characteristic.RemoteKey.NEXT_TRACK:
        await this.platform.client.sendKey(LiveboxKey.Right);
        break;
      case this.platform.Characteristic.RemoteKey.ARROW_UP:
        await this.platform.client.sendKey(LiveboxKey.Up);
        break;
      case this.platform.Characteristic.RemoteKey.ARROW_DOWN:
        await this.platform.client.sendKey(LiveboxKey.Down);
        break;
      case this.platform.Characteristic.RemoteKey.ARROW_LEFT:
        await this.platform.client.sendKey(LiveboxKey.Left);
        break;
      case this.platform.Characteristic.RemoteKey.ARROW_RIGHT:
        await this.platform.client.sendKey(LiveboxKey.Right);
        break;
      case this.platform.Characteristic.RemoteKey.SELECT:
        await this.platform.client.sendKey(LiveboxKey.Ok);
        break;
      case this.platform.Characteristic.RemoteKey.BACK:
        await this.platform.client.sendKey(LiveboxKey.Back);
        break;
      case this.platform.Characteristic.RemoteKey.EXIT:
        await this.platform.client.sendKey(LiveboxKey.Back);
        break;
      default:
        this.platform.log.debug('Unhandled key : ' + value);
    }
  }
}