headed-stream
=============

A stream with a header! Yay!

Overview
--------

headed-stream lets you put a length-prefixed header on a stream, for whatever
weird purposes you have. I wanted to send a little bit of metadata along with
a connection from a proxy; I don't know what you want to do. I'm not here to
judge.

Protocol
--------

```
[X(4)][Y(X)][Z...]

X: Header length (4 bytes)
Y: Header data (X bytes)
Z: Content (any following data)
```

Usage
-----

```js
var HeadedStream = require("headed-stream"),
    net = require("net");

net.createServer(function(socket) {
  var hs = new HeadedStream();

  hs.on("header", function(header) {
    console.log(header);
  });

  // remaining data will be piped back to the socket, making this an echo server
  socket.pipe(hs).pipe(socket);
}).listen(3000);
```

API
---

### HeadedStream (constructor)

```js
var s = new HeadedStream();
```

The `HeadedStream` object is a duplex stream, so it implements all the regular
streamy things you'd expect. The only addition is the "header" event that it
emits once it's collected your headers for you.

### #header

```js
s.on("header", function(header) {
  console.log(header);
});
```

License
-------

3-clause BSD. A copy is included with the source.

Contact
-------

* GitHub ([deoxxa](http://github.com/deoxxa))
* Twitter ([@deoxxa](http://twitter.com/deoxxa))
* Email ([deoxxa@fknsrs.biz](mailto:deoxxa@fknsrs.biz))
