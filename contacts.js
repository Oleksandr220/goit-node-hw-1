const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "db/contacts.json");

const updateContacts = async (newContact) => {
  const contactsString = JSON.stringify(newContact);
  await fs.writeFile(contactsPath, contactsString);
};

async function listContacts() {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await listContacts(contactsPath);
  const contactById = contacts.find((contact) => contact.id === contactId);
  if (!contactById) {
    return null;
  }
  return contactById;
}

async function removeContact(contactId) {
  const contacts = await listContacts(contactsPath);
  const idx = contacts.findIndex((contact) => contact.id === contactId);
  if (idx === -1) {
    return null;
  }
  const removeContact = contacts.splice(idx, 1);
  await updateContacts(contacts);
  return removeContact;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts(contactsPath);
  const lastContactOfArray = contacts[contacts.length - 1];
  const id = lastContactOfArray.id + 1;
  const newContact = { name, email, phone, id };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
}

addContact();

module.exports = { listContacts, getContactById, removeContact, addContact };
