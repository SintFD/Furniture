export default class LocalStorage {
  static createLocalArr(name: string) {
    !localStorage.getItem(name) &&
      localStorage.setItem(name, JSON.stringify([]));
  }

  static getLocalArr(name: string): [] {
    return JSON.parse(localStorage.getItem(name)!);
  }

  static setLocalArr(name: string, productId: number) {
    const arr: Object[] = this.getLocalArr(name);
    arr.push(productId);
    return localStorage.setItem(name, JSON.stringify(arr));
  }
}
