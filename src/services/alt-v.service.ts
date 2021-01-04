import { ScriptEventType } from '../shared/constants';

export class AltVService {

  /**
   * Check if window has property alt
   *
   * @type {boolean}
   * @private
   */
  private static valid: boolean = window['alt'] !== undefined;

  /**
   * Listen to event
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public static on(eventName: string, listener: (...args: any[]) => void): void {
    if (this.valid) {
      window['alt'].on(eventName, listener);
    }
  }

  /**
   * Unsubscribe from event
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public static off(eventName: string, listener: (...args: any[]) => void): void {
    if (this.valid) {
      window['alt'].off(eventName, listener);
    }
  }

  /**
   * Emit event to client
   *
   * @param {string} eventName
   * @param args
   */
  public static emit(eventName: string, ...args: any[]): void {
    if (this.valid) {
      window['alt'].emit(eventName, ...args);
    } else {
      this.consoleLog(eventName, args);
    }
  }

  /**
   * Emit event to server, use client as bridge
   * @param {string} eventName
   * @param args
   */
  public static emitServer(eventName: string, ...args: any[]): void {
    if (this.valid) {
      window['alt'].emit(ScriptEventType.Webview.EmitServer, eventName, ...args);
    } else {
      this.consoleLog(eventName, args);
    }
  }

  /**
   * Print auth the emit events
   *
   * @param {string} eventName
   * @param args
   * @private
   */
  private static consoleLog(eventName: string, ...args: any[]): void {
    console.log(`Alt-Service: Emit Event - ${eventName}`);
    console.log(`Alt-Service: Params for Event - ${JSON.stringify(args)
        .replace('[', '')
        .replace(']', '')}`
    );
  }
}
