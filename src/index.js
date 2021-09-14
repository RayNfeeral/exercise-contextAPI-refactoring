import React from 'react';
import { render } from 'react-dom';

import App from './App';
import { SubredditProvider } from './context/SubredditsContext';

render(
  <SubredditProvider>
    <App />
  </SubredditProvider>,
  document.getElementById('root'),
);