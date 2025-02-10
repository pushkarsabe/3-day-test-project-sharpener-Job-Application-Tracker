Node js Job Tracker API

## Setup

```
    $ git clone 
    $ npm install
    $ npm run dev - to run on localhost 5000
```

## API Endpoints

## User Routes

### * Create User

`POST |  /user/signup` 

| Key           | Value          |
| ---------     | -----------    |
| firstName     | Admin          |
| lastName      | testuser       |
| email         | admin@admin.com|
| password      | password       |

### * Login User

`POST |  /user/login` 

| Key        | Value          |
| ---------  | -----------    |
| email      | admin@admin.com|
| password   | password       |

### * Get Users

`GET |  /user/data` 

### * Get Single Users

`GET |  /user/data/:id` 

### * Update Single User

`PUT |  /user/update`
| Key           | Value          |
| firstName     | Admin          |
| lastName      | testuser       |
| email         | admin@admin.com|


### * Delete Single User

`Delete |  /user/delete`

________________________________________________________________________________________________________________________________

### * Create new Job

`POST |  /jobTracker/add`
### resumes and coverLetter are both string so they take two files and upload them to the coludnary and save the url in database

| Key             | Value             |
| jobDescription  | <value>           |
| notes           | <value>           |
| postedDate      | <value>           |
| savedDate       | <value>           |
| deadlineDate    | <value>           |
| appliedDate     | <value>           |
| followUpDate    | <value>           |
| resumes         | <value>           |
| coverLetter     | <value>           |
| jobPosition     | <value>           |
| company         | <value>           |
| minimumSalary   | <value>           |
| maximumSalary   | <value>           |
| currency        | <value>           |
| salaryPayPeriod | <value>           |
| location        | <value>           |
| status          | <value>           |
| excitement      | <value>           |


### * Get All Job

`GET |  /jobTracker/data` 

### * Get Single Job

`GET |  /jobTracker/data/:id` 

### * Update Job

`PUT |  /jobTracker/update/:id`

| Key             | Value             |
| jobDescription  | <value>           |
| notes           | <value>           |
| postedDate      | <value>           |
| savedDate       | <value>           |
| deadlineDate    | <value>           |
| appliedDate     | <value>           |
| followUpDate    | <value>           |
| resumes         | <value>           |
| coverLetter     | <value>           |
| jobPosition     | <value>           |
| company         | <value>           |
| minimumSalary   | <value>           |
| maximumSalary   | <value>           |
| currency        | <value>           |
| salaryPayPeriod | <value>           |
| location        | <value>           |
| status          | <value>           |
| excitement      | <value>           |


### * Delete Single Job

`Delete |  /jobTracker/delete`
________________________________________________________________________________________________________________________________


### * Create new Contact

`POST |  /contact/add`

| Key             | Value             |
| firstName       | <value>           |
| lastName        | <value>           |
| jobTitle        | <value>           |
| companyName     | <value>           |
| email           | <value>           |
| linkedIn        | <value>           |
| twitter         | <value>           |
| location        | <value>           |
| phoneNumber     | <value>           |
| relationship    | <value>           |
| goal            | <value>           |
| status          | <value>           |
| dateSaved       | <value>           |
| lastContacted   | <value>           |
| followUp        | <value>           |
| notes           | <value>           |


### * Get All Contact

`GET |  /contact/data` 

### * Get Single Contact

`GET |  /contact/data/:id` 

### * Update Contact

`PUT |  /contact/update/:id`

| Key             | Value             |
| firstName       | <value>           |
| lastName        | <value>           |
| jobTitle        | <value>           |
| companyName     | <value>           |
| email           | <value>           |
| linkedIn        | <value>           |
| twitter         | <value>           |
| location        | <value>           |
| goal            | <value>           |
| status          | <value>           |
| phoneNumber     | <value>           |
| relationship    | <value>           |
| dateSaved       | <value>           |
| lastContacted   | <value>           |
| followUp        | <value>           |
| notes           | <value>           |

### * Delete Single Contact

`Delete |  /contact/delete`

________________________________________________________________________________________________________________________________


### * Create new Company

`POST |  /company/add`

| Key             | Value             |
| Name            | <value>           |
| companySize     | <value>           |
| companyType     | <value>           |
| location        | <value>           |
| website         | <value>           |
| linkedIn        | <value>           |
| yearFounded     | <value>           |
| notes           | <value>           |

### * Get All Company

`GET |  /company/data` 

### * Get Single Company

`GET |  /company/data/:id` 

### * Update Company

`PUT |  /company/update/:id`

| Key            | Value            |
| -------------- | ---------------- |
| Name           | <value>          |
| companySize    | <value>          |
| companyType    | <value>          |
| location       | <value>          |
| website        | <value>          |
| linkedIn       | <value>          |
| yearFounded    | <value>          |
| notes          | <value>          |

### * Delete Single Company

`Delete |  /company/delete`



## License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:










































