import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CounterResult } from '@qualweb/counter';

import type { AuditReport, ProcessedReport } from '../../../shared/types';
import type { Report, Summary } from '../../../utils/types';

export interface EvaluationState {
  summary: Summary | null;
  evaluated: boolean;
  act: Report | null;
  bp: Report | null;
  wcag: Report | null;
  counter: CounterResult | null;
  dom: { html: string } | null;
  url: string | null;
  /** Current evaluation report */
  data: AuditReport | null;
  /** data already processed for the UI */
  processedData: ProcessedReport | null;
  /** Report used in CSV */
  csvData: AuditReport | null;
  csvProcessedData: ProcessedReport | null;
  nEvals: number;
  pageCode: string;
}

const initialState: EvaluationState = {
  summary: null,
  evaluated: false,
  act: null,
  bp: null,
  wcag: null,
  counter: null,
  dom: null,
  url: null,
  data: null,
  processedData: null,
  csvData: null,
  csvProcessedData: null,
  nEvals: 0,
  pageCode: '',
};

export const evaluationSlice = createSlice({
  name: 'evaluation',
  initialState,
  reducers: {
    setACT: (state, action: PayloadAction<Report | null>) => {
      state.act = action.payload;
    },
    setBP: (state, action: PayloadAction<Report | null>) => {
      state.bp = action.payload;
    },
    setWCAG: (state, action: PayloadAction<Report | null>) => {
      state.wcag = action.payload;
    },
    setCounter: (state, action: PayloadAction<CounterResult | null>) => {
      state.counter = action.payload;
    },
    setSummary: (state, action: PayloadAction<Summary | null>) => {
      state.summary = action.payload;
    },
    setEvaluated: (state) => {
      state.evaluated = true;
    },
    setDom: (state, action: PayloadAction<{ html: string } | null>) => {
      state.dom = action.payload;
    },
    setURL: (state, action: PayloadAction<string | null | undefined>) => {
      state.url = action.payload ?? null;
    },
    setData: (state, action: PayloadAction<AuditReport | null>) => {
      state.data = action.payload;
    },
    setProcessedData: (
      state,
      action: PayloadAction<ProcessedReport | null>,
    ) => {
      state.processedData = action.payload;
    },
    setCsvData: (state, action: PayloadAction<AuditReport | null>) => {
      state.csvData = action.payload;
    },
    setCsvProcessedData: (
      state,
      action: PayloadAction<ProcessedReport | null>,
    ) => {
      state.csvProcessedData = action.payload;
    },
    setNEvals: (state) => {
      state.nEvals += 1;
    },
    setPageCode: (state, action: PayloadAction<string>) => {
      state.pageCode = action.payload;
    },
    reset: (state) => {
      state.summary = null;
      state.evaluated = false;
      state.act = null;
      state.bp = null;
      state.wcag = null;
      state.counter = null;
      state.dom = null;
      state.url = null;
      state.data = null;
      state.processedData = null;
      state.pageCode = '';
    },
    resetCsv: (state) => {
      state.csvData = null;
      state.csvProcessedData = null;
      state.nEvals = 0;
    },
  },
});

// Action creators are generated for each case reducer function

export const {
  setACT,
  setBP,
  setWCAG,
  setCounter,
  setSummary,
  setEvaluated,
  setDom,
  setURL,
  setData,
  setProcessedData,
  setCsvData,
  setCsvProcessedData,
  setNEvals,
  setPageCode,
  reset,
  resetCsv,
} = evaluationSlice.actions;

export default evaluationSlice.reducer;
