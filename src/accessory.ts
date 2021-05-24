import {AccessoryConfig, AccessoryPlugin, API, Logging, Service} from 'homebridge';
import {Bindings, LiveboxKeys, LiveboxOperations} from './bindings';
import {query} from './http';


export class LiveboxTV implements AccessoryPlugin {

  private readonly informationService: Service;
  private readonly televisionService: Service;
  private readonly speakerService: Service;

  constructor(
    public readonly log: Logging,
    public readonly config: AccessoryConfig,
    public readonly api: API,
  ) {
    // Basic TV Support (On/Off status)
    this.televisionService = new this.api.hap.Service.Television(this.config.name);
    this.televisionService.getCharacteristic(this.api.hap.Characteristic.Active)
      .onGet(this.getActive.bind(this))
      .onSet(this.setActive.bind(this));

    // TV Remote support
    this.televisionService.getCharacteristic(this.api.hap.Characteristic.RemoteKey).onSet(this.setRemoteKey.bind(this));

    // TV volume control
    this.speakerService = new this.api.hap.Service.TelevisionSpeaker(this.config.name);
    this.speakerService
      .setCharacteristic(this.api.hap.Characteristic.Active, this.api.hap.Characteristic.Active.ACTIVE)
      .setCharacteristic(this.api.hap.Characteristic.VolumeControlType, this.api.hap.Characteristic.VolumeControlType.ABSOLUTE);
    this.speakerService.getCharacteristic(this.api.hap.Characteristic.VolumeSelector).onSet(this.setVolume.bind(this));
    this.speakerService.getCharacteristic(this.api.hap.Characteristic.Active).onGet(this.getActive.bind(this));

    // Other infos gathered about this Livebox
    this.informationService = new this.api.hap.Service.AccessoryInformation()
      .setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'Orange');
    this.informationService.getCharacteristic(this.api.hap.Characteristic.Model).onGet(this.getModel.bind(this));
    this.informationService.getCharacteristic(this.api.hap.Characteristic.SerialNumber).onGet(this.getSerialNumber.bind(this));
  }

  async getModel(): Promise<string> {
    const response = await query(this, LiveboxOperations.INFO);
    return response.result.data.friendlyName;
  }

  async getSerialNumber(): Promise<string> {
    const response = await query(this, LiveboxOperations.INFO);
    return response.result.data.macAddress;
  }

  async getActive(): Promise<boolean> {
    const response = await query(this, LiveboxOperations.INFO);
    const status = response.result.data.activeStandbyState === '0';
    this.log.debug('Got Livebox status : ' + (status ? 'on' : 'off'));
    return status;
  }

  async setActive(status): Promise<void> {
    const currentState = this.televisionService.getCharacteristic(this.api.hap.Characteristic.Active).value;
    if (status !== currentState) {
      this.log.debug('Turning Livebox : ' + (status ? 'on' : 'off'));
      await query(this, 1, LiveboxKeys.POWER, 0);
    } else {
      this.log.debug('Livebox already turned ' + (status ? 'on' : 'off'));
    }
  }

  async setRemoteKey(value): Promise<void> {
    if (value as number in Bindings) {
      this.log.debug('Key press recorded : ' + value);
      await query(this, LiveboxOperations.KEY, Bindings[value as number], 0);
    } else {
      this.log.debug('Unsupported key press : ' + value);
    }
  }

  async setVolume(value): Promise<void> {
    if (value as number === this.api.hap.Characteristic.VolumeSelector.INCREMENT) {
      this.log.debug('Increasing volume');
      await query(this, LiveboxOperations.KEY, LiveboxKeys.VOLPLUS);
    } else if (value as number === this.api.hap.Characteristic.VolumeSelector.DECREMENT) {
      this.log.debug('Decreasing volume');
      await query(this, LiveboxOperations.KEY, LiveboxKeys.VOLMIN);
    }
  }

  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices(): Service[] {
    return [
      this.informationService,
      this.televisionService,
      this.speakerService,
    ];
  }
}