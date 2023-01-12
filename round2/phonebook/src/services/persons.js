import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

const getPersons = () => {
    return axios.get(baseUrl)
}

const addPerson = (data) => {
    return axios.post(baseUrl, data)
}

const updatePerson = (id, data) => {
    return axios.put(`${baseUrl}/${id}`, data)
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export { getPersons, addPerson, deletePerson, updatePerson }
