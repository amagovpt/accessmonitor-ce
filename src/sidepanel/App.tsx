import '../i18n';

import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './pages/Layout';
import Home from './pages/Home';
import Resume from './pages/Resume';
import Detail from './pages/Details';
import type { AuditReport } from '../shared/types';

import { ThemeProvider } from '../context/ThemeContext';

export const pathURL = '/';
export const accessMonitorURL = 'https://accessmonitor.acessibilidade.gov.pt/';

export default function App() {
  const [allData, setAllData] = useState<
    AuditReport['scoring']['assertionEvidence']
  >({});

  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path={`${pathURL}`} element={<Home />} />

            <Route
              path={`${pathURL}results`}
              element={<Resume setAllData={setAllData} />}
            />

            <Route
              path={`${pathURL}results/:details`}
              element={<Detail setAllData={setAllData} allData={allData} />}
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
