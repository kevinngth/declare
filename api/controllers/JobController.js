const requestURL = `https://docs.google.com/forms/u/2/d/e/1FAIpQLSfviLd5-9633aKQBAeVIS58rr0WCEO8irhjLYFHYgGBsN49iQ/formResponse`;
const queryString = `?entry.1315738832_year=2020&entry.1315738832_month=11&entry.1315738832_day=28&entry.597915666_year=&entry.597915666_month=&entry.597915666_day=&entry.2139343058=SEIF+3&entry.350879435=Test&entry.1443611571=333&entry.88756219=test%40test.com&entry.2095552297=&entry.145808765=&entry.1464206896=No&entry.748573793=No&entry.1351260288=None+of+the+Above&entry.1840918119=No&entry.472021917=No&entry.1296804660=None+of+the+above&entry.1655462793=No&entry.941208881=Yes%2C+I+understand.&entry.330888046=Yes%2C+I+understand.&emailAddress=test%40test.com&entry.1464206896_sentinel=&entry.748573793_sentinel=&entry.1351260288_sentinel=&entry.1840918119_sentinel=&entry.472021917_sentinel=&entry.1296804660_sentinel=&entry.1655462793_sentinel=&entry.941208881_sentinel=&entry.330888046_sentinel=&fvv=1&draftResponse=%5Bnull%2Cnull%2C%22-2671320884787126167%22%5D%0D%0A&pageHistory=0&fbzx=-2671320884787126167`;
const axios = require('axios');


const controller = {

  testJob: (req, res) => {
    console.log(`Hi testing`);
  }

}

module.exports = controller;