import React, {Fragment} from 'react';
import screenAddressHistory from 'Popup/ScreenAddressHistory';

export default class HomeScreen extends React.Component {

    componentDidMount() {
        screenAddressHistory.push(`/app/wallet`);
    }

    render() {
        return <Fragment>Home page</Fragment>;
    }
}
