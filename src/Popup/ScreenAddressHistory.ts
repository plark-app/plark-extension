import { createMemoryHistory, MemoryHistory } from 'history';

const screenHistory: MemoryHistory = createMemoryHistory({});
window['pushHistory'] = screenHistory.push;

export default screenHistory;
