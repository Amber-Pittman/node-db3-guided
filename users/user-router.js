const express = require("express")
const postRouter = require("../posts/post-router")
const db = require("../data/config")

const router = express.Router({
	mergeParams: true,
})

router.use("/:id/posts", postRouter)

router.get("/", async (req, res, next) => {
	try {
		res.json(await db("users"))
	} catch(err) {
		next(err)
	}
})

router.get("/:id", validateUserId(), async (req, res, next) => {
	try {
		res.json(req.user)
	} catch(err) {
		next(err)
	}
})

router.post("/", async (req, res, next) => {
	try {
		const [id] = await db("users").insert(req.body)
		const user = await db("users").where({ id }).first()

		res.status(201).json(user)
	} catch(err) {
		next(err)
	}
})

router.put("/:id", validateUserId(), async (req, res, next) => {
	try {
		const { id } = req.params
		await db("users").where({ id }).update(req.body)
		const user = await db("users").where({ id }).first()
		
		res.json(user)
	} catch(err) {
		next(err)
	}
})

router.delete("/:id", validateUserId(), async (req, res, next) => {
	try {
		const { id } = req.params
		await db("users").where({ id }).del()

		res.status(204).end()
	} catch(err) {
		next(err)
	}
})

function validateUserId() {
	return async (req, res, next) => {
		try {
			const { id } = req.params
			const user = await db("users").where({ id }).first()

			if (!user) {
				return res.status(404).json({
					message: "User not found",
				})
			}

			req.user = user
			next()
		} catch(err) {
			next(err)
		}
	}
}

module.exports = router