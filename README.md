# MERNStackTemplate

<h4>This is a MERN Stack template to start your dream project sooner.</h4>
<p>Follow each step carefully.</p>

<h1>Step 1 :</h1>
<p>Create a folder for your dream project.</p>
<p>Open the folder in VS Code and go to terminal.</p>
<p><i>Copy this repository url.</i></p>
<p>In command line, type : <i>git clone {repository url} ./</i></p>

<h1>Step 2 :</h1>
<h2>Go to Server directory by typing : <i>cd server</i> in command line</h2>
<p>First type this command : <i>ncu -u</i></p>
<p>Second type this command : <i>npm install</i></p>

<h3>Server Environment Variables</h3>
<p>Copy all this variables and paste it in .env file inside server folder and fill the value accordingly.</p>
<p><i>PORT</i> generally 8000</p>
<p><i>CLIENT_URL</i></p>
<p><i>mongoDB_USERNAME</i></p>
<p><i>mongoDB_PASSWORD</i></p>
<p><i>mongoDB_URL</i></p>
<p><i>GOOGLE_OAUTH_CLIENT_ID</i></p>
<p><i>GOOGLE_OAUTH_CLIENT_SECRET</i></p>
<p><i>FACEBOOK_OAUTH_APP_ID</i></p>
<p><i>FACEBOOK_OAUTH_APP_SECRET</i></p>
<p><i>JWT_SECRET_KEY</i></p>
<p><i>JWT_EXPIRES_IN</i> in milliseconds</p>

<h1>Step 3 :</h1>
<h2>Go to Client directory by typing : <i>cd ../client</i> in command line</h2>
<p>First type this command : <i>ncu -u</i></p>
<p>Second type this command : <i>npm install</i></p>

<h3>Client Environment Variables</h3>
<p>Copy all this variables and paste it in .env file inside client folder and fill the value accordingly.</p>
<p><i>VITE_APP_SERVER_URL</i></p>
<p><i>VITE_APP_CRYPTO_SECRET_KEY</i></p>
<p><i>VITE_APP_CRYPTO_SECRET_VALUE</i></p>

<h1>Server Dependensies :</h1>
<ul>
  <li>axios :- for making api requests from 3rd-party apis.</li>
  <li>bcryptjs :- to hash the user password before saving it into database.</li>
  <li>jsonwebtoken :- for making token </li>
  <li>passport.js :- for OAuth. Already make setup for Google and Facebook OAuth. Only need to take client id and secret from provider and make change in callback url in provider.</li>
  <li>validator :- for making validation in MongoDB Schema or in general.</li>
  <li>mongoose :- for mongoDB database management and already make basic setup. Thus, only change new Database url and password in .env</li>
  <li>nodemon :- for auto-restarting server on update.</li>
</ul>

<h1>Client Dependensies :</h1>
<ul>
  <li>react-redux :- for global state management.</li>
  <li>react-query :- for making efficient api queries.</li>
  <li>react-query-devtools :- for showing all the api queries done by react-query.</li>
  <li>axios :- for making api requests from 3rd-party apis.</li>
  <li>crypto-js :- to encrypt and decrypt a string witha secret key.</li>
  <li>js-cookie :- to set and get the cookies in react js.</li>
  <li>react-hook-form :- managing form efficiently through proper validation and prevent re-rendering of pages.</li>
  <li>react-icons :- for using icons in UI design.</li>
  <li>react-router-dom :- for routing and navigating into react app.</li>
  <li>tailwind css :- for CSS</li>
  <li>react-toastify :- for giving better UI notification.</li>
  <li>validator :- for making validation in Form or in general.</li>
</ul>

<p>created by Amit Kumar</p>
