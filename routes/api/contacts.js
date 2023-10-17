import { Router } from "express";
import contacts from "../../controllers/contacts.js";
import validateBody from "../../middlewares/validateBody.js";
import { addSchema, updateStatusSchema } from "../../models/contact.js";
import isValidId from "../../middlewares/isValidId.js";
import authenticate from "../../middlewares/authenticate.js";


const router = Router();


router.get("/", authenticate, contacts.listContacts);

router.get("/:id", authenticate, isValidId, contacts.getContactById);

router.post("/", authenticate, validateBody(addSchema), contacts.addContact);

router.delete("/:id", authenticate, isValidId, contacts.removeContact);

router.put("/:id", authenticate, isValidId, validateBody(addSchema), contacts.updateContact);

router.patch("/:id/favorite", authenticate, isValidId, validateBody(updateStatusSchema), contacts.updateStatusContact);

export default router;