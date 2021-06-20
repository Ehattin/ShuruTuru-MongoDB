const express = require('express')
const Guide = require('../models/guides')

/* ***************HELPER METHODS*************** */


/* ***************CRUD METHODS*************** */

module.exports = { 
    /* ***************READ*************** */

    /**  
     * Returns all availbale tours,
     * sorted in ascending order by the tour's name.
     */ 
    getGuides: function (req, res) {
        // readFile(data => {
        //         res.send(sortByIdAsc(data));
        //     } );
    },
    
    /** 
     * Returns a given tour details, including all the tours sites.
     */
    getGuide: function (req, res) {
        // const tourId = req.params["tour_id"];
        // readFile(data => {
        //     let index = findIndex(data,tourId);
        //     if (index>=0){
        //         res.send(data.data[index]);
        //     }else{
        //         res.status(400).send("Invalid tour id, tour doesn't exist.");
        //     }
        // },
        // true);
    },
    /* ***************CREATE*************** */

    /** 
     * This method gets:
     * Tour details- tour id, starting date, duration, price.
     * Guide details- name, email, cellular. 
     * All fields are required to create a tour.
     * After adding the tour, the status is returns.
     */
    createGuide: function (req, res) {
        const guide = new Guide(req.body)
        guide.save().then(guide => {
            res.status(201).send(guide)
        }).catch(e => {
            res.status(400).send(e)
        });

    },

};
