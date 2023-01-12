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
))

const Notification = ({message, type}) => {
  if (!message) {
    return null;
  }
  return <div className={`notification ${type}`}>{message}</div>;

}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({message: null, type: null});

  useEffect(() => {
    reloadPersons();
  }, []);

  useEffect(() => {
    if (!notification.message) {
      return;
    }
    // when notification is set, empty it after a few seconds
    setTimeout(() => {
      setNotification({ message: null, type: null});
    }, 3000);
  }, [notification, setNotification])

  const reloadPersons = () => {
    getPersons().then((response) => {
      setPersons(response.data)
    }).catch(err => {
      setNotification({message: 'Error loading phonebook', type: 'error'})
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
        setNotification({message: `Updated number for ${newValue.name}`, type: 'success'})
        reloadPersons();
      }).catch(err => {
        setNotification({message: `Error updating number for ${newValue.name}`, type: 'error'})
      })
      return;
    }

    addPerson(newValue).then(() => {
      setNotification({message: `Added person ${newValue.name}`, type: 'success'})
      reloadPersons();
    }).catch(err => {
      setNotification({message: `Error adding person ${newValue.name}`, type: 'error'})
    })
  }

  const onDeleteClicked = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) {
      return;
    }
    deletePerson(person.id).then(() => {
      setNotification({message: `Deleted ${person.name}`, type: 'success'})
      reloadPersons();
    }).catch(err => {
      setNotification({message: `Error deleting ${person.name}`, type: 'error'})
    })
  }

  const filtered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
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
