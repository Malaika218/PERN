const Joi = require('joi');
const express = require('express');
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors());
const courses = [
    {id: 1, name: 'course 1', instructor: 'instructor1'},
    {id: 2, name: 'course 2', instructor: 'instructor2'},
    {id: 3, name: 'course 3', instructor: 'instructor 3'}
];

app.get('/', (req, res) => {
    res.send('Hello Worsasdld');
});


app.get('/api/courses', (req, res) => {
res.send(courses);
});

app.get('/api/courses/:year/:month', (req, res) => {
    res.send(req.query);
});

app.post('/api/courses', (req, res) => {
   const {error} = validateCourse(req.body);
    
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name,
        instructor: req.body.instructor //gets instreuctor body from server
    };
    courses.push(course);
    res.send(course);
});

//const port = process.env.PORT || 3000;
app.listen(3000, () => console.log("listening on port 3000.."));

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('not found');

    const schema = {
        name: Joi.string().min(3).required()
    };
    const result = Joi.validate(req.body, schema);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);

});

function validateCourse(course) { //passes the body 
    const schema = {
        name: Joi.string().min(3).required(),
        instructor: Joi.string().min(3).required() //validation check for instructor body
    };

    return Joi.validate(course,schema); //returns

}

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});