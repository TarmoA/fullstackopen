const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercices}
    </p>
  );
}

const Content = (props) => {
  return (<>
    {props.parts.map((part) => (
      <Part part={part} />
    ))}
  </>);
};

const Total = (props) => {
  const sum = props.parts.reduce((sum, cur, _) => {
    return sum + cur.exercices;
  }, 0);
  return (<p>Number of exercises {sum}</p>);
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      { name: "Fundamentals of React", exercices: 10 },
      { name: "Using props to pass data", exercices: 7 },
      { name: "State of a component", exercices: 14 },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;
