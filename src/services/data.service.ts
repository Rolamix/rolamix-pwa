import { Injectable } from '@engineerapart/ts-universal-inject';

export const TDataService = Symbol.for('TDataService');

@Injectable(TDataService)
export class DataService {
  async get(url: string) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  // Could define POST here too, but we don't need to post to the test service.
}
