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

export interface LiftInitializeOptions {
  win: Window;
  isServer: boolean;
  deleteStateOnWindowLoad: boolean;
  initialState: any;
  mergeState: boolean;
}

export const __LIFT_STATE_KEY = '__STENCIL_LIFT_STATE';
declare var Context: any;

export class LiftService {

  private _isServer = false;
  private _store: Store;

  get isServer() {
    return this._isServer;
  }

  constructor() {
    // TODO - chat with Stencil team and see if there is a better way to pass down this instance.
    // stencil-state-tunnel is not appropriate because it has the same problem: it is designed
    // to export a global from a module that will be shared between instances.
    // Technically don't need to check Context.isServer - this is only defined on server anyway.
    if (typeof Context !== 'undefined' && Context.isServer) {
      Context.__LIFT_STATE_KEY = this;
    }
  }

  initialize(options: LiftInitializeOptions) {
    const { isServer, deleteStateOnWindowLoad, initialState, mergeState, win } = options;
    this._isServer = isServer;

    let preloadedState = (<any>win)[__LIFT_STATE_KEY] || {};
    deleteStateOnWindowLoad && (delete (<any>win)[__LIFT_STATE_KEY]);

    if (initialState) {
      preloadedState = mergeState ? { ...preloadedState, ...initialState } : initialState;
    }
    // const devToolsEnhancer = (<any>win).__REDUX_DEVTOOLS_EXTENSION__ && (<any>win).__REDUX_DEVTOOLS_EXTENSION__();
    const composeEnhancers = isServer ? compose : ((<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);
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
