export default class Service {
  static instance = Service.instance || new Service();

  constructor() {
    this.screen = {
      componentId: 'HOME',
    };
  }

  setScreenData(data = {}) {
    this.screen = data;
  }

  getScreenId() {
    return this.screen.componentId;
  }
}
