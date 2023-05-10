import { database } from "../config/database.js";

export const lerUsuarios = (_, res) => {
	const getQuery = "SELECT * FROM usuarios";

	database.query(getQuery, (err, data) => {
		if (err) return res.json(err);

		return res.status(200).json(data);
	});
};
