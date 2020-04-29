const express = require(express)
const postModel = require("./posts-model")
const db = require("../data/config")

const router = express.Router({
    mergeParams: true,
})

router.get("/", async (req, res, next) => {
    try {
        res.json(await postModel.findByUserId(req.params.id))
    } catch(err) {
        next(err)
    }
})

module.exports = router