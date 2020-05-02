import React from 'react';
import "./footer.scss";

const Footer: React.FC = React.memo(() => {
    return (
        <footer>
            <p>Free logic game based on <a href="https://en.wikipedia.org/wiki/Mastermind_(board_game)">Mastermind</a>.</p>
            <p>Implemented by <a href="http://budavariam.github.io">Mátyás Budavári</a></p>
        </footer>
    )
}, () => true)

export { Footer };