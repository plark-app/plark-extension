import React from 'react';

export class KeyboardHandler extends React.PureComponent {
    onKeyUp = (event) => {

        const {
            onPressEnter,
            onPressLeft,
            onPressRight,
            onPressBackspace
        } = this.props;

        switch (event.which) {
            case 13:
                onPressEnter && onPressEnter(event);
                break;

            case 37:
                onPressLeft && onPressLeft();
                break;

            case 39:
                onPressRight && onPressRight();
                break;

            case 8:
                onPressBackspace && onPressBackspace();
                break;
        }
    };

    componentDidMount() {
        document.addEventListener('keyup', this.onKeyUp);
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.onKeyUp);
    }

    render() {
        return <div/>
    }
}