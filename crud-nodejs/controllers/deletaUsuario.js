import { database } from "../config/database.js";

export const deletaUsuario = (req, res) => {
	const deleteQuery = "DELETE FROM usuarios WHERE `id` = ?";

	database.query(deleteQuery, [req.params.id], err => {
		if (err) return res.json(err);

		return res.status(200).json("Usuário removido com sucesso!");
	});
};
