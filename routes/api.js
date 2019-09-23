// Express
const express = require("express");
const router = express.Router();

// Middleware
const bcrypt = require("bcryptjs");
const auth = require("basic-auth");

// db
const db = require("../db");
const { Courses, Users } = db.Model;

router.post("/users", async (req, res) => {
    const user = req.body;
    // TODO: hash user password
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    console.log("password: " + user.password);
    await Users.create(user);

    res.status(201).redirect("/");
});

router.get("/courses", (req, res) =>
    Courses.findAll()
        .then(courses => res.json(courses))
        .catch(err => console.error(err))
);

router.get("/courses/:id", (req, res) => {
    const { id } = req.params;
    Courses.findByPk(id)
        .then(course => res.json(course))
        .catch(err => console.error(err));
});

/**
 * * FOLLOWING LINKS REQUIRE AUTHENTICATION
 */
// app.use((req, res, next) => {
//     const user = auth(req);
//     if (user) {
//     } else {
//         res.status(401).end();
//     }
// });
router.get("/users", (req, res) => res.status(200).json());
router.post("/courses", (req, res) => {
    console.log(req.body);
    const { title, description, estimatedTime, materialsNeeded } = req.body;
    Courses.create({
        title,
        description,
        estimatedTime,
        materialsNeeded
    })
        .then(() => res.status(201).end())
        .catch(err => console.error(err));
});
router
    .route("/courses/:id")
    .put((req, res) => {
        const { id } = req.params;
        const { title, description, estimatedTime, materialsNeeded } = req.body;
        Courses.findByPk(id)
            .update({
                title,
                description,
                estimatedTime,
                materialsNeeded
            })
            .then(() => res.status(204).end())
            .catch(err => console.error(err));
    })
    .delete((req, res) => {
        const { id } = req.params;
        Courses.findByPk(id)
            .destroy()
            .then(() => res.status(204).end())
            .catch(err => console.error(err));
    });

module.exports = router;