// Import required modules
const mysql          = require('mysql');
const config         = require('./db.config'); // rename file db_config.example.js and type there your information
const iterateJSON    = require('./formJson');






/**
  My class for working with MySQL database
  @return {Object}
*/

class Database {

  /**
    @constructor
    @param user;
    @param password;
    @param host;
    @param database;
  */

  constructor(host, user, pwd, db) {
    this.connection = mysql.createPool({
      host      : config.host,
      user      : config.user,
      password  : config.password,
      database  : config.database
    });
  }

  /**
  * Getting all entries from table.
  * @param table: string;
  * @param callback: function
  * @return {Object}
  */

  getAll(table, callback, groupBy) {
    let group = groupBy ? `GROUP BY ${groupBy}` : '';
    this.connection.query(`SELECT * FROM ${table} ${group}`, (err,rows,fields) => {
      if(!!err)
        callback(err);
      else
        callback(rows);
    });
  }

  /**
  * Getting one entry from table.
  * @param table: string;
  * @param field: string;
  * @param value: any;
  * @param callback: function
  * @return {Object}
  */

  getOneEntry(table, field, value, callback) {
    this.connection.query(`SELECT * FROM ${table} WHERE ${field} = '${value}'`, (err,rows,fields) => {
      if(!!err)
        callback(err);
      else
        callback(rows[0]);
    });
  }

  /**
  * Update User's auth token.
  * @param table: string;
  * @param field: string
  * @param token: string
  * @param user_id: number
  * @return {Object}
  */

  updateUserByToken(table, field, token, user_id) {
    this.connection.query(`UPDATE ${table} SET ${field}='${token}' WHERE user_id = ${user_id}`);
  }


  /**
  * Getting fields of requested table.
  * @param tables: string[];
  * @param fields: string[];
  * @param id: number;
  * @param callback: function;
  * @return {Object}
  */


  getFields(tables, fields, id, callback, groupBy) {
    //let group = groupBy ? `GROUP BY ${groupBy}` : '';
    let _tables = tables.split(",");
    let table="models";

    let sql1 = `SELECT DISTINCT ?? FROM ${table}`;
    let sql2 = `SELECT DISTINCT ?? FROM ${table}`;

    // tables an array
    for(let _table in _tables) {
      if(_table > 0) {
        sql1 += ` INNER JOIN ` + _tables[_table];
        sql2 += ` INNER JOIN ` + _tables[_table];
        console.log(_tables[_table]);
      }
    }
    sql1 += ` ON models.id = ${id} = params_list.model_id`;
    sql2 += ` ON models.id = params_list.model_id`;
    let sql = id ? sql1 : sql2;
    console.log(sql);
    this.connection.query(sql, [fields], (err, rows, fields) => {
      if(!!err)
        callback(err);
      else
        callback(rows);
    });
  }


  /**
  * Insert entry in table
  * @param table: string;
  * @param arr: any[];
  * @param callback: function
  * @return {Object}
  */

  addEntry(table, arr, callback) {
    this.connection.query(`INSERT INTO ${table} SET ?`, arr, (err, rows, fields) => {
      if(!!err)
        callback(err);
      else
        callback({
          "id": rows.insertId
        });
    });
  }


  /**
  * Update entry in  table.
  * @param table: string;
  * @param arr: any[];
  * @param id: number;
  * @param callback: function
  * @return {Object}
  */

  updateEntry(table, arr, id, callback) {
    this.connection.query(`UPDATE ${table} SET ? WHERE id=${id}`, arr, (err, rows, fields) => {
      if(!!err)
        callback(err);
      else
        callback(rows.changedRows);
    });
  }


  getGood(id, callback) {
    this.connection.query(`SELECT * FROM models
      INNER JOIN model_previews
      ON models.id = model_previews.model_id
      INNER JOIN params_list
      INNER JOIN brands
      ON models.id = params_list.model_id AND models.brand_id = brands.brand_id
       WHERE models.id = ${id}`, (err, rows) => {
      if(!!err)
        callback(err);
      else
        callback(iterateJSON(rows));
    });
  }

  getGoods(catalog, callback) {
    let sql = catalog == undefined ?
    `SELECT * FROM models
      INNER JOIN model_previews
      ON models.id = model_previews.model_id
      INNER JOIN params_list
      ON models.id = params_list.model_id`
      :
      `SELECT * FROM models
        INNER JOIN model_previews
        ON models.id = model_previews.model_id
        INNER JOIN params_list
        ON models.id = params_list.model_id
        INNER JOIN brands
        ON models.brand_id = brands.brand_id
        WHERE brands.brand_title LIKE '%${catalog}%'`;
    this.connection.query(sql, (err, rows) => {
      if(!!err)
        callback(err);
      else
        callback(iterateJSON(rows));
    });
  }

  query(sql, callback) {
    this.connection.query(sql, (err, rows) => {
      if(!!err)
        callback(err);
      else
        callback(iterateJSON(rows));
    });
  }

}


module.exports.connection = () => {
  return new Database();
};
