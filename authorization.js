require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const posts = [
	{
		username: "Shreya",
		title: "Post 1",
	},
	{
		username: "Spurti",
		title: "Post 2",
	},
	{
		username: "Reha",
		title: "Post 3",
	},
];

// user authorization
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.send("Provide access token.");
	try {
		jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
			if (err) return res.status(403).send("User not authorized.");
			req.user = user;
			next();
		});
	} catch {
		return res.send();
	}
};

app.post("/login", (req, res) => {
	const username = req.body.username;
	const user = { name: username };

	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
	res.json({ accessToken: accessToken });
});

//display all the posts
app.get("/posts", authenticateToken, (req, res) => {
	res.json(posts.filter((post) => post.username == req.user.name));
});

app.listen(3000);
