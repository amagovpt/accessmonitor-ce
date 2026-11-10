import { configureStore } from '@reduxjs/toolkit';

import evaluationReducer from './slice/evaluationSlice';

const store = configureStore({
  reducer: {
    evaluation: evaluationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
