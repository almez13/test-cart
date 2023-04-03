const fs = require('fs');
const crypto = require("crypto");
const util = require('util');
const Repository = require('./repository.js');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {

  async create(attrs) {
    //give id to each attrs. Attrs = {email: "", password: "",}
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex"); 
    const buf = await scrypt(attrs.password, salt, 64);

    //attrs {email:"",password: "",}
    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${buf.toString()}.${salt}`
    };
    records.push(record);
    //write the updated records array to users.json
    await this.writeAll(records);
    //
    return record;
  }

  async comparePasswords(saved, supplied) {
    //Saved - pass saved in our database
    //Supplied -pass given by user in sign in page
    const [hashed, salt] = saved.split(".");
    const hashedSupplied = await scrypt(supplied, salt, 64);
    //return tru or false
    return hashed === hashedSupplied.toString();
  }

};

module.exports = new UsersRepository("users.json");


