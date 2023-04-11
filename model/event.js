//schema of event 
const mongoose = require("mongoose"); 
const Joi = require('joi');
const { Timestamp } = require("mongodb");
const { number, string } = require("joi");

const ticketSchema = mongoose.Schema({
    title:{
        type:String, 
        required: true
    },
    price:{
        type:Number, 
        required:true
    },
    availableSeats:{
        type:Number, 
        required:true
    },
    // add any other relevant fields here

});

const addressSchema = new mongoose.Schema({
    city: {type: String},
    county: String, 
    line1: String, 
    line2: String, 
    eircode: String,    
    _id: String,
})

const eventSchema = mongoose.Schema({
    name:{
        type:String, 
        required: true
    },
    description:{
        type:String, 
        required:true
    },
    contactNumber:{
        type: String, 
        required:true
    }, 
    contact_email:{
        type:String, 
        required:true
    }, 
    // salesStartDate:{
    //     type:Date, 
    //     required:true
    // }, 
    // salesEndDate:{
    //     type:Date, 
    //     required:true
    // },
    eventDateStarts:{
        type:Date, 
        required:true
    }, 
//     eventDateEnds:{
//         type:Date, 
//     }, 
    
    urlImg:{
        type:String, 
       // required:true
    },
    category:{
        type:String, 
       // required:true
    },
    views:{
        type:Number, 
        default: 0
       },
   createdDate : { type: Date, default: Date.now()}, 
   
   address: addressSchema,
   
   startsPrice:{
    type:Number, 
//     required:true
   },
   refundpolicy:{
    type:String, 
    default: "No Refounds"
   }, 
   currency:{
    type:String, 
    default:"EUR"
   },
   tickets: [ticketSchema],

//    tags:{
//     type:[String],
//     required: true
//  }

});


function ValidateEvent(event) {

    const addressJoiSchema = Joi.object({
        city: Joi.string()
        .min(2).required(),
        county: Joi.string(), 
        _id: Joi.string(), 
        line1: 
        Joi.required(), 
        eircode: Joi.string()
        .min(3).regex(/^[ACDEFHKNPRTVWXY]{1}[0-9]{1}[0-9W]{1}[\ \-]?[0-9ACDEFHKNPRTVWXY]{4}$/
        )

    })

     const eventJoiSchema = Joi.object({
        name: Joi.string()
        .min(3)
        .required()
        .messages({'string.empty': "you must enter name"}),
        contactNumber: Joi.string().min(6).regex(/^([+])?(\d+)$/),
       

        // salesStartDate: Joi.date()
        // .min('now')
        // .message('"date" cannot be earlier than today')
        // .required(),

        // salesEndDate: Joi.date()
        //  .greater(Joi.ref('salesStartDate'))
        //  .max(Joi.ref('evendDateStarts'))
        //  .required(),

         eventDateStarts: Joi.date(),
        //  .min('now')
        //  .message('"date" cannot be earlier than today')
        //  .required(),


//          eventDateEnds: Joi.date(),
 
        //  salesEndDate: Joi.date()
        //   .greater(Joi.ref('salesStartDate'))
        //   .required(),

        urlImg:Joi.string(),
        category: Joi.string(),

        contact_email: Joi.string().email()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ie'] } }),
        
        address: addressJoiSchema,
    

        status: Joi.string().default('Open'), 

        description: Joi.string().min(5),

        startsPrice: Joi.number(),

        tickets: Joi.array(),

        views: Joi.number(), // allow _id property

        createdDate: Joi.date(),
        refundpolicy: Joi.string(), 
        currency: Joi.string(),
        __v: Joi.any(), 
        
        _id: Joi.string() // allow _id property
     })
    
     return eventJoiSchema.validate(event);
 }
 
 const Event = mongoose.model('event', eventSchema);
 module.exports = {Event, ValidateEvent}


 


// module.exports = mongoose.model('event', eventschema); 

