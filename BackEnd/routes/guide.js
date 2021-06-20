const Guide = require('../models/guides')

/* ***************CRUD METHODS*************** */

module.exports = { 
    /* ***************READ*************** */

    /**  
     * Returns all availbale guides.
     */ 
    getGuides: function (req, res) {
        Guide.find().then(guides =>
            res.send(guides)
        ).catch(e => res.status(500).send(e))
    },
    
    /** 
     * Returns a given guide details.
     */
    getGuide: function (req, res) {
        const guideName = req.params["guide_name"];
        Guide.findOne({ 'name':  guideName}).then(guide =>
            res.send(guide)
        ).catch(e => res.status(500).send("Guide doesn't exist."))
    },
    /* ***************CREATE*************** */
    /** 
     * This method gets:
     * Guide details- name, email, cellular. 
     * All fields are required to create a guide.
     * After adding the guide, the status is returns.
     */
    createGuide: function (req, res) {
        const guide = new Guide(req.body)

        guide.save().then(guide => {
            res.status(201).send(guide)
        }).catch(e => {
            res.status(400).send("Guide with this name already exist.")
        });

    },

};
