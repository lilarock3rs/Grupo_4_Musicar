const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


const Events = db.Event;
const Functions = db.Function;


const searchController = {
   
    searchBar: async function (req, res) {
        try {
           
            
            const events = await Events.findAll({
                where: {
                    ...(req.query.artist != null) && {artist: {[Op.like]:`%${req.query.artist}%`}},
                    ...(req.query.category != null) && {category_id: req.query.category},
                    ...(req.query.place != null) && {teater_id: req.query.place},
                    
                }
            });
         
        
            return res.json({
                total: events.length,
                data: events
            });

        } catch (error) {
            res.send(error)
        }
    },
    
}

module.exports = searchController;

