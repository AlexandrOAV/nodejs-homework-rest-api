
import httpError from "../helpers/httpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import Contact from "../models/contact.js";

const listContacts = async (_, res) => {
    const result = await Contact.find();
    res.json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
}

const removeContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json({
    message: "contact deleted",
  });
}

const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json(result);
}

const updateStatusContact = async (req, res) => {
const { id } = req.params;
const result = await Contact.findByIdAndUpdate(id, req.body);
if (!result) {
  throw httpError(404, "Not found");
}
res.json(result);
}

export default {
listContacts: ctrlWrapper(listContacts),
addContact: ctrlWrapper(addContact),
getContactById: ctrlWrapper(getContactById),
removeContact: ctrlWrapper(removeContact),
updateContact: ctrlWrapper(updateContact),
updateStatusContact: ctrlWrapper(updateStatusContact),
};