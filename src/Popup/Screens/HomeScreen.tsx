import React, {Fragment} from 'react';
import screenAddressHistory from 'Popup/ScreenAddressHistory';

export class HomeScreen extends React.PureComponent {
    public componentDidMount(): void {
        screenAddressHistory.push('/app/wallet');
    }
    
    public render(): JSX.Element {
        return <Fragment>Home page</Fragment>;
    }
}
