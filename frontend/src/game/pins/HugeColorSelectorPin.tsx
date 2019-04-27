import React from 'react';
import { HugePin } from './HugePin';
import { GameSettings } from '../types';

type HCSPState = {
    pinId: number,
};

type HCSPProps = {
    pinId: number,
    settings: GameSettings,
}
export class HugeColorSelectorPin extends React.Component<HCSPProps, HCSPState> {
    constructor(props: HCSPProps) {
        super(props);
        this.state = {
            pinId: props.pinId
        }
    }

    changePin() {
        this.setState((state, props) => ({
            pinId: (state.pinId + 1) % props.settings.colours
        }))
    }

    render() {
        return (<HugePin pinId={this.state.pinId} onClick={() => this.changePin()}></HugePin>)
    }
}