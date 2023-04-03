const fs = require('fs');
const crypto = require('crypto');


module.exports = class Repository {

  constructor(filename) {
    if(!filename) throw new Error("Creating a repository requires a filename!");
    this.filename = filename;
    //check if the repostory file exists
    try {
    fs.accessSync(this.filename);
    } catch(err) {
      //if the file doesn't exist, crate the file users.json
      fs.writeFileSync(this.filename, "[]");
    }
  }

  //Improve
  async create(attrs) {
    attrs.id = this.randomId();
    const records = await this.getAll();
    //seems need to use records insted attr
    records.push(attrs);
    await this.writeAll(records);
    //seems need to use records insted attrs
    return attrs;
  }

  async getAll() {
    //open the file called this.f
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8'})
    ); 
  }

  

  async writeAll(records) {
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
  }

  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id === id);    
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find(record => record.id === id);
    if(!record) throw new Error(`Record ${id} not found`);    
    //record = {email: am@gmail.com}, attr = {password: 1111} and we try to asygn attrs to record. The result will be record = {email: am@gmail.com, password: 1111} 
    Object.assign(record, attrs);

    await this.writeAll(records);
  }

  async getByOne(filters) {
    const records = await this.getAll();
    for( let record of records ) {
      let found = true;

      for( let key in filters ) {
        if(record[key] !== filters[key]) found = false;               
      }
      if(found === true) return record;
    }
  }

};