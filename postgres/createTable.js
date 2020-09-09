const client = require('../config/postgres');
client.connect();

const create = async() => {
    const userTable = `
    CREATE TABLE users (
        userName varchar NOT NULL,
        followers int NOT NULL,
        listFollowers json NOT NULL,
        listUnfollowers json
    );
    `;

    await client.query(userTable);
}

module.exports = {
    create: create
};