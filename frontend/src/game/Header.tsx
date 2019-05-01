import React from 'react';
import "./header.scss";

type HeaderProps = {
    lessLine: boolean,
    isOver: boolean,
    children: JSX.Element;
    isLoaded: boolean;
    error: {message: string} | null;
};

function reloadPage() {
    window.location.reload();
}

const Header: React.FC<HeaderProps> = (props) => {
    const { isOver, lessLine, children, error, isLoaded } = props

    return (
        <div className="header">
            {(error) && (`Error: ${error.message}`)}
            {!isLoaded && (`Loading...`)}
            {(isOver && lessLine) && (
                <div className="button" onClick={() => reloadPage()} >
                    Play again?
                </div>
            )}
            {(!isOver && !lessLine) && (
                <div className="button" onClick={() => reloadPage()}>
                    Try again?
                </div>
            )}
            {(!isOver) && (
                children
            )}
        </div>
    )
}

export { Header };