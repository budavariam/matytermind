import React from 'react';
import "./header.scss";

type HeaderProps = {
    lessLine: boolean,
    isOver: boolean,
    children: JSX.Element;
};

function reloadPage() {
    window.location.reload();
}

const Header: React.FC<HeaderProps> = (props) => {
    const { isOver, lessLine, children } = props

    return (
        <div className="header">
            {(isOver && lessLine) && (
                <div className="button" onClick={() => reloadPage()} >
                    Congratulations!<br />You won!<br />Do you want to play again?
                </div>
            )}
            {(!isOver && !lessLine) && (
                <div className="button" onClick={() => reloadPage()}>
                    You lost :( Try again?
                </div>
            )}
            {(!isOver) && (
                children
            )}
        </div>
    )
}

export { Header };