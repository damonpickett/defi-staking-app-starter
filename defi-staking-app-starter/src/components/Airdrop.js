import React, {Component} from 'react';


class Airdrop extends Component {
    // Airdrop is to have a timer that counts down
    // initialize the countdown after customer has staked a certain amount
    // timer functionality, countdown, startTimer, state - for time to work...

    constructor() {
        super()
        this.state = {time: {}, seconds: 20}
        this.timer = 0
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    startTimer() {
        if(this.timer === 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000)
        }
    }

    countDown() {
        // 1. countdown one second at at time
        let seconds = this.state.seconds - 1
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds
        })
        // 2. stop counting when we hit zero
        if(seconds === 0) {
            clearInterval(this.timer)
        }
    }
 
    secondsToTime(secs) {
        let hours, minutes, seconds
        hours = Math.floor(secs / (60 * 60))

        let divisor_for_minutes = secs % (60 * 60)
        minutes = Math.floor(divisor_for_minutes / 60)

        let divisor_for_seconds = divisor_for_minutes % 60
        seconds = Math.ceil(divisor_for_seconds)

        let obj = {
            'h': hours,
            'm': minutes,
            's': seconds
        }
        return obj
    }

    componentDidMount() {
        let timeLeftVar = this.secondsToTime(this.state.seconds)
        this.setState({time: timeLeftVar})
    }

    airdropReleaseTokens() {
        let stakingB = this.props.stakingBalance
        if(stakingB >= '50000000000000000000') {
            this.startTimer()
        }
        // code for issuing tokens must come here
        // when timer gets to zero, issueTokens from DecentralBank.sol
    }

    render() {
        this.airdropReleaseTokens()
        return (
            <div style={{color: 'black'}}>
                {this.state.time.m}:{this.state.time.s}
            </div>    
        )
    }
}        

export default Airdrop;