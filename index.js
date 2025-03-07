const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/db');
// require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const User = require('./model/user');
const JobTracker = require('./model/jobTracker');
const Company = require('./model/company');

const userRoute = require('./routes/user');
const jobTrackerRoute = require('./routes/jobTracker');
const companyRoute = require('./routes/company');

app.use('/user', userRoute);
app.use('/jobTracker', jobTrackerRoute);
app.use('/company', companyRoute);

//foreign key mapping from user to JobTracker
User.hasMany(JobTracker, { foreignKey: 'userId' });
//foreign key mapping Company to user
User.hasMany(Company, { foreignKey: 'userId' });

let connect = async () => {
    try {
        await sequelize.sync();
        app.listen(process.env.PORT);
    }
    catch (err) {   
        console.log(err);
    }
}
connect();
