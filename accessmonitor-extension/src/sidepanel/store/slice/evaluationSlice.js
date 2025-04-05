import { createSlice } from '@reduxjs/toolkit';

export const evaluationSlice = createSlice({
  name: 'evaluation',
  initialState: {
    summary: {},
    evaluated: false,
    act: {},
    bp: {},
    wcag: {},
    dom: {},
    url: '',
    data: {},
    processedData: {},
    pageCode: ''
  },
  reducers: {
    setACT: (state, action) => {
      state.act = action.payload;
    },
    setBP: (state, action) => {
      state.bp = action.payload;
    },
    setWCAG: (state, action) => {
      state.wcag = action.payload;
    },
    setSummary: (state, action) => {
      state.summary = action.payload;
    },
    setEvaluated: (state) => {
      state.evaluated = true;
    },
    setDom: (state, action) => {
      state.dom = action.payload;
    },
    setURL: (state, action) => {
      state.url = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
    setProcessedData: (state, action) => {
      state.processedData = action.payload;
    },
    setPageCode: (state, action) => {
      state.pageCode = action.payload;
    },
    reset: (state) => {
      state.summary = {};
      state.evaluated = false;
      state.act = {};
      state.bp = {};
      state.wcag = {};
      state.dom = {};
      state.url = '';
      state.data = {};
      state.processedData = {};
      state.pageCode = '';
    }
  },
});

// Action creators are generated for each case reducer function
export const { setACT, setBP, setWCAG, setSummary, setEvaluated, setDom, setURL, setData, setProcessedData, setPageCode, reset } = evaluationSlice.actions;

export default evaluationSlice.reducer;