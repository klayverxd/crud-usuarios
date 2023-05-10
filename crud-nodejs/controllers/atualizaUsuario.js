import { database } from "../config/database.js";

export const atualizaUsuario = (req, res) => {
	const updateQuery =
		"UPDATE usuarios SET `nome` = ?, `email` = ?, `idade` = ? WHERE `id` = ?";

	const valores = [req.body.nome, req.body.email, req.body.idade];

	database.query(updateQuery, [...valores, req.params.id], err => {
		if (err) return res.json(err);

		return res.status(200).json("Usuário atualizado com sucesso!");
	});
};
