var bl = require("bl"),
    stream = require("readable-stream");

var HeadedStream = module.exports = function HeadedStream(options) {
  stream.Transform.call(this, options);

  this._buffer = bl();
  this._headerLength = null;
  this._header = null;
};
HeadedStream.prototype = Object.create(stream.Transform.prototype, {constructor: {value: HeadedStream}});

HeadedStream.prototype._transform = function _transform(input, encoding, done) {
  if (this._headerLength === null || this._header === null) {
    this._buffer.append(input);

    if (this._headerLength === null && this._buffer.length >= 4) {
      this._headerLength = this._buffer.readUInt32BE(0);
      this._buffer.consume(4);
    }

    if (this._buffer.length >= this._headerLength) {
      this._header = this._buffer.slice(0, this._headerLength);
      this._buffer.consume(this._headerLength);

      this.emit("header", this._header);

      if (this._buffer.length) {
        this.push(this._buffer.slice(0, this._buffer.length));
      }

      this._buffer = null;
    }

    return done();
  }

  this.push(input);

  return done();
};
