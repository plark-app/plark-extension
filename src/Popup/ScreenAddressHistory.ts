import {Action, createMemoryHistory, History, MemoryHistory, Location} from 'history';

const screenHistory: MemoryHistory = createMemoryHistory({});
window['pushHistory'] = screenHistory.push;

export default screenHistory;