import React from 'react';
import "./header.scss";

type HeaderProps = {
    lessLine: boolean,
    isOver: boolean,
    isLoaded: boolean;
    error: { message: string } | null;
};

function reloadPage() {
    window.location.reload();
}

const Header: React.FC<HeaderProps> = (props) => {
    const { isOver, lessLine, error, isLoaded } = props

    return (
        <div className="header">
            {(error) && (`Error: ${error.message}`)}
            {!isLoaded && (`Loading...`)}
            {(isOver && lessLine) && (
                <div className="button" onClick={() => reloadPage()} >
                    Congratulations! <br />You won!<br />Do you want to play again?
                </div>
            )}
            {(!isOver && !lessLine) && (
                <div className="button" onClick={() => reloadPage()}>
                    You lost :( <br />Do you want to try again?
                </div>
            )}
        </div>
    )
}

export { Header };