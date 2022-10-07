const fs = require('fs');
const path = require('path');

const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require('sequelize');


const Events = db.Event;
const Functions = db.Function;
const Tickets = db.Ticket;
const Categories = db.Category;
const Teaters = db.Teater;
const Citys = db.City;
const States = db.State;
const Countries = db.Country;
const Showtypes = db.Showtype;

let productController = {
    allProducts: async (req, res) => {
        try {
            const events = await Events.findAll();
            const functions = await Functions.findAll();
            const tickets = await Tickets.findAll();
            const teaters = await Teaters.findAll();
            const categories = await Categories.findAll();
            const citys = await Citys.findAll();
            return res.render('./products/all-products', {events, functions, tickets, teaters, categories, citys})
        } catch (error) {
            res.send(error)
        }
    },
    detail: async (req, res) => {
        try {
            const eventId = req.params.id;
            const event = await Events.findByPk(eventId);

            const teater = await Teaters.findOne({
                where: {
                    id: event.teater_id
                }
            });
            const functions = await Functions.findAll({
                where: {
                    event_id: eventId
                },
                order: [
                    ['date', 'ASC']
                ]
        });
           const tickets = await Tickets.findAll({
            where: {
                event_id: eventId
            },
            order: [
                ['price', 'ASC']
            ]
           });
            
            return res.render('./products/product-detail', {event, tickets, functions, teater});
        
        } catch (error) {
            res.send(error)
        }
    },
    create: (req, res) => {
       return res.render('./products/create-event');
    },
    store: async (req, res) => {
       try {  
		const newEvent = {             
			showtype: req.body.showType,
            artist: req.body.artist,
            subtitle: req.body.subtitle,
			description: req.body.description,
            linkMaps: req.body.linkMaps,
            linkYoutube: req.body.linkYT,
			imageEvent:  req.file?.filename, 
		    category_id: req.body.category,
            teater_id: req.body.teater,
			// country: req.body.country,
            // state: req.body.state,
			// city: req.body.city,
            // direction : req.body.direction,
        };

       

		const newFunction = {
            date: req.body.date,
            time: req.body.time,
            durationTime: req.body.durationTime,
            event_id: req.params.id
        };
        
        const newTicket = {
            type: req.body.type,   
            price: req.body.price,            
            lot: req.body.lot,
            function_id: newFunction.id
        };

      const eventCreated =  await  Events.create(newEvent);

      const functions = [];

      req.body.date?.forEach((date, index) => {          
          functions.push({
            date, 
            time: req.body.hour[index],
            event_id: eventCreated.id
        });
      });
      
    //   await Functions.create(newFunction);
    //   await  Tickets.create(newTicket);

    // como hago para guardar diferentes funciones y 
    // diferentes tickets?

          return res.redirect('/');  
    } 
    catch (error) {
        res.send(error);
    }
    },
    edit: async (req, res) => {
        try {
            const eventId = req.params.id;
            const event = await Events.findByPk(eventId);
            const countries = await Countries.findAll();
            const states = await States.findAll();
            const citys = await Citys.findAll();
            const teaters = await Teaters.findAll();
            const showtypes = await Showtypes.findAll();
            const categories = await Categories.findAll();
            const functions = await Functions.findAll({
                where: {
                    event_id: eventId
                }}
            );
           
            const tickets = await Tickets.findAll({
                where: {
                    event_id: eventId
                }
            })
           
                return res.render('./products/edit-event', { event, functions, tickets, countries, states, citys, teaters, showtypes, categories} );

            
        } catch (error) {
            res.send(error)
        }
    },
    update: async (req, res) => {
        try{
            
            const eventId = req.params.id;
            // const functions = await Functions.findAll({
            //     where: {
            //         event_id: eventId
            //     }}
            // );
            
            const eventToUpdate = {
                showtype: req.body.showType,
                artist: req.body.artist,
                subtitle: req.body.subtitle,
                description: req.body.description,
                linkYoutube: req.body.linkYT,
                imageEvent:  req.file?.filename, 
                showtype_id: req.body.showtype_id,
                category_id: req.body.category_id,
                teater_id: req.body.teater_id,
                country_id: req.body.country_id,
                state_id: req.body.state_id,
                city_id: req.body.city_id
            };

       
            console.log(eventToUpdate)
       await Events.update(eventToUpdate, {where: { id: eventId}});

        return res.redirect('/products/all');

        } catch (error){
            res.send(error)
        }
    
    },
    delete: async (req, res) => {
		try {
        // agregar delete de sus funciones y de sus tickets
            const eventId = req.params.id;
            await Events.destroy({where: {id: eventId}})
            return res.redirect('/products/all');

        } catch (error) {
            res.send(error)
        }
       
	}


};

