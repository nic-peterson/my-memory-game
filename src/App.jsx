import { useState, useEffect } from "react";
import Card from "./components/Card";
import "./styles/App.css";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [clicked, setClicked] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [availablePokemon, setAvailablePokemon] = useState([]); // Store all available Pokemon

  const POKEMON_PER_ROUND = 10;
  const MAX_POKEMON = 151;

  useEffect(() => {
    const fetchInitialPokemon = async () => {
      try {
        // Get all 151 Pokemon initially
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`
        );
        const data = await response.json();
        setAvailablePokemon(data.results);

        // Select initial Pokemon set
        await selectNewPokemon(data.results);
      } catch (error) {
        console.error("Error fetching Pokemon:", error);
      }
    };

    fetchInitialPokemon();
  }, []);

  const selectNewPokemon = async (availablePokes = availablePokemon) => {
    try {
      // Randomly select Pokemon
      const shuffled = [...availablePokes]
        .sort(() => 0.5 - Math.random())
        .slice(0, POKEMON_PER_ROUND);

      // Fetch detailed data for selected Pokemon
      const detailedPokemon = await Promise.all(
        shuffled.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          const data = await res.json();
          return {
            id: data.id,
            name: data.name,
            imageUrl: data.sprites.front_default,
          };
        })
      );

      setPokemon(detailedPokemon);
    } catch (error) {
      console.error("Error fetching Pokemon details:", error);
    }
  };

  const shufflePokemon = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const handleCardClick = (id) => {
    if (clicked.includes(id)) {
      // Game over - reset everything
      setScore(0);
      setClicked([]);
      selectNewPokemon(); // Get new Pokemon set
    } else {
      setClicked((prevClicked) => [...prevClicked, id]);
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        if (newScore > bestScore) {
          setBestScore(newScore);
        }
        return newScore;
      });

      // If player has clicked all current Pokemon, get a new set
      if (clicked.length + 1 === POKEMON_PER_ROUND) {
        setClicked([]); // Reset clicked for new round
        selectNewPokemon(); // Get new Pokemon set
      } else {
        setPokemon((prevPokemon) => shufflePokemon(prevPokemon));
      }
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Pokémon Memory Game</h1>
        <div className="scores">
          <p>Score: {score}</p>
          <p>Best Score: {bestScore}</p>
        </div>
      </header>

      <main>
        <div className="card-grid">
          {pokemon.map((mon) => (
            <Card
              key={mon.id}
              id={mon.id}
              imageUrl={mon.imageUrl}
              name={mon.name}
              handleCardClick={handleCardClick}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
