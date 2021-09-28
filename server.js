const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json());

const mongoose = require('mongoose');
const PORT = process.env.PORT || 3030;


// main function 
let fruitModel;

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    const fruitSchema = new mongoose.Schema({
        name: String,
        image: String,
        price: String,
        email: String
    })
    fruitModel = mongoose.model('fruit', fruitSchema);
}

main();




//routes 
server.get('/fruit', apiHandler)
server.post('/addFruit', addFruitHandler)
server.get('/getFruit', renderFavFruit)
server.delete('/deleteFruit/:id', deleteFruitHandler)
server.put('/updateFruit/:id', updateFruitHandler)




// function

function apiHandler(req, res) {
    axios.get('https://fruit-api-301.herokuapp.com/getFruit')
        .then(result => {
            res.send(result.data.fruits)
        })
}


async function addFruitHandler(req, res) {
    const { name, image, price, email } = req.body;

    await fruitModel.create({
        name: name,
        image: image,
        price: price,
        email: email
    })
}


function renderFavFruit(req, res) {
    const email = req.query.email;
    fruitModel.find({ email: email }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result);
        }
    })
}



function deleteFruitHandler(req, res) {
    const id = req.params.id;
    const email = req.query.email;
    fruitModel.deleteOne({ _id: id }, (err, result) => {
        fruitModel.find({ email: email }, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.send(result);
            }
        })
    })
}



function updateFruitHandler(req, res) {
    const id = req.params.id;
    const { name, image, price, email } = req.body;
    fruitModel.findByIdAndUpdate(id,{name,image,price},(err, result) => {
        fruitModel.find({ email: email }, (err, result) => {
            if (err) {
                console.log(err)
            }else {
                res.send(result);
            }
        })
    })



}

server.listen(PORT, () => {
    console.log(`hello from port ${PORT}`);
})