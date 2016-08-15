# storm
 [![dependencies Status](https://david-dm.org/montyanderson/storm/status.svg)](https://david-dm.org/montyanderson/storm)
[![Build Status](https://travis-ci.org/montyanderson/storm.svg?branch=master)](https://travis-ci.org/montyanderson/storm)
> A Spotify playlist generator. Rewrite and successor of [SmartPlay](https://github.com/montyanderson/SmartPlay).

![Screenshot](http://i64.tinypic.com/120jq61.jpg)

## To Do

* Extend caching to playlist generation... (make api specific wrappers?)
* Security - validate inputs

## Development

* Install dependencies and nodemon

```
$ npm install
$ npm install -g nodemon
```

* Run the gulp process to compile styles and scripts as they change

```
$ npm run dev
```

* Automatically restart the server when you make changes

```
$ nodemon index.js --lastfm d9bb1870d3269646f740544d9def2c95 --spotify f946296624e1496f9a1f6310973c744b
```
