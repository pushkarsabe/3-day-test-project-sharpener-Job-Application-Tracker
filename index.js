const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const sequelize = require('./util/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const User = require('./model/user');
const JobTracker = require('./model/jobTracker');
const Contact = require('./model/contact');
const Company = require('./model/company');

const userRoute = require('./routes/user');
const JobTrackerRoute = require('./routes/jobTracker');
const contactRoute = require('./routes/contact');
const companyRoute = require('./routes/company');

app.use('/user', userRoute);
app.use('/JobTracker', JobTrackerRoute);
app.use('/contact', contactRoute);
app.use('/company', companyRoute);

//foreign key mapping from user to JobTracker
User.hasMany(JobTracker, { foreignKey: 'userId' });
//foreign key mapping user to Contact
User.hasMany(Contact, { foreignKey: 'userId' });
//foreign key mapping user to Contact
User.hasMany(Company, { foreignKey: 'userId' });
//foreign key mapping user to Contact
User.hasMany(Resume, { foreignKey: 'userId' });


// this will create tabble
sequelize
    .sync()
    .then(result => {
        // console.log(result);
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.log(err);
    });

