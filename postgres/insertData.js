const {create} = require("./createTable");
const {fetch} = require("../scripts/create");

const client = require('../config/postgres');
const query = `SELECT to_regclass('users');`;

(async function() {
    let res = await client.query(query);
    if (res.rows[0].to_regclass !== 'users') {
        await create();
    }
    let data = await fetch();
    let dataFollowers = {followList: data.followersList};
    let dataUnfollowers = {};

    // check for the existing userName 
    const checkQuery = {
        text: 'SELECT * FROM USERS WHERE userName=$1;',
        values: [data.userName]
    };

    let checkUser = await client.query(checkQuery);
    if (checkUser.rowCount === 1) {
        // update an existing Query
        const updateQuery = {
            text: `UPDATE users SET followers = $2, listFollowers = $3, listUnfollowers = $4 WHERE userName = $1;`,
            values: [data.userName, data.followersNumber, dataFollowers, dataUnfollowers]
        };
        await client.query(updateQuery);
    } else {
        // insert the new Query
        const insertQuery = {
            text: 'INSERT INTO users(userName, followers, listFollowers, listUnfollowers) VALUES($1, $2, $3, $4);',
            values: [data.userName, data.followersNumber, dataFollowers, dataUnfollowers]
        };

        await client.query(insertQuery);
    }
    
    client.end();
})();