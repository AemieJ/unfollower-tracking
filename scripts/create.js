// This script is solely responsible for generating the list of  followers of github. 

// Importing the files
const axios = require('axios');
const cheerio = require('cheerio');

// assigning variables
let userName = 'AemieJ';
let userGithubProfile = `https://github.com/${userName}`;
let userData = {}; // will contain the entire data of userName, followersCount & listOfFollowers;
userData['userName'] = userName;

const createList = async(pageCount, listOfFollowers, flag) => {
    while (!flag) {
        let currCount = 0;
        try {
            let githubUrl = `${userGithubProfile}/?page=${pageCount}&tab=followers`;
            const { data } = await axios.get(githubUrl);
            const $ = cheerio.load(data);

            // fetches the list of followers on each page
            $('.user-profile-nav + div div.position-relative span + span').each((_idx, el) => {
                listOfFollowers.push($(el).text());
                currCount = _idx + 1;
            });
            ++pageCount;
            if (currCount == 0){
                flag = true;
            }
        } catch (error) {
            throw error;
        }
    }
    userData['followersList'] = listOfFollowers;
    return userData;
}

const fetchFollowers = async() => {
    try {
        const { data } = await axios.get(userGithubProfile);
        const $ = cheerio.load(data);
        let followerCount = 0, pageCount = 1;
        let listOfFollowers = [];
        let flag = false;

        // fetches the total number of followers from user github page
        $('.js-profile-editable-area > div > div a span').each((_idx, el) => {
            if (_idx === 0) followerCount = $(el).text();
        });
        userData['followersNumber'] = followerCount;

        let res = await createList(pageCount, listOfFollowers, flag);
        return res;          
    } catch (error) {
        throw error;
    }
};

const fetch = async() => {
    let res = await fetchFollowers();
    return res;
};

module.exports = {
    fetch: fetch
};
