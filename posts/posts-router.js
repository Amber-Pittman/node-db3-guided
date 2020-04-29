const express = require(express)
    const db = require("../data/config")

    const router = express.Router()
    
    router.get("/", async (req, res, next) => {
        try {
            const posts = await db("posts as p")
                .leftJoin("users as u", "u.id", "p.user_id")
                .where("user_id", req.params.id)
                .select("p.id", "p.contents", "u.username")
            res.json(posts)
        } catch(err) {
            next(err)
        }
    })

    module.exports = router