const express = require('express')
const Tour = require('../models/tours')

/* ***************HELPER METHODS*************** */


/* ***************CRUD METHODS*************** */

module.exports = {
    /* ***************READ*************** */

    /**  
     * Returns all availbale tours,
     */
    getTours: function (req, res) {
        Tour.find().then(tours =>
            res.send(tours)
        ).catch(e => res.status(500).send())
    },
    
    /** 
     * Returns a given tour details, including all the tours sites.
     */
    getTour: function (req, res) {
        const tourName = req.params["tour_id"];
        Tour.findOne({ 'name':  tourName}).then(tour =>
            res.send(tour)
        ).catch(e => res.status(500).send())
    },
  
    /* ***************CREATE*************** */

    /** 
     * This method gets:
     * Tour details- tour id, starting date, duration, price.
     * GuideId - the guide reference in the guide collection. 
     * All fields are required to create a tour.
     * After adding the tour, the status is returns.
     */
    createTour: function (req, res) {
        const tour = new Tour(req.body)
        tour.save().then(tou => {
            res.status(201).send(tour)
        }).catch(e => {
            res.status(400).send(e)
        });
    },
   /* ***************UPDATE*************** */

    /**
     * Updates a given tour details- tour id, starting date, duration, price.
     * Or/and a guide details- name, email, cellular. 
     */
     updateTour: function (req, res) {

        const tourName = req.params["tour_id"];
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'start_date', 'duration', 'price', 'guide']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
    
       Tour.updateOne( { name: tourName }, req.body, { new: true, runValidators: true }).then(user => {
            if (!user) {
                return res.status(404).send()
            }
            else {
                console.log(user)
                res.send(user)
            }
        }).catch(e => res.status(400).send(e))
    },

    /**
     * Updates a given tour sites. 
     */
    createSiteInPath: function (req, res) {

        // const tourId = req.params["tour_id"];
    
        // readFile( data => {

        //     //check if tour exists
        //     let index = findIndex(data,tourId);
        //     if (index<0){
        //         res.status(400).send("Tour doesn't exists.");
        //         return;
        //     }
        //     //check for critical fields
        //     if(!req.body.name ||  !req.body.country){
        //         res.status(400).send("Bad input.This fields are required: site name, site country.");
        //         return;
        //     }
           
        //     //check if site exists
        //     const siteName = req.body.name;
        //     const found = data.data[index].path.some(s => s.name === siteName);
        //     if (found){
        //         res.status(400).send("Site already exists.");
        //         return;
        //     }

        //     //adding the site
        //     let site = { "name": req.body.name, "country":req.body.country};
        //     data.data[index].path.push(site);
    
        //     writeFile(JSON.stringify(data, null, 2), () => {
        //         res.status(200).send("Site was added.");
        //         return;
        //     });
        // }, true);
       
    },
    /* ***************DELETE*************** */

    /**
     * Deletes a given tour site.
     * If the given site is empty - "", all the tour sites will be deleted.
     */
    deleteSite: function (req, res) {

        // const tourId = req.params["tour_id"];
        // const siteName = req.params["site_id"];
        // let message = "Site was deleted.";
        
        // readFile( data => {

        //     //check if tour exists
        //     let index = findIndex(data,tourId);
        //     if (index<0){
        //         res.status(400).send("Tour doesn't exists.");
        //         return;
        //     }

        //    //check if we recieved ALL order
        //    if(siteName === "ALL"){
        //         data.data[index].path = [];
        //         message = "All sites were deleted"
        //    }else{
        //         //check if site exists
        //         const found = data.data[index].path.some(s => s.name === siteName);
        //         if (!found){
        //             res.status(400).send("Site doesn't exists.");
        //             return;
        //         }

        //         //deleting the site
        //         let filteredSites = data.data[index].path.filter(s => s.name != siteName);
        //         data.data[index].path = filteredSites;
        //     }

        //     writeFile(JSON.stringify(data, null, 2), () => {
        //         res.status(200).send(message);
        //         return;
        //     });
        // }, true);
    },

    /**
     * Deletes a given tour.
     */
    deleteTour: function (req, res) {
     
        const tourName = req.params["tour_id"];
    
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