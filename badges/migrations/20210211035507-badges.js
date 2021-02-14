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
  return db.createTable('badges', {
    id: {
      autoIncrement: true,
      notNull: true,
      primaryKey: true,
      type: 'int',
      unsigned: true,
    },
    email: {
      length: 100,
      notNull: true,
      type: 'string',
      unique: true,
    },
    name: {
      notNull: true,
      type: 'string',
      length: 100,
    },
    company_name: {
      length: 100,
      type: 'string',
    },
    role: {
      type: 'string',
      length: 20,
    },
    event_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'badges_event_id_fk',
        table: 'events_accounts',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT',
        },
        mapping: 'event_id',
      }
    },
    created: {
      notNull: true,
      type: 'timestamp',
      defaultValue: new String('CURRENT_TIMESTAMP'),
    },
  });
};

exports.down = function(db) {
  return db.dropTable('badges');
};

exports._meta = {
  "version": 1
};
