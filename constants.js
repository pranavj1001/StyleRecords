// messages which are used in alert boxes
module.exports.RECORD_SAVED_CONFIRMATION_MESSAGE = 'Your record has been saved!';
module.exports.RECORD_EDITED_CONFIRMATION_MESSAGE = 'Your record has been edited!';

// requests sent by mainWindow to mainProcess
module.exports.REQUEST_TO_SAVE_RECORD = 'record: save';
module.exports.REQUEST_TO_FETCH_ALL_RECORDS = 'record: fetch_all';

// data sent by mainProcess to mainWindow
module.exports.RECORD_SAVED_CONFIRMATION = 'record: saved_confirmation';
module.exports.RECORDS_FETCH_CONFIRMATION = 'record: fetched_confirmation';
