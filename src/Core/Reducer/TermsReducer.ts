import {ITermsStore} from 'Core/Declarations/Store';


export const initialTermsState: ITermsStore = {
    show: true
};

export default function termsState(state: ITermsStore = initialTermsState, action) {
    
    switch (action.type) {
        case 'TERMS::AGREE':
            return Object.assign({}, state, {show: false})
    }

    return state;
}