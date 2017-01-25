# real-estate-test

As requested, this web site is a technical challenge project. 

Technologies used: javascript es6, react.js, node.js, sqlite, html5, css3. 
The following simplifications/shortcuts should be mentioned: 

* The web site has no security; web service endpoints are not protected; 
* web pages have no data validation/data formatting; 
* UI is very simplistic. 

Assuming node.js has already been configured locally, here are the steps to get the project up and running: 

1. Download the source code from https://github.com/andronovs/real-estate-test to the target directory, like real-estate-test. 
2. Browse to real-estate-test\server\data folder and delete realEstate.db file, if it already exists. 
3. Open the command line in real-estate-test\server\data folder and run seeder.cmd 
This will populate the local sqlite database with some default dummy data to start. 
4. Open a command line window in real-estate-test folder and run 

> webpack

5. Open another command line window in the same folder and execute the 

> npm start 

6. Launch the browser (this web site was originally tested in Google Chrome) and navigate to 

http://localhost:8000

