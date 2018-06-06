import { Action, Store, applyMiddleware, combineReducers, compose, createStore } from 'redux';

const LIFT_SET = 'LIFT_SET';
export interface LiftSet {
  key: string;
  payload: any;
}

interface LiftAction extends Action<string>, LiftSet { }

const stencilReducer = (state = {}, action: LiftAction) => {
  const { type, payload, key } = action;
  if (type !== LIFT_SET) { return state; }
  return {
    ...state,
    [key]: payload,
  };
};

const combinedReducers = combineReducers({ stencil_data: stencilReducer });

// TODO: Fully integrate https://github.com/ionic-team/stencil-redux or
// re-implement the mapping & field setting functionality, but we can do it via a decorator!
// Also https://github.com/reduxjs/reselect

export class LiftService {

  private _isServer = false;
  private _store: Store;

  get isServer() {
    return this._isServer;
  }

  initialize(isServer: boolean) {
    this._isServer = isServer;
    const preloadedState = (<any>window)._STENCIL_LIFT || {};
    // const devToolsEnhancer = (<any>window).__REDUX_DEVTOOLS_EXTENSION__ && (<any>window).__REDUX_DEVTOOLS_EXTENSION__();
    const composeEnhancers = isServer ? compose : (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    this._store = createStore(combinedReducers, preloadedState, composeEnhancers(applyMiddleware()));
  }

  get(key: string) {
    const { stencil_data } = this._store.getState();
    return stencil_data[key];
  }

  set(action: LiftSet) {
    this._store.dispatch({ type: LIFT_SET, ...action });
  }

  export() {
    const state = this._store.getState();
    return state;
  }

}

export default new LiftService();
