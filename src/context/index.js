import React from 'react';

import { CarsProvider } from './CarsContext'
import { TrafficProvider } from './TrafficContext'

export { CarsContext } from './CarsContext';
export { TrafficContext } from './TrafficContext';

export const Provider = ({ children }) => (
  <CarsProvider>
    <TrafficProvider>
      { children }
    </TrafficProvider>
  </CarsProvider>
);
