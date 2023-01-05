import { useState } from "react";

const Filter = ({onChange}) => (
  <>
  filter shown with <input onChange={e => onChange(e.target.value)}></input>
  </>
)

const PersonForm = ({onNameChange, onNumberChange, onSubmit}) => (
  <form>
    <div>
      name: <input onChange={(e) => onNameChange(e.target.value)} />
      <br />
      number: <input onChange={(e) => onNumberChange(e.target.value)} />
    </div>
    <div>
      <button type="submit" onClick={e => {
          e.preventDefault();
          onSubmit();
      }}>
        add
      </button>
    </div>
  </form>
);

const Persons = ({persons}) => (
  persons.map((p) => (
    <p key={p.name}>{p.name} {p.number}</p>
  ))
)


const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas", number: "123-456789" }]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const onSubmit = () => {
    const exists = persons.filter(p => p.name === newName).length
    if (exists) {
      alert(`${newName} is already added to phonebook`)
      return;
    }
    const newValue = {
      name: newName,
      number: newNumber
    }
    const newPersons = persons.concat(newValue)
    setPersons(newPersons)
  }

  const filtered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={setFilter} />
      <h2>add a new</h2>
      <PersonForm onNameChange={setNewName} onNumberChange={setNewNumber} onSubmit={onSubmit} />
      <h2>Numbers</h2>
      <Persons persons={filtered} />
    </div>
  );
};

export default App;
