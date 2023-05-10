import express from "express";

import { lerUsuarios } from "../controllers/lerUsuarios.js";
import { adicionaUsuario } from "../controllers/adicionaUsuario.js";
import { atualizaUsuario } from "../controllers/atualizaUsuario.js";
import { deletaUsuario } from "../controllers/deletaUsuario.js";

const router = express.Router();

router.get("/", lerUsuarios);
router.post("/", adicionaUsuario);
router.put("/:id", atualizaUsuario);
router.delete("/:id", deletaUsuario);

export default router;
