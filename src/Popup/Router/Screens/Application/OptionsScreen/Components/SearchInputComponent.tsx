import React from 'react';
import classNames from 'classnames';
import ReactSVG from 'react-svg'

export interface ISearchOwnProps {
    onChangeSearch?: (value: string) => void;
    placeholder?: string;
}

export interface ISearchOwnState {
    search: string;
    focused: boolean;
}

export default class SearchInputComponent extends React.Component<ISearchOwnProps, ISearchOwnState> {

    state = {
        search: '',
        focused: false
    };

    onChangeSearch = (event) => {
        this.setSearchValue(event.target.value);
    };

    setSearchValue(value) {
        const {onChangeSearch} = this.props;
        this.setState(() => {
            return {search: value};
        });
        onChangeSearch && onChangeSearch(value);
    }

    setFocus = (focusValue) => {
        return () => this.setState(() => {
            return {focused: focusValue};
        })
    };

    onClearEvent = () => {
        this.setSearchValue('');
    };

    render() {

        const {placeholder = ''} = this.props;
        const {
            search = '',
            focused = false
        } = this.state;

        const inputProps = {
            className: "currency-option-search__input",
            type: "text",
            ref: "searchInput",
            placeholder: placeholder,
            value: search,
            onChange: this.onChangeSearch,
            onFocus: this.setFocus(true),
            onBlur: this.setFocus(false)
        };

        return (
            <label className="currency-option-search">
                <ReactSVG path="/images/icons/search.svg"
                          className={classNames("currency-option-search__icon", {'-active': !!search || focused})}
                          wrapperClassName="currency-option-search__icon-wrapper"
                />
                <input {...inputProps}/>
                <div className={classNames("currency-option-search__clear-wrapper", {'-active': !!search})}
                     onClick={this.onClearEvent}>

                    <ReactSVG path="/images/icons/close-round.svg"
                              className="currency-option-search__clear"/>
                </div>
            </label>
        );
    }
}
