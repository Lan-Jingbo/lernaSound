import { createStore, combineReducers, applyMiddleware } from 'redux';
import settingsReducer from './reducers/settingsReducer';
import dataReducer from './reducers/dataReducer';
import videoReducer from './reducers/videoReducer';
import chewingFrequencyReducer from './reducers/chewingFrequencyReducer';

const rootReducer = combineReducers({
    settings: settingsReducer,
    data: dataReducer,
    video: videoReducer,
    chewingFrequency: chewingFrequencyReducer,
});

const store = createStore(rootReducer);

export default store;
