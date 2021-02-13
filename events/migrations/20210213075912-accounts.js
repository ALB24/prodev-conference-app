'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('email_account', {
    email: {
      notNull: true,
      primaryKey: true,
      length: 100,
      type: 'string',
    },
    account_id: {
      notNull: true,
      unsigned: true,
      type: 'int',
    },
  });
};

exports.down = function(db) {
  return db.dropTable('email_account');
};

exports._meta = {
  "version": 1
};
