import { DataService, TDataService } from './data.service';
import { InjectProp, Injectable } from '@engineerapart/ts-universal-inject';
import { User } from '~types/services';

export const TUsersService = Symbol.for('TUsersService');

@Injectable({
  singleton: true,
  provides: TUsersService,
  requires: [ TDataService ],
})
export class UsersService {

  private _id = Math.floor(Math.random() * 10000 + 1000);
  @InjectProp(TDataService) private dataService: DataService;

  constructor(dataService: DataService) {
    console.log('UsersService got dataService:', dataService, this.dataService);
  }

  get ID() {
    return this._id;
  }

  async getUsers(): Promise<{ data?: User[], error?: Error }> {
    const { data, error } = await this.dataService.get('https://jsonplaceholder.typicode.com/users');
    if (error) {
      return { error };
    }

    return { data };
  }

  async getUser(userId: string) {
    const { data, error } = await this.dataService.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (error) {
      return { error };
    }

    return { data };
  }
}
