const express = require('express');
const { Event, ValidateEvent } = require('../model/event');
const {uploadFileToS3, s3} = require('../config/s3-config');

const router = express.Router();

//create event 
router.post('/events', uploadFileToS3.single('image'), async (req, res) => {
  const eventObj = {...req.body};
  eventObj.urlImg = req.file?.key; // url of the image req.file.location
  // console.log(req.file);
  // console.log("Address - ",eventObj.address);
  // console.log(typeof eventObj.address);
  if(typeof eventObj.address === "string"){
    eventObj.address = JSON.parse(eventObj.address);
  }
  // EE: https://s3-images-web-ca2.s3.eu-west-1.amazonaws.com/image-Cristiano-0-8.jpg
  // console.log(eventObj);
  let result = ValidateEvent(eventObj);
  if (result.error) {
        res.status(400).json(result.error);
        return;
      }
     let event = new Event(eventObj);
  try {

    event = await event.save(); 

    event
    .save()
    .then((data)=> res.json(data))
    .catch(()=>res.json({message:error})); 
  }catch(error){
        res.status(500).send('db_error '+error)
  }

});


router.get("/events", async (req, res) => {
  const { name, city, category, pagesize, pagenumber } = req.query;
  // console.log("input:", name, city);

  let filterArr = [];
  let filter = {
    $or: filterArr,
  };
  //filter by name
  if (name) filterArr.push({ name: { $regex: `^${name}` } });

  //filter by category
  if (category) filterArr.push({ category: { $regex: `^${category}` } });


  //filter by city 
  if (city) filterArr.push({ "address.city": { $regex: `^${city}` } });

  //not filtering
  if(!city && !name && !category) filter={}; 
  console.dir(filter, { depth: null });


  let pageSizeNumber = parseInt(pagesize);

  if (isNaN(pageSizeNumber)) {
    pageSizeNumber = 0;
  }

  let pageNumberNumber = parseInt(pagenumber);

  if (isNaN(pageNumberNumber)) {
    pageNumberNumber = 1;
  }

  try {
    const events = await Event.find(filter)
      .limit(pagesize)
      .skip((pageNumberNumber - 1) * pageSizeNumber)
      .lean();
    res.json(events);
  } catch (error) {
    res.status(500).json("db error " + error);
  }
});



//Get Event by ID
  router.get('/events/:id', async (req, res) => {

    try {
  
      const event = await Event.findById(req.params.id);
      if (event) {
        res.json(event);
      }
      else {
        res.status(404).json('Not found');
      }
    }
    catch (error) {
      res.status(404).json('Not found: id is weird ' + error);
    }
  
  })


//update a event
router.put('/events/:id', uploadFileToS3.single("image"), async (req, res) => {
  const eventObj = {...req.body};
  if(req.file)eventObj.urlImg = req.file?.key; // url of the image req.file.location
  console.log(req.file);
  // console.log("Address - ",eventObj.address);
  // console.log(typeof eventObj.address);
  // console.log(req.file)
  if(typeof eventObj.address === "string"){
    eventObj.address = JSON.parse(eventObj.address);
  }
    let result = ValidateEvent(eventObj)
  
    if (result.error) {
      res.status(400).json(result.error);
      return;
    }
    
    try {

      // If someone want to update image the previous image will be deleted and new image will be added 
      if(req.file){
        const prevEvent = await Event.findById(req.params.id);
        if(prevEvent.urlImg){
          // delete previous image and and update new one 
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME, 
            Key: prevEvent.urlImg
           };
           const deleteObj = await s3.deleteObject(params);
        }
      }
      const event = await Event.findByIdAndUpdate(req.params.id, eventObj, { new: true });
      if (event) {
        res.json(event);
      }
      else {
        res.status(404).json('Not found');
      }
    }
    catch (error) {
      res.status(404).json('Not found: id not found' + error);
    }
  })

router.delete('/events/:id', (req,res)=>{
try{
    const { id} = req.params;
    Event
    .deleteOne({_id:id})
    .then((data)=> res.json(data))
    .catch((error)=>res.json({ message : error})); 
    }
catch{
        res.status(404).json('Not found: id not found' + error);
    }
});

module.exports = router;



// router.get('/events', async (req, res) => {

//     const { name,address:{city}, pagesize,pagenumber } = req.query;
  
//     let filter = {}
  
//     if (name) {
//       filter.name = { $regex: `${name}`, $options: 'i' };
//     }

//     if(city){
//       filter.city = { $regex: `${city}`, $options: 'i' };
//     }
  
  
//     let pageSizeNumber = parseInt(pagesize);
  
//     if (isNaN(pageSizeNumber)) {
//       pageSizeNumber = 0
//     }
//     let pageNumberNumber = parseInt(pagenumber);
  
//     if (isNaN(pageNumberNumber)) {
//       pageNumberNumber = 1
//     }
  
//     try {
//       const events = await Event
//         .find(filter)
//         .limit(pagesize)
//         .skip((pageNumberNumber - 1) * pageSizeNumber)
//         .lean();
//       res.json(events);
  
//     }
//     catch (error) {
//       res.status(500).json('db error ' + error)
//     }
//   })