const Tour = require('../models/tours'),
Guide = require('../models/guides');

/* ***************CRUD METHODS*************** */

module.exports = {
    /* ***************READ*************** */

    /**  
     * Returns all availbale tours, In order by name
     */
    getTours: function (req, res) {
        Tour.find().sort( { name: 1 } ).then(tours =>
            res.send(tours)
        ).catch(e => res.status(500).send(e))
    },
    
    /** 
     * Returns a given tour details, including all the tours sites.
     */
    getTour: function (req, res) {
        const tourName = req.params["tour_name"];
        Tour.findOne({ 'name':  tourName}).then(tour =>
            res.send(tour)
        ).catch(e => res.status(500).send("Tour doesn't exist."))
    },
  
    /* ***************CREATE*************** */

    /** 
     * This method gets:
     * Tour details- tour id, starting date, duration, price.
     * GuideId - the guide name. 
     * The function will find the guide Id from the guide collection. 
     * All fields are required to create a tour.
     * After adding the tour, the status is returns.
     */
    createTour: function (req, res) {
        const guideName = req.body.guide;

        //getting the guide id by his name
        Guide.findOne({ 'name':  guideName}).then(guide =>{

            let guideId = guide._id.toString();

            //updating the guide field to the guide id
            req.body.guide = guideId;

            //creating the new tour
            const tour = new Tour(req.body);
            
            tour.save().then(tour => {
                res.status(201).send(tour)
            }).catch(e => {
                res.status(400).send("Tour with this name already exist.")
            });
            }
        ).catch(e => res.status(400).send("This guide doesn't exist."))
    },

   /* ***************UPDATE*************** */

    /**
     * Updates a given tour details- tour id, starting date, duration, price.
     * Or/and a guide details- name, email, cellular. 
     */
     updateTour: function (req, res) {

        const tourName = req.params["tour_name"];
        const updates = Object.keys(req.body)
        const allowedUpdates = ['start_date', 'duration', 'price']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }

        //updating the tour document
        Tour.updateOne( { name: tourName }, req.body, { new: true, runValidators: true }).then(user => {
                if (!user) {
                    return res.status(404).send("Tour doesn't exist.")
                }
                else {
                    res.send(user)
                }
            }).catch(e => res.status(400).send(e))
    },

    /**
     * Updates a given tour sites. 
     */
    createSiteInPath: function (req, res) {
        //check for critical fields
        if(!req.body.name ||  !req.body.country){
            res.status(400).send("Bad input.This fields are required: site name, site country.");
            return;
        }

        const tourName = req.params["tour_name"];
        const siteToAdd = "path." + req.body.name;
        const siteCountry = req.body.country;
    
        let update = {$addToSet:{}};    
        update.$addToSet[siteToAdd] = siteCountry;

        //updating the tour document
        Tour.updateOne( { name: tourName }, update).then(user => {
            if (!user) {
                return res.status(404).send("Tour doesn't exist.")
            }
            else {
                res.send(user)
            }
        }).catch(e => res.status(400).send("Path with this name already exist."))
       
    },
    /* ***************DELETE*************** */

    /**
     * Deletes a given tour site.
     * If the given site is empty - "", all the tour sites will be deleted.
     */
    deleteSite: function (req, res) {
        
        const tourName = req.params["tour_name"];
        const siteName = req.params["site_name"];

        const siteToDelete = "path." + siteName;

        let update = {$unset:{}};    
        update.$unset[siteToDelete] = undefined;


        //updating the tour document
        Tour.updateOne( { name: tourName }, update).then(user => {
            if (!user) {
                return res.status(404).send("Tour doesn't exist.")
            }
            else {
                res.send("site deleted succssefuly")
            }
        }).catch(e => res.status(400).send("Path with this name already exist."))
    },

    /**
     * Deletes a given tour.
     */
    deleteTour: function (req, res) {
     
        const tourName = req.params["tour_name"];
    
       Tour.deleteOne( { name: tourName }).then(user => {
            if (!user) {
                return res.status(404).send()
            }
            else {
                console.log(user)
                res.send(user)
            }
        }).catch(e => res.status(400).send(e))
    }
};