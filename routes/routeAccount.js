module.exports = function(app, dbstuff){
    var eh = require('../lib/errorHelper');
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;
    var Account = require('../models/accountSchema')(db);
    var RatesheetList = mongoose.model('RatesheetList');
    
    app.get('/accounts', function (req, res){
        var update = req.session.update;
        Account.find({}, {}, {sort: 'name'}, function(err, accounts){
            if(err){
                req.session.update = eh.set_error("There was a problem accesing user db",
                                                    err);
            }
	    RatesheetList.find({}, 'name', function (err, ratesheets){
                if(err){
                    req.session.update = eh.set_error("There was a problem accesing ratesheet db",
                                                    err);
                }
                res.render('accounts', {
                    ctx: {
                        title: "pyGreedy - Accounts",
		        accounts: accounts,
		        ratesheets: ratesheets,
                        update: update
                    }
	        });
	    });
        });
        // then clear the update so its displayed only once
        delete req.session.update;
    });
 
    app.get('/accountdestroy/:id', function (req, res ){
        Account.findById(req.params.id, function(err, acc){
            if(err){
                req.session.update = eh.set_error("Cannot find this user in DB",
                                                  err);
            }
	    acc.remove(function(err, acc){
                if(err){
                    req.session.update = eh.set_error("There was a problem deleting the user",
                                                    err);
                }else{
                    req.session.update = eh.set_info("User successfully deleted");
                }
	        res.redirect('/accounts');
	    });
        });
    });

    app.get('/accountedit/:id', function(req, res){
        var update = req.session.update;
        Account.findById(req.params.id, function(err, acc){
            if(err){
                req.session.update = eh.set_error("There was a problem accessing user db",
                                                    err);
            }
	    RatesheetList.find({rstype: 'ratesheet'},function (err, ratesheets){
                if(err){
                    req.session.update = eh.set_error("There was a problem accessing ratesheet db",
                                                    err);
                }
	        RatesheetList.find({rstype: 'discount'}, function (err, discounts){
                    if(err){
                        req.session.update = eh.set_error("There was a problem accessing ratesheet db",
                                                    err);
                    }
		    res.render('accountedit', {
		        ctx: {
                            title: 'pyGreedy - Account Edit',
		            acc : acc,
		            ratesheets: ratesheets,
		            discounts: discounts,
                            update: update
                        }
		    });
	        });
	    });
        });
        //then clear the session so its displayed only once
        delete req.session.update;
    });
    
    app.post('/accountcreate', function(req, res){
        new Account({
	    id : req.body.id,
	    name : req.body.name,
	    sapid : req.body.sapid,
	    identifier : req.body.identifier,
	    ratesheet : req.body.ratesheet,
	    discount: "",
	    created : Date.now(),
	    updated : Date.now()
        }).save(function(err){
            if(err){
                req.session.update = eh.set_error("There was a problem adding account",
                                                  err);
            }
            else{
                req.session.update = eh.set_info("Account added");
            }
	    res.redirect('/accounts');
        });
    });
    
    app.post('/accountupdate/:id', function(req, res){
        Account.findById(req.params.id, function(err, acc){
            if(err){
                req.session.update = eh.set_error("There was a problem accessing the account data",
                                                  err);
            }
            
	    acc.name = req.body.name;
	    acc.sapid = req.body.sapid;
	    acc.identifier = req.body.identifier;
	    acc.ratesheet = req.body.ratesheet;
	    acc.discount = req.body.discount;
	    acc.updated = Date.now();
	    acc.save(function(err){
                if(err){
                    req.session.update = eh.set_error("There was a problem updating account",
                                                      err);
                }else{
                    req.session.update = eh.set_info("Account updated");
                }
	        res.redirect('/accountedit/'+acc._id);
	    });
        });
    });
}
