// messages which are used in alert boxes
module.exports.RECORD_SAVED_CONFIRMATION_MESSAGE = 'Your record has been saved!';
module.exports.RECORD_EDITED_CONFIRMATION_MESSAGE = 'Your record has been edited!';
module.exports.NO_SEARCH_RESULTS_FOUND = 'No results found!';

// requests sent by mainWindow to mainProcess
module.exports.REQUEST_TO_SAVE_RECORD = 'record: save';
module.exports.REQUEST_TO_FETCH_A_RECORD = 'record: fetch_a_record';
module.exports.REQUEST_TO_FETCH_ALL_RECORDS = 'record: fetch_all';
module.exports.REQUEST_TO_SAVE_ID_TEMP = 'record: save_id';
module.exports.REQUEST_TO_EDIT_A_RECORD = 'record: edit';
module.exports.REQUEST_TO_UPDATE_RECORD = 'record: update';
module.exports.REQUEST_TO_CHECK_FOR_EDIT_REQUEST = 'record: check_edit_request';

// data sent by mainProcess to mainWindow
module.exports.RECORD_SAVED_CONFIRMATION = 'record: saved_confirmation';
module.exports.RECORD_FETCH_CONFIRMATION = 'record: fetched_confirmation';
module.exports.RECORD_UPDATE_CONFIRMATION = 'record: update_confirmation';
module.exports.RECORDS_FETCH_CONFIRMATION = 'records: fetched_confirmation';
module.exports.RECORD_EDIT_PENDING_REQUEST = 'record: pending_edit_request';
