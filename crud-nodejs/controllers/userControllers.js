import { database } from "../config/database.js";

export const getUsers = (_, res) => {
	const getQuery = "SELECT * FROM users";

	database.query(getQuery, (err, data) => {
		if (err) return res.json(err);

		return res.status(200).json(data);
	});
};

export const addUser = (req, res) => {
	const insertQuery = "INSERT INTO users(`name`, `email`, `age`) VALUES(?)";

	const values = [req.body.name, req.body.email, req.body.age];

	database.query(insertQuery, [values], err => {
		if (err) return res.json(err);

		return res.status(200).json("Usuário adicionado com sucesso!");
	});
};

export const updateUser = (req, res) => {
	const updateQuery =
		"UPDATE users SET `name` = ?, `email` = ?, `age` = ? WHERE `id` = ?";

	const values = [req.body.name, req.body.email, req.body.age];

	database.query(updateQuery, [...values, req.params.id], err => {
		if (err) return res.json(err);

		return res.status(200).json("Usuário atualizado com sucesso!");
	});
};

export const deleteUser = (req, res) => {
	const deleteQuery = "DELETE FROM users WHERE `id` = ?";

	database.query(deleteQuery, [req.params.id], err => {
		if (err) return res.json(err);

		return res.status(200).json("Usuário removido com sucesso!");
	});
};
