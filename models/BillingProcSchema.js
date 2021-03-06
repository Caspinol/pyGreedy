module.exports = function(db){
    return db.model('BillingProc', BillingProcSchema());
}


function BillingProcSchema(){
    var Schema = require('mongoose').Schema;
    
    return new Schema({
        
        running: Boolean,
        binary_dir: {
            type: String, default: "~/pyGreedy/bin/billing.py"
        },
        pdf_dir: {
            type: String, default: "~/pyGreedy/pdf_out"
        },
        csv_dir: {
            type: String, default: "~/pyGreedy/csv_out"
        },
        log_dir: {
            type: String,
            default: "/var/log/pyGreedy/billing.log"
        }
    });
}
