import {Action, createMemoryHistory, History, MemoryHistory, Location} from 'history';
import LocationListener = History.LocationListener;

const screenHistory: MemoryHistory = createMemoryHistory({});
window['pushHistory'] = screenHistory.push;

export default screenHistory;