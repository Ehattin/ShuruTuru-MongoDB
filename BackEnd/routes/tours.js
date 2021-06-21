const Tours = require('../models/tours'),
Tour = Tours.Tour,
Site = Tours.Site,
Guide = require('../models/guides');

/* ***************CRUD METHODS*************** */

module.exports = {
    /* ***************READ*************** */

    /**  
     * Returns all availbale tours,    
     * sorted in ascending order by the tour's name.
     */
    getTours: function (req, res) {
        Tour.find().populate('guide').sort({name:1}).then(tours =>{
            res.status(200).send(tours)
        }
        ).catch(e => res.status(500).send("Error in finding the Tours. " + e))
        
    },
    
    /** 
     * Returns a given tour details, including all the tours sites.
     */
    getTour: function (req, res) {
        const tourName = req.params["tour_name"];
        Tour.findOne({ 'name':  tourName}).populate('guide').then(tour =>
            res.status(200).send(tour)
        ).catch(e => res.status(500).send("Tour "+e+ "doesn't exist."))
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

            //updating the guide field to the guide id
            let guideId = guide._id.toString();
            req.body.guide = guideId;
            console.log("guide id was found")
            
            const tourName = req.body.name;
            if(!tourName){
                res.status(400).send("Tour name required.")
                return;
            }
            //checking if a tour with this name exist
            Tour.exists({ 'name':  tourName}, function(err, result) {
                
                if (err) {
                    res.status(500).send("Error in checking if the Tour exists. " + err)
                    console.log("Error in checking if the Tour exists. " + err)
                }
                else {
                    if(result){
                        res.status(400).send("A Tour with this name already exists.")
                        console.log("A Tour with this name already exists. ")
                    }
                    else{
                        //creating the new tour
                        const tour = new Tour(req.body);

                        tour.save()
                            .then(tour => 
                            res.status(200).send()
                        ).catch(e => {
                            console.log("error in save tour: " + e)
                            res.status(400).send("Tour with this name already exist.")
                        });
                    }
                
                }
            });
        
        }).catch(e => {
            console.log("error in getting guide: " + e)
            res.status(400).send("Guide with this name don't exist.")
        });
    
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
        const tourName = req.params["tour_name"];
        
        //creating the new site
         const site = new Site(req.body);
        
         Tour.updateOne( { name: tourName }, 
            { '$addToSet': { 'path': site } }
        ).then(user => {
                if (!user) {
                   res.status(404).send("Tour doesn't exist.")
                }
                else {
                    console.log("updated succssefuly")
                    res.status(200).send()
                }
            }).catch(e => {
                console.log("ERROR IN UPDATE: " +e);
                res.status(400).send("Path with this name already exist.")
            })
    },
    /* ***************DELETE*************** */

    /**
     * Deletes a given tour site.
     * If the given site is empty - "", all the tour sites will be deleted.
     */
    deleteSite: function (req, res) {

        const tourName = req.params["tour_name"];
        const siteName = req.params["site_name"];

        Tour.updateOne( { name: tourName }, 
            { $pull: { 'path': { name: siteName} }}
        ).then(user => {
                if (!user) {
                   res.status(404).send("Tour doesn't exist.")
                }
                else {
                    console.log("updated succssefuly")
                    res.status(200).send()
                }
            }).catch(e => {
                console.log("ERROR IN DELETE: " +e);
                res.status(400).send("Path with this name already exist.")
            })
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