module.exports = productController;


// let productController = {
//     allProducts: (req, res) => {
//         const all = getProducts().filter(product => product.all === 'all');
//        return res.render('./products/all-products',{all});
//     },
//     detail: (req, res) => {
//         const product = getProducts().find(element => element.id == req.params.id); 
//         return res.render('./products/product-detail', {product});
//     },
//     create: (req, res) => {
//        return res.render('./products/create-event');
//     },
//     store: (req, res) => {
//         const productsClone = getProducts();
        
// 		const newProduct = {             
// 			id: productsClone[productsClone.length -1].id + 1,
// 			showType: req.body.showType,
//             artist: req.body.artist,
//             subtitle: req.body.subtitle,
// 			description: req.body.description,
// 			country: req.body.country,
//             state: req.body.state,
// 			city: req.body.city,
//             direction : req.body.direction,
// 			stage: req.body.stage,
//             direction: req.body.direction,
//             date1: req.body.date1,
//             hour1: req.body.hour1,
//             ticketType1: req.body.ticketType1,   
//             price1: req.body.price1,            
//             lot1: req.body.lot1,
//             category: req.body.category,
//             all: req.body.all,
//             linkMaps: req.body.linkMaps,
//             linkYT: req.body.linkYT,
// 			image:  req.file.filename
		    
//     }
// 		productsClone.push(newProduct);
// 		fs.writeFileSync(productsFilePath, JSON.stringify(productsClone, null, ' '));
// 		return res.redirect('/');
//     },
//     edit: (req, res) => {
//         const product = getProducts().find(element => element.id == req.params.id); 
//        return  res.render('./products/edit-event', {product});
//     },
//     update: (req, res) => {
//         const indexProducto = getProducts().findIndex(element => element.id == req.params.id);
//         const products = getProducts();

//             products[indexProducto] = {
//             ...products[indexProducto],    
//             showType: req.body.showType,
//             artist: req.body.artist,
//             subtitle: req.body.subtitle,
// 			description: req.body.description,
// 			country: req.body.country,
//             state: req.body.state,
// 			city: req.body.city,
//             direction : req.body.direction,
// 			stage: req.body.stage,
//             direction: req.body.direction,
//             date1: req.body.date1,
//             hour1: req.body.hour1,
//             ticketType1: req.body.ticketType1,   
//             price1: req.body.price1,            
//             lot1: req.body.lot1,
//             category: req.body.category, 
//             linkMaps: req.body.linkMaps,
//             linkYT: req.body.linkYT,
// 			image: req.file ? req.file.filename : req.body.oldImage
//             }

//             let productModificarJson = JSON.stringify(products, null, ' ');
//             fs.writeFileSync(productsFilePath, productModificarJson);

//             return res.redirect('/products/all');
//     },
//     delete : (req, res) => {
		
//         const allProductsFilter = getProducts().filter(product => product.id != req.params.id);

// 		fs.writeFileSync(productsFilePath, JSON.stringify(allProductsFilter, null, ' '));

// 		return res.redirect('/products/all');
       
// 	}


//     };

// module.exports = productController;