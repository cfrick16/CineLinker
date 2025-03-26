import './GuessCount.css';

interface GuessCounterProps {
  totalGuesses: number;
  invalidGuesses: number;
}

export function GuessCounter({ totalGuesses, invalidGuesses }: GuessCounterProps) {
  return (
    <div className="guess-counter-container">
      <div className="guess-counter total">
        Total Guesses: <span className="guess-count">{totalGuesses}</span>
      </div>
      <div className="guess-counter invalid">
        Invalid Guesses: <span className="guess-count">{invalidGuesses}</span>
      </div>
    </div>
  );
}