import React from 'react';

export type KeyboardHandlerComponent = {
    onPressEnter?: DummyCallable<void>;
    onPressLeft?: DummyCallable<void>;
    onPressRight?: DummyCallable<void>;
    onPressBackspace?: DummyCallable<void>;
};

export class KeyboardHandler extends React.PureComponent<KeyboardHandlerComponent, any> {
    public onKeyUp = (event): void => {
        const { onPressEnter, onPressLeft, onPressRight, onPressBackspace } = this.props;

        switch (event.which) {
            case 13:
                onPressEnter && onPressEnter(event);
                break;

            case 37:
                onPressLeft && onPressLeft(event);
                break;

            case 39:
                onPressRight && onPressRight(event);
                break;

            case 8:
                onPressBackspace && onPressBackspace(event);
                break;
        }
    };

    public componentDidMount(): void {
        document.addEventListener('keyup', this.onKeyUp);
    }

    public componentWillUnmount(): void {
        document.removeEventListener('keyup', this.onKeyUp);
    }

    public render(): JSX.Element {
        return <div />;
    }
}
