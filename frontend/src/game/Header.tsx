import React from 'react';
import "./header.scss";

type HeaderProps = {
    lessLine: boolean,
    playerWon: boolean,
    isLoaded: boolean;
    error: { message: string } | null;
};

function reloadPage() {
    window.location.reload();
}

const Header: React.FC<HeaderProps> = React.memo((props) => {
    const { playerWon, lessLine, error, isLoaded } = props
    return (
        <div className="header">
            {(error) && (`${error.message}`)}
            {!isLoaded && (`Loading...`)}
            {(playerWon) && (
                <div className="button" onClick={() => reloadPage()} >
                    Congratulations! <br />You won!<br />Do you want to play again?
                </div>
            )}
            {(!playerWon && !lessLine) && (
                <div className="button" onClick={() => reloadPage()}>
                    You lost :( <br />Do you want to try again?
                </div>
            )}
        </div>
    )
}, (pp, np) => {
    return (pp.playerWon === np.playerWon
        && pp.lessLine === np.lessLine
        && pp.isLoaded === np.isLoaded
        && pp.error === np.error
    )
})
export { Header };