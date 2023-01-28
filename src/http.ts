import axios, {AxiosInstance} from 'axios';
import {Logger} from 'homebridge';
import {LiveboxInfo, LiveboxKey} from './types';

export class LiveboxClient {
  private readonly client: AxiosInstance;

  constructor(private readonly logger: Logger, ip: string) {
    this.client = axios.create({
      baseURL: `http://${ip}:8080/remoteControl/cmd`,
    });
  }

  public async query(operation: number, key: number, mode: number) {
    this.logger.debug('Requesting : ' + this.client.defaults.baseURL + '?operation=' + operation + '&key=' + key + '&mode=' + mode);
    try {
      const res = await this.client.get('', {params: {operation, key, mode}});
      const json = res.data.result;
      if (json.message !== 'ok') {
        this.logger.error('Error while querying Livebox : ' + json.message);
        return json;
      }
      return json.data;
    } catch (e) {
      this.logger.error('Error while requesting : ' + e);
    }
  }

  public async ping(): Promise<LiveboxInfo> {
    return this.query(10, 0, 0);
  }

  public async sendKey(key: LiveboxKey) {
    return this.query(1, key, 0);
  }

  public async togglePower() {
    return this.sendKey(LiveboxKey.Power);
  }

  public async increaseVolume() {
    return this.sendKey(LiveboxKey.VolPlus);
  }

  public async decreaseVolume() {
    return this.sendKey(LiveboxKey.VolMin);
  }
}