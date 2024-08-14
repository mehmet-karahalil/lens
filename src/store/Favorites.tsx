import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type Favorite = {
  uri: string | undefined;
};

type FavoritesState = {
  favorites: Favorite[];
};

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<string | undefined>) {
      state.favorites.push({uri: action.payload});
    },
    deleteFavorite(state, action: PayloadAction<string | undefined>) {
      state.favorites = state.favorites.filter(
        favorite => favorite.uri !== action.payload,
      );
    },
  },
});

export const {addFavorite, deleteFavorite} = favoritesSlice.actions;
export default favoritesSlice.reducer;
