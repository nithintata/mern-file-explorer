# Online File Manager 
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![build](https://img.shields.io/badge/build-Passing-green.svg)
![Javascript](https://img.shields.io/badge/NodeJs-12.15.0-yellow.svg)
![Javascript](https://img.shields.io/badge/React-v17.0-orange.svg)
<br>
<br>
This is a web-app designed to store <b>files/images</b> with different formats in a cloud databse and maintain a heirarchial directory structure. Here users can <b>create/delete/download</b>
various <b>files/folders</b> from the web interface. A search system with multiple filters is incorporated to search the files/folders easily. Users can also share
the files easily as the server automatically creates a shortened URL for easy sharing.

<h3><u>Pre-requisites</u></h3><br>
<ul>
<li><b>Cloudinary: </b>Used to store assets in cloud database</li>
<li><b>Mongodb: </b>Used to store meta data of files/folders to maintain heirarchial structure</li>
<li><b>Bitly: </b>Used to create a shortend link for file sharing</li>
</ul>

<h3><u>Deployment steps</u></h3><br>
<ul>
<li>Clone the entire repository to a new folder on desktop</li>
<li>Open the command prompt from the same folder and type <b>npm install</b>. This will download all the required dependencies which are present in package.json file</li>
<li>Now create a <b>.env</b> file and add all the private keys in it.</li>
<li>To start the server enter the command <b>npm start</b></li>
<li>To start the client server goto <a href="/client">client</a> directory and enter the command <b>npm start</b></li>
</ul>

<h3><u>Images</u></h3><br>
<img src="https://res.cloudinary.com/nithin/image/upload/v1610435643/Screenshot_349_c3fi0t.png" alt="home_screen">
<img src="https://res.cloudinary.com/nithin/image/upload/v1610435644/Screenshot_350_ajumzr.png" alt="share">
<img src="https://res.cloudinary.com/nithin/image/upload/v1610435642/Screenshot_351_r55mp8.png" alt="search_screen">
