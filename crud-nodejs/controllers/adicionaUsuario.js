import { database } from "../config/database.js";

export const adicionaUsuario = (req, res) => {
	const insertQuery =
		"INSERT INTO usuarios(`nome`, `email`, `idade`) VALUES(?)";

	const valores = [req.body.nome, req.body.email, req.body.idade];

	database.query(insertQuery, [valores], err => {
		if (err) return res.json(err);

		return res.status(200).json("Usuário adicionado com sucesso!");
	});
};
