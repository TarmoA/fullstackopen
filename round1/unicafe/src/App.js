import { useState } from "react";

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
}

const Statistics = ({ stats }) => {
  if (!stats.good && !stats.neutral && !stats.bad) {
    return <p>No feedback given</p>;
  }
  const count = stats.good + stats.neutral + stats.bad
  const totalScore = stats.good - stats.bad;
  const average = count ? totalScore / count : 0;
  const positiveRatio = count ? (stats.good / count) * 100 : 0;

  return (
    <>
    <table>
      <thead>
        <tr>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <StatisticLine text="good" value={stats.good} />
        <StatisticLine text="neutral" value={stats.neutral} />
        <StatisticLine text="bad" value={stats.bad} />
        <StatisticLine text="total" value={count} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={`${positiveRatio} %`} />
      </tbody>
    </table>
    </>
  );
}

const Button = ({text, onClick}) => {
  return <button onClick={onClick}>{text}</button>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const stats = {
    good,
    neutral,
    bad
  }
  return (<div>
    <h1>give feedback</h1>
    <Button onClick={() => setGood(good + 1)} text="good" />
    <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
    <Button onClick={() => setBad(bad + 1)} text="bad" />
    <h1>statistics</h1>
    <Statistics stats={stats} />
  </div>);
};

export default App;
