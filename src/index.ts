import {API} from 'homebridge';
import {LiveboxTV} from './accessory';

export = (api: API) => {
  api.registerAccessory('LiveboxTV', LiveboxTV);
};
