# Voting Backend


![Voting Backend](https://github.com/provotum/meta/raw/c8d381f4b3e0c39248757db349964c66bfa25dbf/voter-admin.png)


This repository holds the voting administration frontend to create votes on the blockchain.

## Installation
Follow the steps below to run this app on your local system

* Clone this repo and `cd` into it: `git clone git@github.com:provotum/admin.git && cd admin`
* Run `npm install`
* Adjust the environment variables in `.env`. You'll need:
    * `BACKEND=` The url to the running [backend](https://github.com/provotum/backend) instance.
    * `WEBSOCKET=` The url to the backend websocket endpoint. Usually the same as the `BACKEND` variable.
    
## Development

Once installed, you may run 
```
  npm start -s
```
which will open the app on [http://localhost:3000/](http://localhost:3000/)

## Production

To get a production build of this application, run 
```
  npm run build
```
which will generate a bundled version of this app in `dist/bundle.js`.
To display the app, you'll eventually need an `index.html` as follows:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Admin Dashboard | Provotum</title>
    <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
    <link rel="manifest" href="favicon/site.webmanifest">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
</head>
<body>
<div id="app"></div>
<script src="/bundle.js" charset="utf-8"></script>
</body>
</html>
```
