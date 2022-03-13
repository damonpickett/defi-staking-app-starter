import React, {Component} from 'react';


class Airdrop extends Component {
    // Airdrop is to have a timer that counts down
    // initialize the countdown after customer has staked a certain amount
    // timer functionality, countdown, startTimer, state - for time to work...

    constructor() {
        super()
        this.state = {time: {}, seconds: 20}
        this.timer = 0
        this.startTime = this.startTime.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    render() {
        return (
            <div></div>
        )
    }
}        

export default Airdrop;