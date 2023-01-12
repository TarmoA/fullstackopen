import { useEffect, useState } from "react";
import { getPersons, addPerson, deletePerson, updatePerson } from "./services/persons";

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

const Persons = ({persons, onDeleteClicked}) => (
  persons.map((p) => (
    <p key={p.id}> {p.name} {p.number} <button onClick={() => onDeleteClicked(p)}>Delete</button></p>
  )
)
)


const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    reloadPersons();
  }, []);

  const reloadPersons = () => {
    getPersons().then((response) => {
      setPersons(response.data)
    }).catch(err => {
      console.log('some error')
      console.log(err)
    })
  }

  const onSubmit = () => {
    const newValue = {
      name: newName,
      number: newNumber
    }
    const existing = persons.filter(p => p.name === newName)
    if (existing.length) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        return;
      }
      const existingPerson = existing[0];
      updatePerson(existingPerson.id, newValue).then(() => {
        reloadPersons();
      }).catch(err => {
        console.log('error updating')
        console.log(err)
      })
      return;
    }

    addPerson(newValue).then(() => {
      reloadPersons();
    }).catch(err => {
      console.log('error creating')
      console.log(err)
    })
  }

  const onDeleteClicked = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) {
      return;
    }
    deletePerson(person.id).then(() => {
      reloadPersons();
    }).catch(err => {
      console.log('error deleting')
      console.log(err)
    })
  }

  const filtered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={setFilter} />
      <h2>add a new</h2>
      <PersonForm onNameChange={setNewName} onNumberChange={setNewNumber} onSubmit={onSubmit} />
      <h2>Numbers</h2>
      <div>
        <Persons persons={filtered} onDeleteClicked={onDeleteClicked} />
      </div>
    </div>
  );
};

export default App;
