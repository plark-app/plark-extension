import { createMemoryHistory } from 'history';
import { createDebugger } from 'Core';

const debug = createDebugger('MODAL');
export const modalHistory = createMemoryHistory();

export function openModal(modalPath, modalProps: any = {}) {
    debug(modalPath, modalProps);
    modalHistory.push(modalPath, modalProps);
}

export function closeModal() {
    modalHistory.push('/');
}
