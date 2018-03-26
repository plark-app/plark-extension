import {Action, createMemoryHistory, History, MemoryHistory, Location} from 'history';
import LocationListener = History.LocationListener;

const screenHistory: MemoryHistory = createMemoryHistory({});



export default screenHistory;