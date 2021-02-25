import axios, {Method} from 'axios';
import * as _ from 'lodash';

export interface IArBoxAppConfig {
  boxId: number;
  boxName: string;
  email: string;
  password: string;
  token: string;
}

export default class ArBoxAppConnection {
  config: IArBoxAppConfig;
  token: string;
  debug: boolean;
  demoMode: boolean;

  constructor(config: IArBoxAppConfig, debug = true, demoMode = false) {
    this.config = config;
    this.token = config.token ?? '';
    this.debug = debug;
    this.demoMode = demoMode;
  }

  async serverRequest(url: string, method: Method, data?: {}) {
    if (this.debug) {
      console.log('[Debug] serverRequest :: ', method, url, data);
    }

    const accesstoken = this.token;
    console.log(url, method, data);

    if (!this.demoMode) {
      return axios({
        url,
        method,
        data,
        headers: {
          boxfk: this.config.boxId,
          accesstoken,
          'User-Agent': this.config.boxName,
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=UTF-8',
          Host: 'api.arboxapp.com',
          Origin: 'https://panel.arboxapp.com',
        },
      });
    }

    console.log(
      '[Debug] serverRequest :: DEMO MODE! skipping a real server call'
    );

    return Promise.resolve({data: 'demo data'});
  }

  async isConnected(): Promise<boolean> {
    if (this.debug) {
      console.log('[Debug] isConnected :: checking if connected');
    }

    try {
      const serverData = await this.serverRequest(
        `https://api.arboxapp.com/index.php/api/v1/notifications/byBox/${this.config.boxId}?page=1`,
        'get'
      );

      const res = !_.isNil(_.get(serverData, 'data'));

      if (this.debug) {
        console.log('[Debug] isConnected ::', res);
      }

      return true;
    } catch (e) {
      if (this.debug) {
        console.log('[Debug] isConnected :: false');
      }

      return false;
    }
  }

  async generateSessionToken() {
    console.log({
      email: this.config.email,
      password: this.config.password,
    });

    // if previos token isnt working its either errorneous or broken
    this.token = "";

    const serverData = await this.serverRequest(
      `https://api.arboxapp.com/index.php/api/v1/user/${this.config.email}/session`,
      'POST',
      {
        email: this.config.email,
        password: this.config.password,
      }
    ).catch((e) => {
      throw new Error(`cant login with your credentials : ${e}`);
    });

    const jwtSessionToken = serverData.data.token;

    if (this.debug) {
      console.log('[Debug] connect :: obtained jwtSession', jwtSessionToken);
    }
    return jwtSessionToken;
  }

  async forceConnection() {
    const isConnected = await this.isConnected();
    if (!isConnected) {
      this.token = await this.generateSessionToken();
    }
  }
}
