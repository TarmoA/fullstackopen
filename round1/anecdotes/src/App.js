import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
  ];
  const count = anecdotes.length;

  const initialVotes = Array(count).fill(0);
  const [votes, setVotes] = useState(initialVotes);

  const [selected, setSelected] = useState(0);

  const setRandom = () => setSelected(Math.floor(Math.random() * count));

  const incrementCount = index => {
    const newVotes = [...votes];
    newVotes[index] += 1;
    setVotes(newVotes);
  }
  const mostVotesIndex = votes.reduce((largestIndex, _, currentIndex) => {
    return votes[currentIndex] > votes[largestIndex] ? currentIndex : largestIndex;
  },0);

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <button onClick={() => incrementCount(selected)}>vote</button>
      <button onClick={setRandom}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[mostVotesIndex]}</div>
      <div>has {votes[mostVotesIndex]} votes</div>
    </div>
  );
};

export default App;
