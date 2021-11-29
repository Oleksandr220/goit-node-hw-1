const fs = require('fs/promises')
const path = require('path')
const { nanoid } = require('nanoid')

const contactsPath = path.join(__dirname, 'db/contacts.json')

const updateContacts = async (newContact) => {
  const contactsString = JSON.stringify(newContact)
  await fs.writeFile(contactsPath, contactsString)
}

async function listContacts() {
  const data = await fs.readFile(contactsPath, 'utf-8')
  const contacts = JSON.parse(data)
  return contacts
}

async function getContactById(contactId) {
  const contacts = await listContacts(contactsPath)
  const contactById = contacts.find((contact) => contact.id === contactId)
  if (!contactById) {
    return null
  }
  return contactById
}

async function removeContact(contactId) {
  const contacts = await listContacts(contactsPath)
  const idx = contacts.findIndex((contact) => contact.id === contactId)
  if (idx === -1) {
    return null
  }
  const removeContact = contacts.splice(idx, 1)
  await updateContacts(contacts)
  return removeContact
}

async function addContact(name, email, phone) {
  const contacts = await listContacts(contactsPath)
  if (!email || !phone) {
    throw new Error('email and phone fields must be filled')
  }
  const newContact = { name, email, phone, id: nanoid() }
  contacts.push(newContact)
  await updateContacts(contacts)
  return newContact
}

module.exports = { listContacts, getContactById, removeContact, addContact }
