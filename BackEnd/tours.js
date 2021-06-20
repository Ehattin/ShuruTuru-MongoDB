const fs = require('fs');
const dataPath = './data/tours.json';

/* ***************HELPER METHODS*************** */
const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    
    fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500); 
                return;
            }
            if (!data) 
                data="{}";
            callback(returnJson ? JSON.parse(data) : data);
       });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
        
    fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                console.log(err);
                res.sendStatus(500); 
                return;
            }
            callback();
        });
};

const sortByIdAsc = (data) =>{
    let arr = jsonToArr(data);
    arr.sort(function(a, b) {
            return (a.id > b.id) ? 1 : ((a.id < b.id) ? -1 : 0)
    });
    return arrToJson(arr);
};

const jsonToArr = (js) =>{
    let obj = JSON.parse(js);
    let res = [];
    for(let i in obj)
        res.push(obj[i]);
     return res[0];   
};

const arrToJson = (arr)=>{
    let toString = "{ \"data\":" +JSON.stringify(arr, 2)+ " }";
    let json =JSON.parse(toString);
   return json;
};

const findIndex = (data, tourId)=>{
    return data.data.findIndex(function(item, i){
        return item.id === tourId
    });
}

/* ***************CRUD METHODS*************** */

module.exports = {
    /* ***************READ*************** */

    /**  
     * Returns all availbale tours,
     * sorted in ascending order by the tour's name.
     */
    getTours: function (req, res) {
        readFile(data => {
                res.send(sortByIdAsc(data));
            } );
    },
    
    /** 
     * Returns a given tour details, including all the tours sites.
     */
    getTour: function (req, res) {
        const tourId = req.params["tour_id"];
        readFile(data => {
            let index = findIndex(data,tourId);
            if (index>=0){
                res.send(data.data[index]);
            }else{
                res.status(400).send("Invalid tour id, tour doesn't exist.");
            }
        },
        true);
    },
  
    /* ***************CREATE*************** */

    /** 
     * This method gets:
     * Tour details- tour id, starting date, duration, price.
     * Guide details- name, email, cellular. 
     * All fields are required to create a tour.
     * After adding the tour, the status is returns.
     */
    createTour: function (req, res) {

        //check for critical fields
        if(!req.body.id || !req.body.start_date || !req.body.duration 
                || !req.body.price || !req.body.guide || !req.body.guide.name
                || !req.body.guide.email || !req.body.guide.cellular ){
            res.status(400).send("Bad input.This fields are required: tour id, starting date, duration, price, Guide details- name, email, cellular.");
            return;
        }
        //check for valid index
        if(req.body.id < 0){
            res.status(400).send("Invalid tour id.");
            return;
        }

        //adding the tour
        readFile( data => {
            let tourId = req.body.id;
            //check if tour already exists
            let index = findIndex(data,tourId);
            if (index>=0){
                res.status(400).send("Tour already exists.");
                return;
            }
           
            //adding the new tour
            data.data.push( { "id": req.body.id, "start_date":req.body.start_date, "duration":req.body.duration,
                                    "price":req.body.price, "guide":{
                                                                "name":req.body.guide.name, 
                                                                "email":req.body.guide.email,
                                                                "cellular":req.body.guide.cellular
                                                            }, 
                                                            "path" : []
                                });
            
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('Tour was added.');
                return;
            });
        }, true);
    },

    /* ***************UPDATE*************** */

    /**
     * Updates a given tour details- tour id, starting date, duration, price.
     * Or/and a guide details- name, email, cellular. 
     */
    updateTour: function (req, res) {
        const tourId = req.params["tour_id"];
    
        readFile( data => {
            //check if tour exists
            let index = findIndex(data,tourId);
            if (index<0){
                res.status(400).send("Tour doesn't exists.");
                return;
            }
        
          
            //cannot change tour id
            if(req.body.id){
                res.status(400).send("Cannot change tour id.");
                return;
            }
            //updating given fields
            if(req.body.start_date)
                data.data[index].start_date = req.body.start_date; 
            if(req.body.duration)
                data.data[index].duration = req.body.duration;
            if(req.body.price)
                data.data[index].price = req.body.price;
            if(req.body.guide){
                if(req.body.guide.name)
                    data.data[index].guide.name = req.body.guide.name;
                if(req.body.guide.email)
                    data.data[index].guide.email = req.body.guide.email;
                if(req.body.guide.cellular)
                    data.data[index].guide.cellular = req.body.guide.cellular;
            }
    
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send("Tour was updated.");
                return;
            });
        }, true);

    },

    /**
     * Updates a given tour sites. 
     */
    createSiteInPath: function (req, res) {

        const tourId = req.params["tour_id"];
    
        readFile( data => {

            //check if tour exists
            let index = findIndex(data,tourId);
            if (index<0){
                res.status(400).send("Tour doesn't exists.");
                return;
            }
            //check for critical fields
            if(!req.body.name ||  !req.body.country){
                res.status(400).send("Bad input.This fields are required: site name, site country.");
                return;
            }
           
            //check if site exists
            const siteName = req.body.name;
            const found = data.data[index].path.some(s => s.name === siteName);
            if (found){
                res.status(400).send("Site already exists.");
                return;
            }

            //adding the site
            let site = { "name": req.body.name, "country":req.body.country};
            data.data[index].path.push(site);
    
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send("Site was added.");
                return;
            });
        }, true);
       
    },

    /* ***************DELETE*************** */

    /**
     * Deletes a given tour site.
     * If the given site is empty - "", all the tour sites will be deleted.
     */
    deleteSite: function (req, res) {

        const tourId = req.params["tour_id"];
        const siteName = req.params["site_id"];
        let message = "Site was deleted.";
        
        readFile( data => {

            //check if tour exists
            let index = findIndex(data,tourId);
            if (index<0){
                res.status(400).send("Tour doesn't exists.");
                return;
            }

           //check if we recieved ALL order
           if(siteName === "ALL"){
                data.data[index].path = [];
                message = "All sites were deleted"
           }else{
                //check if site exists
                const found = data.data[index].path.some(s => s.name === siteName);
                if (!found){
                    res.status(400).send("Site doesn't exists.");
                    return;
                }

                //deleting the site
                let filteredSites = data.data[index].path.filter(s => s.name != siteName);
                data.data[index].path = filteredSites;
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(message);
                return;
            });
        }, true);
    },

    /**
     * Deletes a given tour.
     */
    deleteTour: function (req, res) {

        const tourId = req.params["tour_id"];

        readFile( data => {

            //check if tour exists
            let index = findIndex(data,tourId);
            if (index<0){
                res.status(400).send("Tour doesn't exists.");
                return;
            }

            //deleting the tour
            let filteredTours = data.data.filter(s => s.id != tourId);
            data.data = filteredTours;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send("Tour was deleted.");
                return;
            });
        }, true);
    }
};