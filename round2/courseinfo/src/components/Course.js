const Header = ({ course }) => <h1>{course}</h1>;

const Total = ({ sum }) => <b>Total of {sum} exercises</b>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => parts.map((p) => <Part key={p.id} part={p} />);

const Course = ({ course }) => (
  <>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total sum={course.parts.reduce((sum, cur) => sum + cur.exercises, 0)} />
  </>
);


export default Course;
