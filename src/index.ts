import {
  AccessoryConfig,
  AccessoryPlugin,
  API,
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  HAP,
  Logging,
  Service,
} from 'homebridge';

import * as http from 'http';

let hap: HAP;

/*
 * Initializer function called when the plugin is loaded.
 */
export = (api: API) => {
  hap = api.hap;
  api.registerAccessory('LiveboxTV', LiveboxTV);
};

class LiveboxTV implements AccessoryPlugin {

  private readonly log: Logging;
  private readonly name: string;
  private ip: string;
  private tvOn = false;

  // private readonly switchService: Service;
  private readonly informationService: Service;
  private televisionService: Service;
  private speakerService: Service;

  constructor(log: Logging, config: AccessoryConfig, api: API) {
    this.log = log;
    this.name = config.name;
    this.ip = config.ip;

    this.televisionService = new hap.Service.Television(this.name);
    this.televisionService.getCharacteristic(hap.Characteristic.On)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.debug('Current state of the TV was returned: ' + (this.tvOn ? 'ON' : 'OFF'));
        callback(undefined, this.tvOn);
      })
      .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        this.tvOn = value as boolean;
        this.query(1, 116, 0);
        log.debug('TV state was set to: ' + (this.tvOn ? 'ON' : 'OFF'));
        callback();
      });

    this.televisionService.getCharacteristic(hap.Characteristic.RemoteKey)
      .onSet((newValue) => {
        switch (newValue) {
          case hap.Characteristic.RemoteKey.ARROW_UP: {
            this.query(1, 103, 0);
            log.debug('set Remote Key Pressed: ARROW_UP');
            break;
          }
          case hap.Characteristic.RemoteKey.ARROW_DOWN: {
            this.query(1, 108, 0);
            log.debug('set Remote Key Pressed: ARROW_DOWN');
            break;
          }
          case hap.Characteristic.RemoteKey.ARROW_LEFT: {
            this.query(1, 75, 0);
            log.debug('set Remote Key Pressed: ARROW_LEFT');
            break;
          }
          case hap.Characteristic.RemoteKey.ARROW_RIGHT: {
            this.query(1, 77, 0);
            log.debug('set Remote Key Pressed: ARROW_RIGHT');
            break;
          }
          case hap.Characteristic.RemoteKey.SELECT: {
            this.query(1, 28, 0);
            log.debug('set Remote Key Pressed: SELECT');
            break;
          }
          case hap.Characteristic.RemoteKey.BACK: {
            this.query(1, 158, 0);
            log.debug('set Remote Key Pressed: BACK');
            break;
          }
          case hap.Characteristic.RemoteKey.PLAY_PAUSE: {
            this.query(1, 207, 0);
            log.debug('set Remote Key Pressed: PLAY_PAUSE');
            break;
          }
          case hap.Characteristic.RemoteKey.INFORMATION: {
            log.debug('set Remote Key Pressed: INFORMATION');
            break;
          }
        }
      });

    this.speakerService = new hap.Service.TelevisionSpeaker(this.name);
    this.speakerService
      .setCharacteristic(hap.Characteristic.Active, hap.Characteristic.Active.ACTIVE)
      .setCharacteristic(hap.Characteristic.VolumeControlType, hap.Characteristic.VolumeControlType.ABSOLUTE);

    // handle volume control
    this.speakerService.getCharacteristic(hap.Characteristic.VolumeSelector)
      .onSet((newValue) => {
        // eslint-disable-next-line eqeqeq
        if (newValue == 0) {
          log.debug('Increasing volume');
          this.query(1, 115, 0);
        } else {
          log.debug('Decreasing volume');
          this.query(1, 114, 0);
        }
      });

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, 'Orange')
      .setCharacteristic(hap.Characteristic.Model, 'Livebox 4');
  }

  /*
   * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
   * Typical this only ever happens at the pairing process.
   */
  identify(): void {
    this.log('Identify!');
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

  async query(operation, key, mode) {
    this.log.debug('Requesting : ' + 'http://' + this.ip + ':8080/remoteControl/cmd?operation=' + operation + '&key=' + key + '&mode=' + mode);
    const res = await http.get({
      host: this.ip,
      port: 8080,
      method: 'get',
      path: '/remoteControl/cmd?operation=' + operation + '&key=' + key + '&mode=' + mode,
    });
    let received = '';
    res.on('data', chunk => {
      received += chunk;
    });
    res.on('end', () => {
      return JSON.parse(received);
    });
  }

}