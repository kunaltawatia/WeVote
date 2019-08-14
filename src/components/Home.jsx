import React, { Component } from "react";
import Typed from 'typed.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <img style={{ height: 400 }} src="/favicon.ico" alt="/favicon.ico" className="logo" />
                <TypistComponent />
            </div>
        );
    }
}

class TypistComponent extends Component {
    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function () {
            new Typed('.type', {
                strings: ["redefines", "reconceptualizes", "reimagines", "revolutionizes"],
                stringsElement: null,
                // typing speed
                typeSpeed: 80,
                // time before typing starts
                startDelay: 600,
                // backspacing speed
                backSpeed: 60,
                // time before backspacing
                backDelay: 1000,
                // loop
                loop: true,
                // false = infinite
                loopCount: 5,
                // show cursor
                // showCursor: false,
                // character for cursor
                cursorChar: "|",
                // attribute to type (null == text)
                attr: null,
                // either html or text
                contentType: 'html',
            });
        });
    }
    render() {
        return (
            <div class="center">
                <div class="typed">
                    <span>Blockchain </span><span class="type"></span><span> voting</span>
                </div>
            </div>
        )
    }
}
