import 'antd/dist/reset.css';
import './app/styles/global.css';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';

dayjs.locale('ru');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Не найден корневой элемент #root');
}

createRoot(rootElement).render(<App />);
