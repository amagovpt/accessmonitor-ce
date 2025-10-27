import { createSlice } from '@reduxjs/toolkit';

export const evaluationSlice = createSlice({
  name: 'evaluation',
  initialState: {
    summary: {},
    evaluated: false,
    act: {},
    bp: {},
    wcag: {},
    counter: {},
    dom: {},
    url: '',
    data: {},
    processedData: {},
    csvData: {},
    csvProcessedData: {},
    nEvals: 0,
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
    setCounter: (state, action) => {
      state.counter = action.payload;
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
    setCsvData: (state, action) => {
      state.csvData = action.payload;
    },
    setCsvProcessedData: (state, action) => {
      state.csvProcessedData = action.payload;
    },
    setNEvals: (state) => {
      state.nEvals += 1;
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
      state.counter = {};
      state.dom = {};
      state.url = '';
      state.data = {};
      state.processedData = {};
      state.pageCode = '';
    },
    resetCsv: (state) => {
      state.csvData = {};
      state.csvProcessedData = {};
      state.nEvals = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setACT, setBP, setWCAG, setCounter, setSummary, setEvaluated, setDom, setURL, setData, setProcessedData, setCsvData, setCsvProcessedData, setNEvals, setPageCode, reset, resetCsv } = evaluationSlice.actions;

export default evaluationSlice.reducer;