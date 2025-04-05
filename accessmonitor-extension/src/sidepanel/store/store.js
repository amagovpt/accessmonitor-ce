import { configureStore } from '@reduxjs/toolkit'

import evaluationReducer from './slice/evaluationSlice';

export default configureStore({
    reducer: {
        evaluation: evaluationReducer,
    },
});