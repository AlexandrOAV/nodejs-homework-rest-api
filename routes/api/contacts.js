import { Router } from "express";
import contacts from "../../controllers/contacts.js";
import validateBody from "../../middlewares/validateBody.js";
import { addSchema, updateStatusSchema } from "../../models/contact.js";
import isValidId from "../../middlewares/isValidId.js";


const router = Router();

router.get("/", contacts.listContacts);

router.get("/:id", isValidId, contacts.getContactById);

router.post("/", validateBody(addSchema), contacts.addContact);

router.delete("/:id", isValidId, contacts.removeContact);

router.put("/:id", isValidId, validateBody(addSchema), contacts.updateContact);

router.patch("/:id/favorite", isValidId, validateBody(updateStatusSchema), contacts.updateStatusContact);

export default router;