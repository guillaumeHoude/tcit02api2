# TransportCanada it-02 process API2
Built for the hiring process for TransportCanada IT-02 Process \# 20-MOT-EA-HRS-98277-2

## How to deploy API2
### Prerequisites
- [Node.js version 16.14.1](https://nodejs.org/dist/v16.14.1/)
- NPM 8.5.0 (should be included with Node.js)
- Server should have an internet connection to install the NPM package

### Deployment Steps
1. Extract the whole directory anywhere on your machine
   - Make sure executables have read & write access
2. Open a terminal or command prompt and navigate to the inside of said directory (
   - For example if you put it under *C:\\* and kept the name of the directory, you would navigate to *C:\\tcit02api2* (on windows you would `cd C:\\tcit02api2`)
3. From the terminal/command prompt, type `npm install` and wait until it installs everything it needs
4. From the same terminal type `npm start`
5. API2 is active, leave the terminal open to let it run
6. You can access the GET request in a browser by going to [http://localhost:3002/api2](http://localhost:3002/api2)
   - You must POST first otherwise it will return status HTTP response status code [204 No Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204)

   
Written by @GuillaumeHoude