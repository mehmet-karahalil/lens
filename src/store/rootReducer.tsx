import favoritesReducer from './Favorites';

import {combineReducers} from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  // diğer dilimleri burada ekleyin
});

export default rootReducer;
