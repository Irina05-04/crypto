import ReactDOM from 'react-dom/client';
import './styles/base.scss';
import reportWebVitals from './reportWebVitals';

import { App } from './app';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App />
);

reportWebVitals();
