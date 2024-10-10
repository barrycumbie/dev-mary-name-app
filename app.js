require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser')
const { ObjectId } = require('mongodb')
const { MongoClient, ServerApiVersion } = require('mongodb');
const PORT = process.env.PORT || 5500;
const uri = `mongodb+srv://barry:${process.env.MONGO_PWD}@cluster0.5abxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`; 

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static('./public/'))

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', async function (req, res) {
  
  console.log('in /');
  await client.connect();  
  console.log('I should be connected');
  
  let result = await client.db("barrys-db").collection("whatever-collection")
    .find({}).toArray(); 
  // console.log(result); 

  res.render('name', {
    nameData : result
  });

})

app.post('/insert', async (req,res)=> {

  console.log('in /insert');
  
  //connect to db,
  await client.connect();
  //point to the collection 
  await client.db("barrys-db").collection("whatever-collection").insertOne({ fname: req.body.fname});
  res.redirect('/');

}); 

app.post('/update', async (req,res)=>{

  console.log("req.body: ", req.body)

  client.connect; 
  const collection = client.db("barrys-db").collection("whatever-collection");
  let result = await collection.findOneAndUpdate( 
  {"_id": new ObjectId(req.body.nameID)}, { $set: {"fname": req.body.inputUpdateName } }
)
.then(result => {
  console.log(result); 
  res.redirect('/');
})
}); 

app.post('/delete/:id', async (req,res)=>{

  console.log("in delete, req.parms.id: ", req.params.id)

  client.connect; 
  const collection = client.db("barrys-db").collection("whatever-collection");
  let result = await collection.findOneAndDelete( 
  {"_id": new ObjectId(req.params.id)}).then(result => {
  console.log(result); 
  res.redirect('/');})

  //insert into it

})

app.listen(PORT, () => {
  console.log(`Server is running & listening on port ${PORT}`);
});