const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json()); // parse incoming requests with json

const users = [];

// display all the users
app.get("/users", (req, res) => {
	res.json(users);
});

// create new user and hash password
app.post("/users", async (req, res) => {
	try {
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		const user = { name: req.body.name, password: hashedPassword };
		users.push(user);
		res.send("User create successfully");
	} catch {
		res.send("User not created");
	}
});

// login and verify user
app.post("/users/login", async (req, res) => {
	const user = users.find((user) => user.name == req.body.name);
	if (!user) return res.send("User not found");
	try {
		if (await bcrypt.compare(req.body.password, user.password)) {
			res.send("Authenicated user successfully.");
		} else {
			res.send("User not authenticated.");
		}
	} catch {
		res.send();
	}
});

app.listen(3000);
