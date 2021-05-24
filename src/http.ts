import {LiveboxKeys, LiveboxModes} from './bindings';
import fetch from 'node-fetch';
import {LiveboxTV} from './accessory';

/**
 * Sends an HTTP request to the Livebox
 * @param accessory
 * @param operation
 * @param key
 * @param mode
 */
export const query = async (accessory : LiveboxTV, operation, key = LiveboxKeys.BACK, mode = LiveboxModes.KEYPRESS) => {
  accessory.log.debug(
    'Requesting : ' +
    'http://' + accessory.config.ip + ':8080/remoteControl/cmd?operation=' + operation + '&key=' + key + '&mode=' + mode,
  );
  const res = await fetch('http://' + accessory.config.ip + ':8080' +
    '/remoteControl/cmd?operation=' + operation + '&key=' + key + '&mode=' + mode);
  return await res.json();
};