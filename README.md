# interview-x
Please fork the repo and do a pull request with your changes

# Overview
I administer a soccer league and I'd like a web application to track team names and match scores.  

# Project Scope and Requirements

* As an admin I need to enter the team names, the final score and match date
* As a public user, I need to see the league standings
* Project needs to be created using node.js with MySQL backend and Angular 1.* frontend
* Please make at least 3 commits to github
* Optional: host your website and database with AWS

# Initial Setup

1. Create local MySQL database and a db user with full privilages on the database.

2. Update the *localDiskDb* connection configuruation in *www/config/connections.js* with the appropriate database and db user credentials.

3. In the *www* directory, install Node packages.
```
www> node install
```

4. In the *www/assets* directory, install and run Bower.
```
www/assets> npm in stall -g bower
www/assets> bower install
```

5. Run grunt in the *www* directory.
```
www> grunt
```

6. In the *www* directory, spin up the server.
```
www> sails lift
```

7. Execute populate-database.sql to populate lookup values.

8. Visit the web application at [http://localhost:1337/](http://localhost:1337/).