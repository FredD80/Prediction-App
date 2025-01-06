import React, { useState, useEffect } from 'react';
import config from './config';

function App() {
    // ... (user authentication with cognito remains the same)

    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState('');
    const [predictedSpread, setPredictedSpread] = useState('');
    const [predictedOverUnder, setPredictedOverUnder] = useState('');
    const [predictedCombinedScore, setPredictedCombinedScore] = useState('');

    useEffect(() => {
        if(user){
            fetchGames();
        }
    }, [user]);

    const fetchGames = async (idToken) => {
        try {
            const response = await fetch(`${config.API_ENDPOINT}/games`, {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setGames(data);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };

    const handleSubmitPrediction = async (event) => {
        event.preventDefault();
        try {
            const session = await user.getSession();
            const idToken = session.getIdToken().getJwtToken();

            const response = await fetch(`${config.API_ENDPOINT}/predictions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    game_id: selectedGame,
                    predicted_spread: predictedSpread,
                    predicted_over_under: predictedOverUnder,
                    predicted_combined_score: predictedCombinedScore,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert('Prediction submitted!');
        } catch (error) {
            console.error('Error submitting prediction:', error);
            alert('Error submitting prediction');
        }
    };

    // ... (Sign In/Sign Out logic remains the same)

    return (
        <div className="App">
            {/* ... (Sign In/Sign Out UI remains the same) */}

            <h2>Games</h2>
            {/* ... (Games list rendering remains the same) */}

            {user && (
                <form onSubmit={handleSubmitPrediction}>
                    <select value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}>
                        <option value="">Select a game</option>
                        {games.map((game) => (
                            <option key={game.game_id} value={game.game_id}>
                                {game.away_team} @ {game.home_team}
                            </option>
                        ))}
                    </select>
                    <input type="text" placeholder="Predicted Spread" value={predictedSpread} onChange={(e) => setPredictedSpread(e.target.value)} />
                    <input type="text" placeholder="Predicted Over/Under" value={predictedOverUnder} onChange={(e) => setPredictedOverUnder(e.target.value)} />
                    <input type="number" placeholder="Predicted Combined Score" value={predictedCombinedScore} onChange={(e) => setPredictedCombinedScore(e.target.value)} />
                    <button type="submit">Submit Prediction</button>
                </form>
            )}
        </div>
    );
}

export default App;