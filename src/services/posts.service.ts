import { DataService, TDataService } from './data.service';
import { Post } from './interfaces';
import { Inject, Injectable } from '../stencil-di';

export const TPostsService = Symbol.for('TPostsService');

@Injectable({
  singleton: true,
  provides: TPostsService,
})
export class PostsService {

  private _id = Math.floor(Math.random() * 10000 + 1000);

  constructor(
    @Inject(TDataService)
    private dataService: DataService,
  ) {
  }

  get ID() {
    return this._id;
  }

  async getPosts(): Promise<{ data?: Post[], error?: Error }> {
    return this.get('https://jsonplaceholder.typicode.com/posts');
  }

  async getPost(postId: string) {
    return this.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
  }

  async getComments(postId: string) {
    return this.get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
  }

  private async get(url) {
    const { data, error } = await this.dataService.get(url);
    if (error) {
      return { error };
    }
    return { data };
  }
}
