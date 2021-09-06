var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/vercel/entry.js
__export(exports, {
  default: () => entry_default
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error3 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error3;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error3) {
    if (error3 instanceof FetchBaseError) {
      throw error3;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error3.message}`, "system", error3);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error3) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error3.message}`, "system", error3);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error3 = new AbortError("The operation was aborted.");
      reject(error3);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error3);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error3);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error3) {
                reject(error3);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
        reject(error3);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
          reject(error3);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error3) => {
              reject(error3);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error3) => {
              reject(error3);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// node_modules/@sveltejs/kit/dist/node.js
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      fulfil(data);
    });
  });
}

// node_modules/@sveltejs/kit/dist/ssr.js
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const params = route.params(match);
  const response = await handler({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = headers["content-type"];
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error3,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error3) {
    error3.stack = options2.get_stack(error3);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error4) => {
      throw new Error(`Failed to serialize session data: ${error4.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error3)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2 && page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2 && page2.path)},
						query: new URLSearchParams(${page2 ? s$1(page2.query.toString()) : ""}),
						params: ${page2 && s$1(page2.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error3) {
  if (!error3)
    return null;
  let serialized = try_serialize(error3);
  if (!serialized) {
    const { name, message, stack } = error3;
    serialized = try_serialize({ ...error3, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error3 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error3 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error3}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error3 };
    }
    return { status, error: error3 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error3
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  const page_proxy = new Proxy(page2, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page2.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = { ...opts.headers };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error3;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error3 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error3
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error3,
      branch,
      page: page2
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4, request);
    return {
      status: 500,
      headers: {},
      body: error4.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error3;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error3 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error3 = e;
          }
          if (loaded && !error3) {
            branch.push(loaded);
          }
          if (error3) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error3
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error3
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error3,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4, request);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error4
    });
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page: page2
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of this.#map)
      yield key;
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        const decoded = decodeURI(request2.path);
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// .svelte-kit/output/server/app.js
function noop2() {
}
function is_promise(value) {
  return value && typeof value === "object" && typeof value.then === "function";
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal2(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop2;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
Promise.resolve();
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape2(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$b = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$b);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n	<meta charset="utf-8" />\n	<title>EcoRoute</title>\n	<link rel="icon" href="icons/icons-192.png" />\n	<link rel="apple-touch-icon" href="icons/icons-512.png">\n	<link rel="manifest" href="manifest.json">\n	<link rel="stylesheet" href="/global.css">\n	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined">\n	<meta name="viewport" content="width=device-width, initial-scale=1" />\n\n	' + head + '\n</head>\n\n<body>\n	<div id="svelte">' + body + `</div>

	<script src="/__/firebase/8.10.0/firebase-app.js"><\/script>
	<script src="/__/firebase/init.js"><\/script>
	<script>
		document.addEventListener('DOMContentLoaded', function () {
			try {
				let app = firebase.app();
				console.log('Firebase SDK loaded');
			} catch (e) {
				console.log('Error loading the Firebase SDK');
				console.error(e);
			}
		});
	<\/script>
</body>

</html>`;
var options = null;
var default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-9a187389.js",
      css: [assets + "/_app/assets/start-61d1577b.css"],
      js: [assets + "/_app/start-9a187389.js", assets + "/_app/chunks/vendor-d0016f91.js", assets + "/_app/chunks/singletons-12a22614.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error22) => String(error22),
    handle_error: (error22, request) => {
      hooks.handleError({ error: error22, request });
      error22.stack = options.get_stack(error22);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = decodeURIComponent;
var empty = () => ({});
var manifest = {
  assets: [{ "file": "favicon.png", "size": 1571, "type": "image/png" }, { "file": "global.css", "size": 1158, "type": "text/css" }, { "file": "icons/icons-192.png", "size": 5026, "type": "image/png" }, { "file": "icons/icons-512.png", "size": 9638, "type": "image/png" }, { "file": "manifest.json", "size": 494, "type": "application/json" }, { "file": "sw.js", "size": 0, "type": "application/javascript" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/suggested-routes\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/suggested-routes.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/ringing-alarm\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/ringing-alarm.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/route-details\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/route-details.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/select-([^/]+?)\/?$/,
      params: (m) => ({ endpoint: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/select-[endpoint].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/api\/bus-arrivals\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return busArrivals;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/directions\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return directions;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/bus-stops\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return busStops;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/places\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return places;
      })
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error22 }) => console.error(error22.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error2;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/suggested-routes.svelte": () => Promise.resolve().then(function() {
    return suggestedRoutes;
  }),
  "src/routes/ringing-alarm.svelte": () => Promise.resolve().then(function() {
    return ringingAlarm;
  }),
  "src/routes/route-details.svelte": () => Promise.resolve().then(function() {
    return routeDetails;
  }),
  "src/routes/select-[endpoint].svelte": () => Promise.resolve().then(function() {
    return select__endpoint_;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-a463dc3d.js", "css": ["assets/pages/__layout.svelte-e97bfc2f.css", "assets/Searchbar-cf5c401e.css", "assets/RouteTimeline-c140c0e6.css"], "js": ["pages/__layout.svelte-a463dc3d.js", "chunks/vendor-d0016f91.js", "chunks/Searchbar-328d4ac3.js", "chunks/navigation-51f4a605.js", "chunks/singletons-12a22614.js", "chunks/stores-e132606c.js", "chunks/RouteTimeline-dd8b7935.js", "chunks/_stores-e4befa5b.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-f31b2681.js", "css": [], "js": ["error.svelte-f31b2681.js", "chunks/vendor-d0016f91.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-87e30356.js", "css": ["assets/pages/index.svelte-022fa377.css", "assets/Box-697cf99a.css", "assets/Searchbar-cf5c401e.css"], "js": ["pages/index.svelte-87e30356.js", "chunks/vendor-d0016f91.js", "chunks/Box-c7b3cfc0.js", "chunks/Searchbar-328d4ac3.js", "chunks/navigation-51f4a605.js", "chunks/singletons-12a22614.js", "chunks/stores-e132606c.js", "chunks/_stores-e4befa5b.js"], "styles": [] }, "src/routes/suggested-routes.svelte": { "entry": "pages/suggested-routes.svelte-85b7d4c8.js", "css": ["assets/pages/suggested-routes.svelte-85ea5e7d.css", "assets/Box-697cf99a.css", "assets/RouteTimeline-c140c0e6.css"], "js": ["pages/suggested-routes.svelte-85b7d4c8.js", "chunks/vendor-d0016f91.js", "chunks/Box-c7b3cfc0.js", "chunks/RouteTimeline-dd8b7935.js", "chunks/navigation-51f4a605.js", "chunks/singletons-12a22614.js", "chunks/_stores-e4befa5b.js", "chunks/stores-e132606c.js"], "styles": [] }, "src/routes/ringing-alarm.svelte": { "entry": "pages/ringing-alarm.svelte-cb7c59fe.js", "css": ["assets/pages/ringing-alarm.svelte-85c37eb3.css"], "js": ["pages/ringing-alarm.svelte-cb7c59fe.js", "chunks/vendor-d0016f91.js"], "styles": [] }, "src/routes/route-details.svelte": { "entry": "pages/route-details.svelte-be538fc8.js", "css": ["assets/pages/route-details.svelte-be9e3c16.css", "assets/Box-697cf99a.css"], "js": ["pages/route-details.svelte-be538fc8.js", "chunks/vendor-d0016f91.js", "chunks/Box-c7b3cfc0.js", "chunks/_stores-e4befa5b.js"], "styles": [] }, "src/routes/select-[endpoint].svelte": { "entry": "pages/select-[endpoint].svelte-3b52b470.js", "css": ["assets/pages/select-[endpoint].svelte-10dc8d04.css", "assets/Box-697cf99a.css"], "js": ["pages/select-[endpoint].svelte-3b52b470.js", "chunks/vendor-d0016f91.js", "chunks/stores-e132606c.js", "chunks/Box-c7b3cfc0.js", "chunks/_stores-e4befa5b.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var config = {
  DATAMALL_KEY: "cmWAPZxsRe+1Dahcw+wBVQ==",
  ONEMAP_CREDENTIALS: JSON.stringify({
    email: "haziqhairil21@gmail.com",
    password: "kcU46$^cuN"
  })
};
async function get$3() {
  const dataMallUrl = "http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2";
  const stopCodeParam = "?BusStopCode=19049";
  const res = await fetch(dataMallUrl + stopCodeParam, {
    headers: {
      AccountKey: config.DATAMALL_KEY
    }
  });
  const data = formatArrivals(await res.json());
  if (data) {
    return {
      body: {
        data
      }
    };
  }
}
function formatArrivals(data) {
  function busNumberSort(bus1, bus2) {
    const number1 = bus1.number.match(/\d+/g)[0];
    const number2 = bus2.number.match(/\d+/g)[0];
    if (number1 !== number2) {
      return parseInt(number1) - parseInt(number2);
    }
    return bus1 > bus2 ? 1 : -1;
  }
  return {
    busStopCode: data.BusStopCode,
    services: data.Services.map((x) => formatService(x)).sort(busNumberSort)
  };
}
function formatService(data) {
  return {
    number: data.ServiceNo,
    arrivals: [formatBus(data.NextBus), formatBus(data.NextBus2)].filter((x) => x !== null)
  };
}
function formatBus(data) {
  if (!data.EstimatedArrival) {
    return null;
  }
  return {
    minutesToArrival: Math.floor(Math.max(new Date(data.EstimatedArrival).getTime() - Date.now(), 0) / 6e4),
    occupancy: data.Load,
    wheelchairAccessible: data.Feature == "WAB",
    type: data.Type
  };
}
var busArrivals = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$3
});
async function getOneMapToken() {
  const url = "https://developers.onemap.sg/privateapi/auth/post/getToken";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: config.ONEMAP_CREDENTIALS
  });
  const data = await res.json();
  return data.access_token;
}
async function get$2({ query }) {
  const url = "https://developers.onemap.sg/privateapi/routingsvc/route";
  const queryParams = [
    `start=${query.get("from")}`,
    `end=${query.get("to")}`,
    "routeType=pt",
    `date=${Intl.DateTimeFormat("en-CA").format()}`,
    `time=${Intl.DateTimeFormat("en", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format()}`,
    "mode=TRANSIT",
    `token=${await getOneMapToken()}`
  ].join("&");
  const res = await fetch(`${url}?${queryParams}`);
  const data = (await res.json()).plan.itineraries;
  return {
    body: data.map(formatRoute).map(sanitiseRoute)
  };
}
function sanitiseRoute(data) {
  data.segments = data.segments.reduce((currentRoute, segment) => {
    if (!currentRoute.length) {
      return [segment];
    }
    if (currentRoute[currentRoute.length - 1].mode === "walk" && segment.mode === "walk") {
      currentRoute[currentRoute.length - 1].distance += segment.distance;
      currentRoute[currentRoute.length - 1].duration += segment.duration;
      currentRoute[currentRoute.length - 1].endLocation = segment.endLocation;
      return currentRoute;
    }
    if (segment.startLocation === segment.endLocation) {
      return currentRoute;
    }
    return currentRoute.concat(segment);
  }, []);
  return data;
}
function formatRoute(data) {
  const segments = data.legs.map(formatSegment);
  return {
    distance: segments.reduce((a, b) => a + b.distance, 0),
    duration: data.duration,
    walkTime: data.walkTime,
    leaveTime: data.startTime,
    arriveTime: data.endTime,
    segments
  };
}
function formatSegment(data) {
  return {
    distance: data.distance,
    duration: (data.endTime - data.startTime) / 1e3,
    mode: {
      WALK: "walk",
      BUS: "bus",
      SUBWAY: "mrt"
    }[data.mode],
    modeIdentity: data.route,
    startLocation: data.from.name,
    endLocation: data.to.name,
    intermediateStops: data.numIntermediateStops
  };
}
var directions = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$2
});
async function get$1() {
  const data = (await fetchData()).map((x) => formatBusStop(x));
  if (data) {
    return {
      body: {
        data
      }
    };
  }
}
async function fetchData(iteration = 0) {
  const url = "http://datamall2.mytransport.sg/ltaodataservice/BusStops";
  const skipParam = "?$skip=" + iteration * 500;
  const res = await fetch(url + skipParam, {
    headers: {
      AccountKey: config.DATAMALL_KEY
    }
  });
  let data = (await res.json()).value;
  if (data.length) {
    const newData = await fetchData(iteration = iteration + 1);
    data = data.concat(newData);
  }
  return data;
}
function formatBusStop(data) {
  return {
    name: data.Description,
    code: data.BusStopCode
  };
}
var busStops = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$1
});
async function get({ query }) {
  if (!query.get("search")) {
    return { body: [] };
  }
  const url = `https://developers.onemap.sg/commonapi/search`;
  const queryParams = [`searchVal=${query.get("search")}`, "getAddrDetails=Y", "returnGeom=Y"].join("&");
  const res = await fetch(`${url}?${queryParams}`);
  const data = await res.json();
  return {
    body: uniq(data.results.map(formatPlace))
  };
}
function formatPlace(data) {
  return {
    name: data.SEARCHVAL,
    address: data.BLK_NO + " " + data.ROAD_NAME,
    longitude: parseFloat(data.LONGITUDE),
    latitude: parseFloat(data.LATITUDE)
  };
}
function uniq(places2) {
  const seen = {};
  return places2.filter(({ name }) => {
    const hasSeen = seen.hasOwnProperty(name);
    if (!hasSeen)
      seen[name] = true;
    return !hasSeen;
  });
}
var places = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get
});
var getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
var page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
var css$a = {
  code: "input.svelte-dd3jo1{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:100%;height:38px;padding-left:var(--space-md);margin:0;background-color:var(--input-field);color:var(--icon-text);opacity:1;font-size:1em;border:none;border-radius:var(--border-radius-sm);transition:0.3s}input.svelte-dd3jo1:focus{outline:none;box-shadow:var(--shadow)}",
  map: `{"version":3,"file":"Searchbar.svelte","sources":["Searchbar.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { goto } from '$app/navigation';\\nimport { page } from '$app/stores';\\nexport let placeholder;\\nexport let text = '';\\nexport let name = undefined;\\nlet ref;\\nfunction redirect() {\\n    if (!$page.params.endpoint && name) {\\n        goto(\`/select-\${name}\`, { keepfocus: true });\\n        if (text == 'Current location') {\\n            text = '';\\n        }\\n    }\\n}\\n<\/script>\\n\\n<input type=\\"text\\" {placeholder} bind:value={text} bind:this={ref} on:click={redirect} />\\n\\n<style>\\n\\tinput {\\n\\t\\t-webkit-appearance: none;\\n\\t\\t-moz-appearance: none;\\n\\t\\tappearance: none;\\n\\n\\t\\twidth: 100%;\\n\\t\\theight: 38px;\\n\\t\\tpadding-left: var(--space-md);\\n\\t\\tmargin: 0;\\n\\t\\tbackground-color: var(--input-field);\\n\\t\\tcolor: var(--icon-text);\\n\\t\\topacity: 1;\\n\\t\\tfont-size: 1em;\\n\\t\\tborder: none;\\n\\t\\tborder-radius: var(--border-radius-sm);\\n\\t\\ttransition: 0.3s;\\n\\t}\\n\\n\\tinput:focus {\\n\\t\\toutline: none;\\n\\t\\tbox-shadow: var(--shadow);\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAmBC,KAAK,cAAC,CAAC,AACN,kBAAkB,CAAE,IAAI,CACxB,eAAe,CAAE,IAAI,CACrB,UAAU,CAAE,IAAI,CAEhB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,YAAY,CAAE,IAAI,UAAU,CAAC,CAC7B,MAAM,CAAE,CAAC,CACT,gBAAgB,CAAE,IAAI,aAAa,CAAC,CACpC,KAAK,CAAE,IAAI,WAAW,CAAC,CACvB,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,GAAG,CACd,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,IAAI,kBAAkB,CAAC,CACtC,UAAU,CAAE,IAAI,AACjB,CAAC,AAED,mBAAK,MAAM,AAAC,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,QAAQ,CAAC,AAC1B,CAAC"}`
};
var Searchbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  let { placeholder } = $$props;
  let { text = "" } = $$props;
  let { name = void 0 } = $$props;
  let ref;
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  $$result.css.add(css$a);
  $$unsubscribe_page();
  return `<input type="${"text"}"${add_attribute("placeholder", placeholder, 0)} class="${"svelte-dd3jo1"}"${add_attribute("value", text, 0)}${add_attribute("this", ref, 0)}>`;
});
var subscriber_queue2 = [];
function readable(value, start) {
  return {
    subscribe: writable2(value, start).subscribe
  };
}
function writable2(value, start = noop2) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal2(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue2.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue2.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue2.length; i += 2) {
            subscriber_queue2[i][0](subscriber_queue2[i + 1]);
          }
          subscriber_queue2.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop2) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop2;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
var currentPlace = readable({}, (set) => {
  if (navigator.geolocation) {
    const id = navigator.geolocation.watchPosition((position) => {
      set({
        name: "Current location",
        address: "",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    });
    return () => navigator.geolocation.clearWatch(id);
  } else {
    alert("Geolocation is not supported by this browser");
  }
});
var destinationQuery = writable2({});
var originQuery = writable2({});
var routes = writable2([]);
var selectedRoute = writable2({});
var css$9 = {
  code: ".route.svelte-hwjbxe{display:flex;flex-direction:row;height:32px;line-height:200%;transition:0.3s}.route.thicker.svelte-hwjbxe{height:36px;line-height:225%}.segment.svelte-hwjbxe{border-radius:var(--border-radius-sm);text-align:center;margin-right:2px;overflow:hidden;color:rgba(0, 0, 0, 0.4)}.segment.border.svelte-hwjbxe{box-shadow:0 0 0 2px var(--input-field) inset}.segment.svelte-hwjbxe::before{content:'';display:inline-block}.label.svelte-hwjbxe{padding:0 var(--space-sm);font-weight:bolder;display:inline-block;white-space:nowrap}.walk.svelte-hwjbxe{background-color:rgb(226, 226, 226);color:rgb(130, 142, 150)}.bus.svelte-hwjbxe{color:var(--overlay);background-color:rgb(45, 175, 105)}.mrt.svelte-hwjbxe{background-color:rgb(3, 89, 173)}.EW.svelte-hwjbxe{background-color:var(--MRT-EW)}.NS.svelte-hwjbxe{background-color:var(--MRT-NS)}.CC.svelte-hwjbxe{background-color:var(--MRT-CC)}.DT.svelte-hwjbxe{background-color:var(--MRT-DT)}",
  map: `{"version":3,"file":"RouteTimeline.svelte","sources":["RouteTimeline.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { goto } from '$app/navigation';\\nimport { selectedRoute } from '../routes/_stores';\\n;\\nimport { page } from '$app/stores';\\nexport let route;\\nexport let longestRoute = route.distance;\\nlet parentWidth;\\nfunction redirect() {\\n    $selectedRoute = route;\\n    goto('route-details');\\n}\\n<\/script>\\n\\n<div\\n\\tclass=\\"route\\"\\n\\tstyle=\\"width: {(route.distance / longestRoute) * 100}%\\"\\n\\tclass:thicker={$page.path === '/route-details'}\\n\\tbind:offsetWidth={parentWidth}\\n\\ton:click={redirect}\\n>\\n\\t{#each route.segments as segment}\\n\\t\\t<!-- Dont show this segment if it's too small -->\\n\\t\\t{#if (segment.distance / route.distance) * parentWidth >= 5}\\n\\t\\t\\t<div\\n\\t\\t\\t\\tclass=\\"segment {segment.mode} {segment.modeIdentity}\\"\\n\\t\\t\\t\\tclass:border={$page.path === '/route-details'}\\n\\t\\t\\t\\tstyle=\\"width: {(segment.distance / route.distance) * 100}%\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<span class=\\"label\\">{segment.modeIdentity || 'walk'}</span>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t{/each}\\n</div>\\n\\n<style>\\n\\t.route {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: row;\\n\\t\\theight: 32px;\\n\\t\\tline-height: 200%;\\n\\t\\ttransition: 0.3s;\\n\\t}\\n\\n\\t.route.thicker {\\n\\t\\theight: 36px;\\n\\t\\tline-height: 225%;\\n\\t}\\n\\n\\t.segment {\\n\\t\\tborder-radius: var(--border-radius-sm);\\n\\t\\ttext-align: center;\\n\\t\\tmargin-right: 2px;\\n\\t\\toverflow: hidden;\\n\\t\\tcolor: rgba(0, 0, 0, 0.4);\\n\\t}\\n\\n\\t.segment.border {\\n\\t\\tbox-shadow: 0 0 0 2px var(--input-field) inset;\\n\\t}\\n\\n\\t.segment::before {\\n\\t\\tcontent: '';\\n\\t\\t/* Hide the modeIdentity text when the segment is too short */\\n\\t\\tdisplay: inline-block;\\n\\t}\\n\\n\\t.label {\\n\\t\\tpadding: 0 var(--space-sm);\\n\\t\\tfont-weight: bolder;\\n\\t\\tdisplay: inline-block;\\n\\t\\twhite-space: nowrap;\\n\\t}\\n\\n\\t/* Route timeline segment colours */\\n\\n\\t.walk {\\n\\t\\tbackground-color: rgb(226, 226, 226);\\n\\t\\tcolor: rgb(130, 142, 150);\\n\\t}\\n\\n\\t.bus {\\n\\t\\tcolor: var(--overlay);\\n\\t\\tbackground-color: rgb(45, 175, 105);\\n\\t}\\n\\n\\t.mrt {\\n\\t\\t/* Fallback colour, in case something\\n\\t\\tgoes wrong with the line names */\\n\\t\\tbackground-color: rgb(3, 89, 173);\\n\\t}\\n\\n\\t.EW {\\n\\t\\tbackground-color: var(--MRT-EW);\\n\\t}\\n\\n\\t.NS {\\n\\t\\tbackground-color: var(--MRT-NS);\\n\\t}\\n\\n\\t.CC {\\n\\t\\tbackground-color: var(--MRT-CC);\\n\\t}\\n\\n\\t.DT {\\n\\t\\tbackground-color: var(--MRT-DT);\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAmCC,MAAM,cAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,MAAM,CAAE,IAAI,CACZ,WAAW,CAAE,IAAI,CACjB,UAAU,CAAE,IAAI,AACjB,CAAC,AAED,MAAM,QAAQ,cAAC,CAAC,AACf,MAAM,CAAE,IAAI,CACZ,WAAW,CAAE,IAAI,AAClB,CAAC,AAED,QAAQ,cAAC,CAAC,AACT,aAAa,CAAE,IAAI,kBAAkB,CAAC,CACtC,UAAU,CAAE,MAAM,CAClB,YAAY,CAAE,GAAG,CACjB,QAAQ,CAAE,MAAM,CAChB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AAC1B,CAAC,AAED,QAAQ,OAAO,cAAC,CAAC,AAChB,UAAU,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,IAAI,aAAa,CAAC,CAAC,KAAK,AAC/C,CAAC,AAED,sBAAQ,QAAQ,AAAC,CAAC,AACjB,OAAO,CAAE,EAAE,CAEX,OAAO,CAAE,YAAY,AACtB,CAAC,AAED,MAAM,cAAC,CAAC,AACP,OAAO,CAAE,CAAC,CAAC,IAAI,UAAU,CAAC,CAC1B,WAAW,CAAE,MAAM,CACnB,OAAO,CAAE,YAAY,CACrB,WAAW,CAAE,MAAM,AACpB,CAAC,AAID,KAAK,cAAC,CAAC,AACN,gBAAgB,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CACpC,KAAK,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AAC1B,CAAC,AAED,IAAI,cAAC,CAAC,AACL,KAAK,CAAE,IAAI,SAAS,CAAC,CACrB,gBAAgB,CAAE,IAAI,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AACpC,CAAC,AAED,IAAI,cAAC,CAAC,AAGL,gBAAgB,CAAE,IAAI,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,AAClC,CAAC,AAED,GAAG,cAAC,CAAC,AACJ,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AAChC,CAAC,AAED,GAAG,cAAC,CAAC,AACJ,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AAChC,CAAC,AAED,GAAG,cAAC,CAAC,AACJ,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AAChC,CAAC,AAED,GAAG,cAAC,CAAC,AACJ,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AAChC,CAAC"}`
};
var RouteTimeline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_selectedRoute;
  let $page, $$unsubscribe_page;
  $$unsubscribe_selectedRoute = subscribe(selectedRoute, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { route } = $$props;
  let { longestRoute = route.distance } = $$props;
  let parentWidth;
  if ($$props.route === void 0 && $$bindings.route && route !== void 0)
    $$bindings.route(route);
  if ($$props.longestRoute === void 0 && $$bindings.longestRoute && longestRoute !== void 0)
    $$bindings.longestRoute(longestRoute);
  $$result.css.add(css$9);
  $$unsubscribe_selectedRoute();
  $$unsubscribe_page();
  return `<div class="${["route svelte-hwjbxe", $page.path === "/route-details" ? "thicker" : ""].join(" ").trim()}" style="${"width: " + escape2(route.distance / longestRoute * 100) + "%"}">${each(route.segments, (segment) => `
		${segment.distance / route.distance * parentWidth >= 5 ? `<div class="${[
    "segment " + escape2(segment.mode) + " " + escape2(segment.modeIdentity) + " svelte-hwjbxe",
    $page.path === "/route-details" ? "border" : ""
  ].join(" ").trim()}" style="${"width: " + escape2(segment.distance / route.distance * 100) + "%"}"><span class="${"label svelte-hwjbxe"}">${escape2(segment.modeIdentity || "walk")}</span>
			</div>` : ``}`)}
</div>`;
});
var css$8 = {
  code: "a.svelte-14co5tg{text-decoration:none;color:unset}.material-icons.svelte-14co5tg{color:var(--input-field);margin-right:var(--space-sm)}.chip.svelte-14co5tg{padding:var(--space-sm) var(--space);margin-right:var(--space);background-color:var(--icon-text);border-radius:var(--border-radius-sm);display:flex;flex-direction:row;align-items:center}",
  map: '{"version":3,"file":"Chip.svelte","sources":["Chip.svelte"],"sourcesContent":["<script>\\n\\texport let icon;\\n\\texport let redirect = undefined;\\n<\/script>\\n\\n<a class=\\"chip\\" href={redirect}>\\n\\t<span class=\\"material-icons\\"> {icon} </span>\\n\\t<span class=\\"slot\\">\\n\\t\\t<slot />\\n\\t</span>\\n</a>\\n\\n<style>\\n\\ta {\\n\\t\\ttext-decoration: none;\\n\\t\\tcolor: unset;\\n\\t}\\n\\t.material-icons {\\n\\t\\tcolor: var(--input-field);\\n\\t\\tmargin-right: var(--space-sm);\\n\\t}\\n\\t.chip {\\n\\t\\t/* height: min-content; */\\n\\t\\tpadding: var(--space-sm) var(--space);\\n\\t\\tmargin-right: var(--space);\\n\\t\\tbackground-color: var(--icon-text);\\n\\t\\tborder-radius: var(--border-radius-sm);\\n\\t\\t/* box-shadow: var(--shadow); */\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: row;\\n\\t\\talign-items: center;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAaC,CAAC,eAAC,CAAC,AACF,eAAe,CAAE,IAAI,CACrB,KAAK,CAAE,KAAK,AACb,CAAC,AACD,eAAe,eAAC,CAAC,AAChB,KAAK,CAAE,IAAI,aAAa,CAAC,CACzB,YAAY,CAAE,IAAI,UAAU,CAAC,AAC9B,CAAC,AACD,KAAK,eAAC,CAAC,AAEN,OAAO,CAAE,IAAI,UAAU,CAAC,CAAC,IAAI,OAAO,CAAC,CACrC,YAAY,CAAE,IAAI,OAAO,CAAC,CAC1B,gBAAgB,CAAE,IAAI,WAAW,CAAC,CAClC,aAAa,CAAE,IAAI,kBAAkB,CAAC,CAEtC,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,AACpB,CAAC"}'
};
var Chip = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { icon } = $$props;
  let { redirect = void 0 } = $$props;
  if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0)
    $$bindings.icon(icon);
  if ($$props.redirect === void 0 && $$bindings.redirect && redirect !== void 0)
    $$bindings.redirect(redirect);
  $$result.css.add(css$8);
  return `<a class="${"chip svelte-14co5tg"}"${add_attribute("href", redirect, 0)}><span class="${"material-icons svelte-14co5tg"}">${escape2(icon)}</span>
	<span class="${"slot"}">${slots.default ? slots.default({}) : ``}</span>
</a>`;
});
var css$7 = {
  code: ".box.svelte-1hmhp9q{background-color:var(--header);color:var(--overlay);box-shadow:var(--shadow), 0 0 10px var(--space) var(--background);border-radius:var(--border-radius);padding:var(--space);margin-bottom:var(--space);z-index:1}.searchbar-layout.svelte-1hmhp9q{width:100%;display:grid;gap:var(--space-sm)}.header-layout.svelte-1hmhp9q{display:flex;flex-direction:row}.back-button.svelte-1hmhp9q{color:var(--overlay);padding-top:6px}.route-layout.svelte-1hmhp9q{display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-top:var(--space-sm);margin-bottom:-5px}.time.svelte-1hmhp9q{font-size:1.2em}.number.svelte-1hmhp9q{font-weight:bolder}.extra.svelte-1hmhp9q{font-size:1em}",
  map: `{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script lang=\\"ts\\">import EmphasisedBox from '$lib/EmphasisedBox.svelte';\\nimport Searchbar from '$lib/Searchbar.svelte';\\nimport RouteTimeline from '$lib/RouteTimeline.svelte';\\nimport Chip from '$lib/Chip.svelte';\\nimport { page } from '$app/stores';\\nimport { fade, slide } from 'svelte/transition';\\nimport { selectedRoute, destinationQuery, originQuery } from './_stores';\\nfunction hours(seconds) {\\n    return Math.floor(seconds / 3600);\\n}\\nfunction minutes(seconds) {\\n    return Math.floor((seconds - hours(seconds) * 3600) / 60);\\n}\\n<\/script>\\n\\n{#if $page.path !== '/ringing-alarm'}\\n\\t<div class=\\"box\\">\\n\\t\\t<!-- \\"Go somewhere\\" homepage header -->\\n\\t\\t{#if $page.path === '/'}\\n\\t\\t\\t<span class=\\"header-layout\\" transition:slide>\\n\\t\\t\\t\\t<h1 transition:fade>Go somewhere</h1>\\n\\t\\t\\t</span>\\n\\t\\t{/if}\\n\\n\\t\\t<div class=\\"header-layout\\" transition:slide>\\n\\t\\t\\t<!-- Hide back button on homepage -->\\n\\t\\t\\t{#if $page.path !== '/'}\\n\\t\\t\\t\\t<!-- Back button -->\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\thref={$page.path !== '/route-details' ? '/' : '/suggested-routes'}\\n\\t\\t\\t\\t\\tclass=\\"material-icons back-button\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\tarrow_back_ios\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t{:else}\\n\\t\\t\\t\\t<Chip icon=\\"home\\" redirect=\\"/ringing-alarm\\">Home</Chip>\\n\\t\\t\\t\\t<Chip icon=\\"work\\">Work</Chip>\\n\\t\\t\\t{/if}\\n\\n\\t\\t\\t<!-- Don't show searchbars on route details page -->\\n\\t\\t\\t{#if $page.path !== '/route-details'}\\n\\t\\t\\t\\t<div class=\\"searchbar-layout\\">\\n\\t\\t\\t\\t\\t<!-- Origin searchbar -->\\n\\t\\t\\t\\t\\t{#if $page.path === '/suggested-routes' || $page.params.endpoint == 'origin'}\\n\\t\\t\\t\\t\\t\\t<Searchbar\\n\\t\\t\\t\\t\\t\\t\\tplaceholder=\\"Enter your origin\\"\\n\\t\\t\\t\\t\\t\\t\\tbind:text={$originQuery.name}\\n\\t\\t\\t\\t\\t\\t\\tname=\\"origin\\"\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t{/if}\\n\\n\\t\\t\\t\\t\\t<!-- Destination searchbar -->\\n\\t\\t\\t\\t\\t{#if $page.params.endpoint !== 'origin'}\\n\\t\\t\\t\\t\\t\\t<Searchbar\\n\\t\\t\\t\\t\\t\\t\\tplaceholder={$page.path === '/' ? 'Search location' : 'Enter your destination'}\\n\\t\\t\\t\\t\\t\\t\\tbind:text={$destinationQuery.name}\\n\\t\\t\\t\\t\\t\\t\\tname=\\"destination\\"\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{:else}\\n\\t\\t\\t\\t<div class=\\"searchbar-layout\\">\\n\\t\\t\\t\\t\\t<RouteTimeline route={$selectedRoute} />\\n\\t\\t\\t\\t\\t<div class=\\"route-layout\\">\\n\\t\\t\\t\\t\\t\\t<span class=\\"extra\\">\\n\\t\\t\\t\\t\\t\\t\\tLeave now, arrive at\\n\\t\\t\\t\\t\\t\\t\\t<span class=\\"number\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t{new Date($selectedRoute.arriveTime).toLocaleString('en', {\\n\\t\\t\\t\\t\\t\\t\\t\\t\\thour: 'numeric',\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tminute: 'numeric'\\n\\t\\t\\t\\t\\t\\t\\t\\t})}.\\n\\t\\t\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t\\t\\t<span class=\\"time\\">\\n\\t\\t\\t\\t\\t\\t\\t{#if hours($selectedRoute.duration)}\\n\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"number\\">{hours($selectedRoute.duration)}</span>\\n\\t\\t\\t\\t\\t\\t\\t\\thr\\n\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t<span class=\\"number\\">{minutes($selectedRoute.duration)}</span>\\n\\t\\t\\t\\t\\t\\t\\tmin\\n\\t\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/if}\\n\\t\\t</div>\\n\\t</div>\\n{/if}\\n\\n<slot />\\n\\n<style>\\n\\t.box {\\n\\t\\t/* position: -webkit-sticky; */\\n\\t\\t/* position: fixed; */\\n\\t\\t/* top: var(--space); */\\n\\t\\tbackground-color: var(--header);\\n\\t\\tcolor: var(--overlay);\\n\\t\\tbox-shadow: var(--shadow), 0 0 10px var(--space) var(--background);\\n\\t\\tborder-radius: var(--border-radius);\\n\\t\\tpadding: var(--space);\\n\\t\\tmargin-bottom: var(--space);\\n\\t\\tz-index: 1;\\n\\t\\t/* width: calc(100% - var(--space) * 2); */\\n\\t}\\n\\n\\t.searchbar-layout {\\n\\t\\twidth: 100%;\\n\\t\\tdisplay: grid;\\n\\t\\tgap: var(--space-sm);\\n\\t}\\n\\n\\t.header-layout {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: row;\\n\\t}\\n\\n\\t.back-button {\\n\\t\\tcolor: var(--overlay);\\n\\t\\tpadding-top: 6px;\\n\\t}\\n\\n\\t.route-layout {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: row;\\n\\t\\tjustify-content: space-between;\\n\\t\\talign-items: center;\\n\\t\\tmargin-top: var(--space-sm);\\n\\t\\tmargin-bottom: -5px;\\n\\t}\\n\\n\\t.time {\\n\\t\\tfont-size: 1.2em;\\n\\t}\\n\\n\\t.number {\\n\\t\\tfont-weight: bolder;\\n\\t}\\n\\n\\t.extra {\\n\\t\\tfont-size: 1em;\\n\\t\\t/* margin: 3px 0 var(--space) 0; */\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA2FC,IAAI,eAAC,CAAC,AAIL,gBAAgB,CAAE,IAAI,QAAQ,CAAC,CAC/B,KAAK,CAAE,IAAI,SAAS,CAAC,CACrB,UAAU,CAAE,IAAI,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,IAAI,OAAO,CAAC,CAAC,IAAI,YAAY,CAAC,CAClE,aAAa,CAAE,IAAI,eAAe,CAAC,CACnC,OAAO,CAAE,IAAI,OAAO,CAAC,CACrB,aAAa,CAAE,IAAI,OAAO,CAAC,CAC3B,OAAO,CAAE,CAAC,AAEX,CAAC,AAED,iBAAiB,eAAC,CAAC,AAClB,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,IAAI,UAAU,CAAC,AACrB,CAAC,AAED,cAAc,eAAC,CAAC,AACf,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,AACpB,CAAC,AAED,YAAY,eAAC,CAAC,AACb,KAAK,CAAE,IAAI,SAAS,CAAC,CACrB,WAAW,CAAE,GAAG,AACjB,CAAC,AAED,aAAa,eAAC,CAAC,AACd,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,IAAI,UAAU,CAAC,CAC3B,aAAa,CAAE,IAAI,AACpB,CAAC,AAED,KAAK,eAAC,CAAC,AACN,SAAS,CAAE,KAAK,AACjB,CAAC,AAED,OAAO,eAAC,CAAC,AACR,WAAW,CAAE,MAAM,AACpB,CAAC,AAED,MAAM,eAAC,CAAC,AACP,SAAS,CAAE,GAAG,AAEf,CAAC"}`
};
function hours$1(seconds) {
  return Math.floor(seconds / 3600);
}
function minutes$1(seconds) {
  return Math.floor((seconds - hours$1(seconds) * 3600) / 60);
}
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $originQuery, $$unsubscribe_originQuery;
  let $destinationQuery, $$unsubscribe_destinationQuery;
  let $selectedRoute, $$unsubscribe_selectedRoute;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_originQuery = subscribe(originQuery, (value) => $originQuery = value);
  $$unsubscribe_destinationQuery = subscribe(destinationQuery, (value) => $destinationQuery = value);
  $$unsubscribe_selectedRoute = subscribe(selectedRoute, (value) => $selectedRoute = value);
  $$result.css.add(css$7);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${$page.path !== "/ringing-alarm" ? `<div class="${"box svelte-1hmhp9q"}">
		${$page.path === "/" ? `<span class="${"header-layout svelte-1hmhp9q"}"><h1>Go somewhere</h1></span>` : ``}

		<div class="${"header-layout svelte-1hmhp9q"}">
			${$page.path !== "/" ? `
				<a${add_attribute("href", $page.path !== "/route-details" ? "/" : "/suggested-routes", 0)} class="${"material-icons back-button svelte-1hmhp9q"}">arrow_back_ios
				</a>` : `${validate_component(Chip, "Chip").$$render($$result, { icon: "home", redirect: "/ringing-alarm" }, {}, { default: () => `Home` })}
				${validate_component(Chip, "Chip").$$render($$result, { icon: "work" }, {}, { default: () => `Work` })}`}

			
			${$page.path !== "/route-details" ? `<div class="${"searchbar-layout svelte-1hmhp9q"}">
					${$page.path === "/suggested-routes" || $page.params.endpoint == "origin" ? `${validate_component(Searchbar, "Searchbar").$$render($$result, {
      placeholder: "Enter your origin",
      name: "origin",
      text: $originQuery.name
    }, {
      text: ($$value) => {
        $originQuery.name = $$value;
        $$settled = false;
      }
    }, {})}` : ``}

					
					${$page.params.endpoint !== "origin" ? `${validate_component(Searchbar, "Searchbar").$$render($$result, {
      placeholder: $page.path === "/" ? "Search location" : "Enter your destination",
      name: "destination",
      text: $destinationQuery.name
    }, {
      text: ($$value) => {
        $destinationQuery.name = $$value;
        $$settled = false;
      }
    }, {})}` : ``}</div>` : `<div class="${"searchbar-layout svelte-1hmhp9q"}">${validate_component(RouteTimeline, "RouteTimeline").$$render($$result, { route: $selectedRoute }, {}, {})}
					<div class="${"route-layout svelte-1hmhp9q"}"><span class="${"extra svelte-1hmhp9q"}">Leave now, arrive at
							<span class="${"number svelte-1hmhp9q"}">${escape2(new Date($selectedRoute.arriveTime).toLocaleString("en", { hour: "numeric", minute: "numeric" }))}.
							</span></span>
						<span class="${"time svelte-1hmhp9q"}">${hours$1($selectedRoute.duration) ? `<span class="${"number svelte-1hmhp9q"}">${escape2(hours$1($selectedRoute.duration))}</span>
								hr` : ``}
							<span class="${"number svelte-1hmhp9q"}">${escape2(minutes$1($selectedRoute.duration))}</span>
							min
						</span></div></div>`}</div></div>` : ``}

${slots.default ? slots.default({}) : ``}`;
  } while (!$$settled);
  $$unsubscribe_page();
  $$unsubscribe_originQuery();
  $$unsubscribe_destinationQuery();
  $$unsubscribe_selectedRoute();
  return $$rendered;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({ error: error22, status }) {
  return { props: { error: error22, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error22 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error22 !== void 0)
    $$bindings.error(error22);
  return `<h1>${escape2(status)}</h1>

<pre>${escape2(error22.message)}</pre>



${error22.frame ? `<pre>${escape2(error22.frame)}</pre>` : ``}
${error22.stack ? `<pre>${escape2(error22.stack)}</pre>` : ``}`;
});
var error2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load
});
var css$6 = {
  code: ".box.svelte-kuhn8f{background-color:var(--overlay);color:var(--text);box-shadow:var(--shadow);border-radius:var(--border-radius);padding:var(--space);margin-bottom:var(--space)}",
  map: '{"version":3,"file":"Box.svelte","sources":["Box.svelte"],"sourcesContent":["<script>\\n\\texport let title = undefined;\\n<\/script>\\n\\n<div class=\\"box\\">\\n\\t{#if title}\\n\\t\\t<h1>{title}</h1>\\n\\t{/if}\\n\\t<slot />\\n</div>\\n\\n<style>\\n\\t.box {\\n\\t\\tbackground-color: var(--overlay);\\n\\t\\tcolor: var(--text);\\n\\t\\tbox-shadow: var(--shadow);\\n\\t\\tborder-radius: var(--border-radius);\\n\\t\\tpadding: var(--space);\\n\\t\\tmargin-bottom: var(--space);\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAYC,IAAI,cAAC,CAAC,AACL,gBAAgB,CAAE,IAAI,SAAS,CAAC,CAChC,KAAK,CAAE,IAAI,MAAM,CAAC,CAClB,UAAU,CAAE,IAAI,QAAQ,CAAC,CACzB,aAAa,CAAE,IAAI,eAAe,CAAC,CACnC,OAAO,CAAE,IAAI,OAAO,CAAC,CACrB,aAAa,CAAE,IAAI,OAAO,CAAC,AAC5B,CAAC"}'
};
var Box = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = void 0 } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$6);
  return `<div class="${"box svelte-kuhn8f"}">${title ? `<h1>${escape2(title)}</h1>` : ``}
	${slots.default ? slots.default({}) : ``}
</div>`;
});
var css$5 = {
  code: ".info.svelte-1jgri6a{display:grid;grid-template-columns:min-content min-content;grid-template-rows:auto;grid-template-areas:'number icons' 'time-unit icons';justify-items:center;gap:0 var(--space-sm)}.number.svelte-1jgri6a{grid-area:number;font-weight:bolder;font-size:1.2em;margin-bottom:-4px}.time-unit.svelte-1jgri6a{grid-area:time-unit;font-size:0.9em}.icons.svelte-1jgri6a{display:flex;flex-direction:column;justify-content:center;grid-area:icons;vertical-align:center}",
  map: `{"version":3,"file":"ArrivalMarker.svelte","sources":["ArrivalMarker.svelte"],"sourcesContent":["<script lang=\\"ts\\">;\\nexport let arrival;\\n<\/script>\\n\\n<span class=\\"info\\">\\n\\t<span class=\\"number\\">\\n\\t\\t{arrival.minutesToArrival}\\n\\t</span>\\n\\t<span class=\\"time-unit\\">min</span>\\n\\t<span class=\\"icons\\">\\n\\t\\t<span>{arrival.occupancy}</span>\\n\\t\\t<span>{arrival.type}</span>\\n\\t</span>\\n</span>\\n\\n<style>\\n\\t.info {\\n\\t\\t/* background-color: aqua; */\\n\\t\\tdisplay: grid;\\n\\t\\tgrid-template-columns: min-content min-content;\\n\\t\\tgrid-template-rows: auto;\\n\\t\\tgrid-template-areas: 'number icons' 'time-unit icons';\\n\\t\\tjustify-items: center;\\n\\n\\t\\tgap: 0 var(--space-sm);\\n\\t}\\n\\n\\t.number {\\n\\t\\tgrid-area: number;\\n\\t\\tfont-weight: bolder;\\n\\t\\tfont-size: 1.2em;\\n\\t\\tmargin-bottom: -4px;\\n\\t}\\n\\n\\t.time-unit {\\n\\t\\tgrid-area: time-unit;\\n\\t\\tfont-size: 0.9em;\\n\\t\\t/* font-weight: lighter; */\\n\\t}\\n\\n\\t/* .marker {\\n\\t\\twidth: 10px;\\n\\t\\theight: 10px;\\n\\t\\tbackground-color: var(--overlay);\\n\\t\\tborder-radius: 100%;\\n\\t\\tborder-style: solid;\\n\\t\\tborder-width: 3px;\\n\\t\\tborder-color: var(--background);\\n\\t\\tgrid-area: marker;\\n\\t} */\\n\\n\\t.icons {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t\\tjustify-content: center;\\n\\t\\tgrid-area: icons;\\n\\t\\tvertical-align: center;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAgBC,KAAK,eAAC,CAAC,AAEN,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,WAAW,CAAC,WAAW,CAC9C,kBAAkB,CAAE,IAAI,CACxB,mBAAmB,CAAE,cAAc,CAAC,iBAAiB,CACrD,aAAa,CAAE,MAAM,CAErB,GAAG,CAAE,CAAC,CAAC,IAAI,UAAU,CAAC,AACvB,CAAC,AAED,OAAO,eAAC,CAAC,AACR,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,KAAK,CAChB,aAAa,CAAE,IAAI,AACpB,CAAC,AAED,UAAU,eAAC,CAAC,AACX,SAAS,CAAE,SAAS,CACpB,SAAS,CAAE,KAAK,AAEjB,CAAC,AAaD,MAAM,eAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,MAAM,CACvB,SAAS,CAAE,KAAK,CAChB,cAAc,CAAE,MAAM,AACvB,CAAC"}`
};
var ArrivalMarker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { arrival } = $$props;
  if ($$props.arrival === void 0 && $$bindings.arrival && arrival !== void 0)
    $$bindings.arrival(arrival);
  $$result.css.add(css$5);
  return `<span class="${"info svelte-1jgri6a"}"><span class="${"number svelte-1jgri6a"}">${escape2(arrival.minutesToArrival)}</span>
	<span class="${"time-unit svelte-1jgri6a"}">min</span>
	<span class="${"icons svelte-1jgri6a"}"><span>${escape2(arrival.occupancy)}</span>
		<span>${escape2(arrival.type)}</span></span>
</span>`;
});
var css$4 = {
  code: ".bus-number.svelte-19zboyn{padding:3px 9px;margin:0;border-radius:var(--border-radius-sm);background-color:var(--header);color:var(--overlay);text-align:center;place-self:center stretch;grid-column-start:front}.separator.svelte-19zboyn{margin:0 28px;font-size:1.5em;transform:scale(-1, 1);color:var(--icon-text)}.error-message.svelte-19zboyn{grid-column:3 / 6}.spacing.svelte-19zboyn{grid-column-end:spacing}.bus-stop.svelte-19zboyn{display:grid;grid-template-columns:[front] min-content auto [spacing] repeat(3, min-content);row-gap:var(--space);justify-items:center;align-items:center}",
  map: `{"version":3,"file":"BusArrivals.svelte","sources":["BusArrivals.svelte"],"sourcesContent":["<script lang=\\"ts\\">;\\nimport ArrivalMarker from './ArrivalMarker.svelte';\\nexport let arrivals;\\n<\/script>\\n\\n<h3>{arrivals.busStopCode}</h3>\\n<div class=\\"bus-stop\\">\\n\\t{#each arrivals.services as service}\\n\\t\\t<!-- Bus number -->\\n\\t\\t<h3 class=\\"bus-number\\">{service.number}</h3>\\n\\t\\t<!-- Space between bus number and arrival timings -->\\n\\t\\t<span class=\\"spacing\\" />\\n\\n\\t\\t<!-- Arrival timings -->\\n\\t\\t{#if service.arrivals[0]}\\n\\t\\t\\t<ArrivalMarker arrival={service.arrivals[0]} />\\n\\t\\t\\t<span class=\\"separator\\">&#10148;</span>\\n\\t\\t\\t{#if service.arrivals[1]}\\n\\t\\t\\t\\t<ArrivalMarker arrival={service.arrivals[1]} />\\n\\t\\t\\t{:else}\\n\\t\\t\\t\\tNA\\n\\t\\t\\t{/if}\\n\\t\\t{:else}\\n\\t\\t\\t<span class=\\"error-message\\">No arrivals available</span>\\n\\t\\t{/if}\\n\\t\\t<!-- {#each service.arrivals as arrival}\\n\\t\\t\\t<ArrivalMarker {arrival} />\\n\\n\\t\\t\\t{#if arrival !== service.arrivals[service.arrivals.length - 1]}\\n\\t\\t\\t\\t<span class=\\"separator\\">&lt;</span>\\n\\t\\t\\t{/if}\\n\\t\\t{/each} -->\\n\\t{/each}\\n</div>\\n\\n<style>\\n\\t.bus-number {\\n\\t\\tpadding: 3px 9px;\\n\\t\\tmargin: 0;\\n\\t\\tborder-radius: var(--border-radius-sm);\\n\\t\\tbackground-color: var(--header);\\n\\t\\tcolor: var(--overlay);\\n\\t\\ttext-align: center;\\n\\t\\tplace-self: center stretch;\\n\\t\\tgrid-column-start: front;\\n\\t}\\n\\n\\t.separator {\\n\\t\\tmargin: 0 28px;\\n\\t\\tfont-size: 1.5em;\\n\\t\\ttransform: scale(-1, 1);\\n\\t\\tcolor: var(--icon-text);\\n\\t}\\n\\n\\t.error-message {\\n\\t\\tgrid-column: 3 / 6;\\n\\t}\\n\\n\\t.spacing {\\n\\t\\tgrid-column-end: spacing;\\n\\t}\\n\\n\\t.bus-stop {\\n\\t\\tdisplay: grid;\\n\\t\\tgrid-template-columns: [front] min-content auto [spacing] repeat(3, min-content);\\n\\t\\trow-gap: var(--space);\\n\\t\\tjustify-items: center;\\n\\t\\talign-items: center;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAoCC,WAAW,eAAC,CAAC,AACZ,OAAO,CAAE,GAAG,CAAC,GAAG,CAChB,MAAM,CAAE,CAAC,CACT,aAAa,CAAE,IAAI,kBAAkB,CAAC,CACtC,gBAAgB,CAAE,IAAI,QAAQ,CAAC,CAC/B,KAAK,CAAE,IAAI,SAAS,CAAC,CACrB,UAAU,CAAE,MAAM,CAClB,UAAU,CAAE,MAAM,CAAC,OAAO,CAC1B,iBAAiB,CAAE,KAAK,AACzB,CAAC,AAED,UAAU,eAAC,CAAC,AACX,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,SAAS,CAAE,KAAK,CAChB,SAAS,CAAE,MAAM,EAAE,CAAC,CAAC,CAAC,CAAC,CACvB,KAAK,CAAE,IAAI,WAAW,CAAC,AACxB,CAAC,AAED,cAAc,eAAC,CAAC,AACf,WAAW,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,AACnB,CAAC,AAED,QAAQ,eAAC,CAAC,AACT,eAAe,CAAE,OAAO,AACzB,CAAC,AAED,SAAS,eAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,CAAC,KAAK,CAAC,CAAC,WAAW,CAAC,IAAI,CAAC,CAAC,OAAO,CAAC,CAAC,OAAO,CAAC,CAAC,CAAC,WAAW,CAAC,CAChF,OAAO,CAAE,IAAI,OAAO,CAAC,CACrB,aAAa,CAAE,MAAM,CACrB,WAAW,CAAE,MAAM,AACpB,CAAC"}`
};
var BusArrivals = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { arrivals } = $$props;
  if ($$props.arrivals === void 0 && $$bindings.arrivals && arrivals !== void 0)
    $$bindings.arrivals(arrivals);
  $$result.css.add(css$4);
  return `<h3>${escape2(arrivals.busStopCode)}</h3>
<div class="${"bus-stop svelte-19zboyn"}">${each(arrivals.services, (service) => `
		<h3 class="${"bus-number svelte-19zboyn"}">${escape2(service.number)}</h3>
		
		<span class="${"spacing svelte-19zboyn"}"></span>

		
		${service.arrivals[0] ? `${validate_component(ArrivalMarker, "ArrivalMarker").$$render($$result, { arrival: service.arrivals[0] }, {}, {})}
			<span class="${"separator svelte-19zboyn"}">\u27A4</span>
			${service.arrivals[1] ? `${validate_component(ArrivalMarker, "ArrivalMarker").$$render($$result, { arrival: service.arrivals[1] }, {}, {})}` : `NA`}` : `<span class="${"error-message svelte-19zboyn"}">No arrivals available</span>`}
		`)}
</div>`;
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentPlace, $$unsubscribe_currentPlace;
  let $originQuery, $$unsubscribe_originQuery;
  let $destinationQuery, $$unsubscribe_destinationQuery;
  $$unsubscribe_currentPlace = subscribe(currentPlace, (value) => $currentPlace = value);
  $$unsubscribe_originQuery = subscribe(originQuery, (value) => $originQuery = value);
  $$unsubscribe_destinationQuery = subscribe(destinationQuery, (value) => $destinationQuery = value);
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  function getBusArrivals() {
    return __awaiter(this, void 0, void 0, function* () {
      const res = yield fetch("/api/bus-arrivals");
      const data = yield res.json();
      return data;
    });
  }
  set_store_value(destinationQuery, $destinationQuery = {
    name: "",
    address: "",
    longitude: null,
    latitude: null
  }, $destinationQuery);
  let searchText;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    set_store_value(originQuery, $originQuery = $currentPlace, $originQuery);
    $$rendered = `${validate_component(Box, "Box").$$render($$result, {}, {}, {
      default: () => `<h1>Bus arrivals</h1>
	${validate_component(Searchbar, "Searchbar").$$render($$result, {
        placeholder: "Search for a bus number or stop",
        text: searchText
      }, {
        text: ($$value) => {
          searchText = $$value;
          $$settled = false;
        }
      }, {})}
	${!searchText ? `${function(__value) {
        if (is_promise(__value))
          return `
			<p>loading...</p>
		`;
        return function(response) {
          return `
			
			${validate_component(BusArrivals, "BusArrivals").$$render($$result, { arrivals: response.data }, {}, {})}
		`;
        }(__value);
      }(getBusArrivals())}` : `text`}`
    })}`;
  } while (!$$settled);
  $$unsubscribe_currentPlace();
  $$unsubscribe_originQuery();
  $$unsubscribe_destinationQuery();
  return $$rendered;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var css$3 = {
  code: ".extra.svelte-f040hi{font-size:0.8em;grid-column:1 / 3;margin:3px 0 var(--space) 0}.timelines.svelte-f040hi{display:grid;column-gap:var(--space);grid-template-columns:1fr auto;justify-content:space-between;align-items:center}.time.svelte-f040hi{font-size:1.1em;text-align:right}.number.svelte-f040hi{font-weight:bolder}",
  map: '{"version":3,"file":"suggested-routes.svelte","sources":["suggested-routes.svelte"],"sourcesContent":["<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport Box from \'$lib/Box.svelte\';\\nimport RouteTimeline from \'$lib/RouteTimeline.svelte\';\\n;\\n;\\nimport { destinationQuery, originQuery, routes } from \'./_stores\';\\nfunction hours(seconds) {\\n    return Math.floor(seconds / 3600);\\n}\\nfunction minutes(seconds) {\\n    return Math.floor((seconds - hours(seconds) * 3600) / 60);\\n}\\nfunction getDirections({ latitude: fromLat, longitude: fromLon }, { latitude: toLat, longitude: toLon }) {\\n    return __awaiter(this, void 0, void 0, function* () {\\n        const fromQuery = `${fromLat},${fromLon}`;\\n        const toQuery = `${toLat},${toLon}`;\\n        const res = yield fetch(`/api/directions?from=${fromQuery}&to=${toQuery}`);\\n        const data = yield res.json();\\n        return data;\\n    });\\n}\\nlet directions = $routes;\\nif (!directions.length && $originQuery.name && $destinationQuery.name) {\\n    directions = getDirections($originQuery, $destinationQuery).then((newDirections) => ($routes = newDirections));\\n}\\n<\/script>\\n\\n<Box>\\n\\t{#if $originQuery.name && $destinationQuery.name}\\n\\t\\t{#await directions}\\n\\t\\t\\tloading...\\n\\t\\t{:then response}\\n\\t\\t\\t<div class=\\"timelines\\">\\n\\t\\t\\t\\t{#each response as route}\\n\\t\\t\\t\\t\\t<RouteTimeline\\n\\t\\t\\t\\t\\t\\t{route}\\n\\t\\t\\t\\t\\t\\tlongestRoute={response.reduce((a, b) => (a > (b = b.distance) ? a : b), 0)}\\n\\t\\t\\t\\t\\t/>\\n\\n\\t\\t\\t\\t\\t<!-- How long the route takes -->\\n\\t\\t\\t\\t\\t<span class=\\"time\\">\\n\\t\\t\\t\\t\\t\\t{#if hours(route.duration)}\\n\\t\\t\\t\\t\\t\\t\\t<span class=\\"number\\">{hours(route.duration)}</span>\\n\\t\\t\\t\\t\\t\\t\\thr\\n\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t<span class=\\"number\\">{minutes(route.duration)}</span>\\n\\t\\t\\t\\t\\t\\tmin\\n\\t\\t\\t\\t\\t</span>\\n\\n\\t\\t\\t\\t\\t<!-- Extra information like walking and arrival time -->\\n\\t\\t\\t\\t\\t<span class=\\"extra\\">\\n\\t\\t\\t\\t\\t\\tLeave now, arrive at\\n\\t\\t\\t\\t\\t\\t<span class=\\"number\\"\\n\\t\\t\\t\\t\\t\\t\\t>{new Date(route.arriveTime).toLocaleString(\'en\', {\\n\\t\\t\\t\\t\\t\\t\\t\\thour: \'numeric\',\\n\\t\\t\\t\\t\\t\\t\\t\\tminute: \'numeric\'\\n\\t\\t\\t\\t\\t\\t\\t})}</span\\n\\t\\t\\t\\t\\t\\t>.\\n\\t\\t\\t\\t\\t\\t<span class=\\"number\\">{Math.round(route.walkTime / 60)}</span> min walking time.\\n\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t{/each}\\n\\t\\t\\t</div>\\n\\t\\t{:catch error}\\n\\t\\t\\tError: {error.message}\\n\\t\\t{/await}\\n\\t{:else}\\n\\t\\tenter location to search\\n\\t{/if}\\n</Box>\\n\\n<style>\\n\\t.extra {\\n\\t\\tfont-size: 0.8em;\\n\\t\\tgrid-column: 1 / 3;\\n\\t\\tmargin: 3px 0 var(--space) 0;\\n\\t}\\n\\n\\t.timelines {\\n\\t\\tdisplay: grid;\\n\\t\\tcolumn-gap: var(--space);\\n\\t\\tgrid-template-columns: 1fr auto;\\n\\t\\tjustify-content: space-between;\\n\\t\\talign-items: center;\\n\\t}\\n\\n\\t.time {\\n\\t\\tfont-size: 1.1em;\\n\\t\\ttext-align: right;\\n\\t}\\n\\n\\t.number {\\n\\t\\tfont-weight: bolder;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA+EC,MAAM,cAAC,CAAC,AACP,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAClB,MAAM,CAAE,GAAG,CAAC,CAAC,CAAC,IAAI,OAAO,CAAC,CAAC,CAAC,AAC7B,CAAC,AAED,UAAU,cAAC,CAAC,AACX,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,OAAO,CAAC,CACxB,qBAAqB,CAAE,GAAG,CAAC,IAAI,CAC/B,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,AACpB,CAAC,AAED,KAAK,cAAC,CAAC,AACN,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,KAAK,AAClB,CAAC,AAED,OAAO,cAAC,CAAC,AACR,WAAW,CAAE,MAAM,AACpB,CAAC"}'
};
function hours(seconds) {
  return Math.floor(seconds / 3600);
}
function minutes(seconds) {
  return Math.floor((seconds - hours(seconds) * 3600) / 60);
}
var Suggested_routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $routes, $$unsubscribe_routes;
  let $destinationQuery, $$unsubscribe_destinationQuery;
  let $originQuery, $$unsubscribe_originQuery;
  $$unsubscribe_routes = subscribe(routes, (value) => $routes = value);
  $$unsubscribe_destinationQuery = subscribe(destinationQuery, (value) => $destinationQuery = value);
  $$unsubscribe_originQuery = subscribe(originQuery, (value) => $originQuery = value);
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  function getDirections({ latitude: fromLat, longitude: fromLon }, { latitude: toLat, longitude: toLon }) {
    return __awaiter(this, void 0, void 0, function* () {
      const fromQuery = `${fromLat},${fromLon}`;
      const toQuery = `${toLat},${toLon}`;
      const res = yield fetch(`/api/directions?from=${fromQuery}&to=${toQuery}`);
      const data = yield res.json();
      return data;
    });
  }
  let directions2 = $routes;
  if (!directions2.length && $originQuery.name && $destinationQuery.name) {
    directions2 = getDirections($originQuery, $destinationQuery).then((newDirections) => set_store_value(routes, $routes = newDirections, $routes));
  }
  $$result.css.add(css$3);
  $$unsubscribe_routes();
  $$unsubscribe_destinationQuery();
  $$unsubscribe_originQuery();
  return `${validate_component(Box, "Box").$$render($$result, {}, {}, {
    default: () => `${$originQuery.name && $destinationQuery.name ? `${function(__value) {
      if (is_promise(__value))
        return `
			loading...
		`;
      return function(response) {
        return `
			<div class="${"timelines svelte-f040hi"}">${each(response, (route) => `${validate_component(RouteTimeline, "RouteTimeline").$$render($$result, {
          route,
          longestRoute: response.reduce((a, b) => a > (b = b.distance) ? a : b, 0)
        }, {}, {})}

					
					<span class="${"time svelte-f040hi"}">${hours(route.duration) ? `<span class="${"number svelte-f040hi"}">${escape2(hours(route.duration))}</span>
							hr` : ``}
						<span class="${"number svelte-f040hi"}">${escape2(minutes(route.duration))}</span>
						min
					</span>

					
					<span class="${"extra svelte-f040hi"}">Leave now, arrive at
						<span class="${"number svelte-f040hi"}">${escape2(new Date(route.arriveTime).toLocaleString("en", { hour: "numeric", minute: "numeric" }))}</span>.
						<span class="${"number svelte-f040hi"}">${escape2(Math.round(route.walkTime / 60))}</span> min walking time.
					</span>`)}</div>
		`;
      }(__value);
    }(directions2)}` : `enter location to search`}`
  })}`;
});
var suggestedRoutes = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Suggested_routes
});
var css$2 = {
  code: ".background.svelte-w2j59m{position:absolute;top:0;left:0;width:100%;height:100%;color:var(--overlay);background-color:var(--header)}h1.svelte-w2j59m{font-size:2.5em}.alarm-text.svelte-w2j59m{position:absolute;width:fit-content;text-align:center;top:35%;left:50%;transform:translate(-50%, -50%)}.place.svelte-w2j59m{font-weight:bold}.material-icons.svelte-w2j59m{position:absolute;top:70%;left:50%;transform:translate(-50%, -50%);padding:var(--space-sm);border-radius:100%;color:var(--overlay);background-color:var(--icon-text);font-size:4em}",
  map: '{"version":3,"file":"ringing-alarm.svelte","sources":["ringing-alarm.svelte"],"sourcesContent":["<div class=\\"background\\">\\n\\t<span class=\\"alarm-text\\">\\n\\t\\t<h1>This is your stop</h1>\\n\\t\\t<p>Proceed to <span class=\\"place\\">Ang Mo Kio MRT Station</span></p>\\n\\t</span>\\n\\n\\t<a href=\\"/\\" class=\\"material-icons\\"> clear </a>\\n</div>\\n\\n<style>\\n\\t.background {\\n\\t\\tposition: absolute;\\n\\t\\ttop: 0;\\n\\t\\tleft: 0;\\n\\t\\twidth: 100%;\\n\\t\\theight: 100%;\\n\\t\\tcolor: var(--overlay);\\n\\t\\tbackground-color: var(--header);\\n\\t}\\n\\th1 {\\n\\t\\tfont-size: 2.5em;\\n\\t}\\n\\t.alarm-text {\\n\\t\\tposition: absolute;\\n\\t\\twidth: fit-content;\\n\\t\\ttext-align: center;\\n\\t\\ttop: 35%;\\n\\t\\tleft: 50%;\\n\\t\\ttransform: translate(-50%, -50%);\\n\\t}\\n\\n\\t.place {\\n\\t\\tfont-weight: bold;\\n\\t}\\n\\n\\t.material-icons {\\n\\t\\tposition: absolute;\\n\\t\\ttop: 70%;\\n\\t\\tleft: 50%;\\n\\t\\ttransform: translate(-50%, -50%);\\n\\t\\tpadding: var(--space-sm);\\n\\t\\tborder-radius: 100%;\\n\\t\\tcolor: var(--overlay);\\n\\t\\tbackground-color: var(--icon-text);\\n\\t\\tfont-size: 4em;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAUC,WAAW,cAAC,CAAC,AACZ,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,SAAS,CAAC,CACrB,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AAChC,CAAC,AACD,EAAE,cAAC,CAAC,AACH,SAAS,CAAE,KAAK,AACjB,CAAC,AACD,WAAW,cAAC,CAAC,AACZ,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,WAAW,CAClB,UAAU,CAAE,MAAM,CAClB,GAAG,CAAE,GAAG,CACR,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,AACjC,CAAC,AAED,MAAM,cAAC,CAAC,AACP,WAAW,CAAE,IAAI,AAClB,CAAC,AAED,eAAe,cAAC,CAAC,AAChB,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAChC,OAAO,CAAE,IAAI,UAAU,CAAC,CACxB,aAAa,CAAE,IAAI,CACnB,KAAK,CAAE,IAAI,SAAS,CAAC,CACrB,gBAAgB,CAAE,IAAI,WAAW,CAAC,CAClC,SAAS,CAAE,GAAG,AACf,CAAC"}'
};
var Ringing_alarm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<div class="${"background svelte-w2j59m"}"><span class="${"alarm-text svelte-w2j59m"}"><h1 class="${"svelte-w2j59m"}">This is your stop</h1>
		<p>Proceed to <span class="${"place svelte-w2j59m"}">Ang Mo Kio MRT Station</span></p></span>

	<a href="${"/"}" class="${"material-icons svelte-w2j59m"}">clear </a>
</div>`;
});
var ringingAlarm = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Ringing_alarm
});
var css$1 = {
  code: ".alarm-container.svelte-8g00nf.svelte-8g00nf{display:flex;flex-direction:row;align-items:center;position:fixed;bottom:40px;right:30px;padding:6px 18px;border-radius:var(--border-radius);color:var(--overlay);background-color:var(--header);box-shadow:var(--shadow);font-size:1em}.material-icons-outlined.svelte-8g00nf.svelte-8g00nf{font-size:36px;margin-right:var(--space-md);margin-left:calc(-1 * var(--space-md))}.timeline.svelte-8g00nf.svelte-8g00nf{display:flex;flex-direction:column;padding:var(--space) 0}.segment.svelte-8g00nf.svelte-8g00nf{position:relative;width:var(--space);height:100px;border-radius:3px;background-color:var(--header)}.transport-mode.svelte-8g00nf.svelte-8g00nf{position:absolute;top:50%;transform:translateY(-50%);padding-left:30px;width:max-content}.mode-label.svelte-8g00nf.svelte-8g00nf{color:rgba(0, 0, 0, 0.4);padding:3px 6px;margin-right:3px;border-radius:6px;font-weight:bolder}.mode-label.bus.svelte-8g00nf.svelte-8g00nf{color:var(--overlay)}.place.svelte-8g00nf.svelte-8g00nf{position:relative;height:var(--space-sm);padding-left:30px}.place.svelte-8g00nf>.svelte-8g00nf{position:absolute;top:0;transform:translateY(-50%);font-size:1.1em;font-weight:bolder}.walk.svelte-8g00nf.svelte-8g00nf{background-color:rgb(226, 226, 226)}.bus.svelte-8g00nf.svelte-8g00nf{background-color:rgb(45, 175, 105)}.mrt.svelte-8g00nf.svelte-8g00nf{background-color:rgb(3, 89, 173)}.EW.svelte-8g00nf.svelte-8g00nf{background-color:var(--MRT-EW)}.NS.svelte-8g00nf.svelte-8g00nf{background-color:var(--MRT-NS)}.CC.svelte-8g00nf.svelte-8g00nf{background-color:var(--MRT-CC)}.DT.svelte-8g00nf.svelte-8g00nf{background-color:var(--MRT-DT)}",
  map: `{"version":3,"file":"route-details.svelte","sources":["route-details.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Box from '$lib/Box.svelte';\\nimport { selectedRoute } from './_stores';\\n<\/script>\\n\\n<Box>\\n\\t<div class=\\"timeline\\">\\n\\t\\t{#each $selectedRoute.segments as segment}\\n\\t\\t\\t<div class=\\"place\\">\\n\\t\\t\\t\\t<span>{segment.startLocation}</span>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"segment {segment.mode} {segment.modeIdentity}\\">\\n\\t\\t\\t\\t<span class=\\"transport-mode\\">\\n\\t\\t\\t\\t\\t{#if segment.mode === 'walk'}\\n\\t\\t\\t\\t\\t\\tWalk for {Math.round(segment.distance)} metres\\n\\t\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t\\t<span class=\\"mode-label {segment.mode} {segment.modeIdentity}\\"\\n\\t\\t\\t\\t\\t\\t\\t>{segment.modeIdentity}</span\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\tfor {segment.intermediateStops} stops\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t({Math.round(segment.duration / 60)} min)\\n\\t\\t\\t\\t</span>\\n\\t\\t\\t</div>\\n\\t\\t{/each}\\n\\t\\t<div class=\\"place\\">\\n\\t\\t\\t<span class=\\"place-name\\">Destination</span>\\n\\t\\t</div>\\n\\t</div>\\n</Box>\\n\\n<div class=\\"alarm-container\\">\\n\\t<span class=\\"material-icons-outlined\\"> notifications </span>\\n\\t<span>Wake me up <br /> on interchanges</span>\\n</div>\\n\\n<style>\\n\\t.alarm-container {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: row;\\n\\t\\talign-items: center;\\n\\t\\tposition: fixed;\\n\\t\\tbottom: 40px;\\n\\t\\tright: 30px;\\n\\t\\tpadding: 6px 18px;\\n\\t\\tborder-radius: var(--border-radius);\\n\\t\\tcolor: var(--overlay);\\n\\t\\tbackground-color: var(--header);\\n\\t\\tbox-shadow: var(--shadow);\\n\\t\\tfont-size: 1em;\\n\\t\\t/* font-weight: bold; */\\n\\t}\\n\\n\\t.material-icons-outlined {\\n\\t\\tfont-size: 36px;\\n\\t\\tmargin-right: var(--space-md);\\n\\t\\tmargin-left: calc(-1 * var(--space-md));\\n\\t}\\n\\n\\t.timeline {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t\\tpadding: var(--space) 0;\\n\\t}\\n\\n\\t.segment {\\n\\t\\tposition: relative;\\n\\t\\twidth: var(--space);\\n\\t\\theight: 100px;\\n\\t\\tborder-radius: 3px;\\n\\t\\tbackground-color: var(--header);\\n\\t}\\n\\n\\t.transport-mode {\\n\\t\\tposition: absolute;\\n\\t\\ttop: 50%;\\n\\t\\ttransform: translateY(-50%);\\n\\t\\tpadding-left: 30px;\\n\\t\\twidth: max-content;\\n\\t}\\n\\n\\t.mode-label {\\n\\t\\tcolor: rgba(0, 0, 0, 0.4);\\n\\t\\tpadding: 3px 6px;\\n\\t\\tmargin-right: 3px;\\n\\t\\tborder-radius: 6px;\\n\\t\\tfont-weight: bolder;\\n\\t}\\n\\n\\t.mode-label.bus {\\n\\t\\tcolor: var(--overlay);\\n\\t}\\n\\n\\t.place {\\n\\t\\tposition: relative;\\n\\t\\theight: var(--space-sm);\\n\\t\\tpadding-left: 30px;\\n\\t}\\n\\n\\t.place > * {\\n\\t\\tposition: absolute;\\n\\t\\ttop: 0;\\n\\t\\ttransform: translateY(-50%);\\n\\t\\tfont-size: 1.1em;\\n\\t\\tfont-weight: bolder;\\n\\t}\\n\\n\\t.walk {\\n\\t\\tbackground-color: rgb(226, 226, 226);\\n\\t}\\n\\n\\t.bus {\\n\\t\\tbackground-color: rgb(45, 175, 105);\\n\\t}\\n\\n\\t.mrt {\\n\\t\\t/* Fallback colour, in case something\\n\\t\\tgoes wrong with the line names */\\n\\t\\tbackground-color: rgb(3, 89, 173);\\n\\t}\\n\\n\\t.EW {\\n\\t\\tbackground-color: var(--MRT-EW);\\n\\t}\\n\\n\\t.NS {\\n\\t\\tbackground-color: var(--MRT-NS);\\n\\t}\\n\\n\\t.CC {\\n\\t\\tbackground-color: var(--MRT-CC);\\n\\t}\\n\\n\\t.DT {\\n\\t\\tbackground-color: var(--MRT-DT);\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAoCC,gBAAgB,4BAAC,CAAC,AACjB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,QAAQ,CAAE,KAAK,CACf,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,aAAa,CAAE,IAAI,eAAe,CAAC,CACnC,KAAK,CAAE,IAAI,SAAS,CAAC,CACrB,gBAAgB,CAAE,IAAI,QAAQ,CAAC,CAC/B,UAAU,CAAE,IAAI,QAAQ,CAAC,CACzB,SAAS,CAAE,GAAG,AAEf,CAAC,AAED,wBAAwB,4BAAC,CAAC,AACzB,SAAS,CAAE,IAAI,CACf,YAAY,CAAE,IAAI,UAAU,CAAC,CAC7B,WAAW,CAAE,KAAK,EAAE,CAAC,CAAC,CAAC,IAAI,UAAU,CAAC,CAAC,AACxC,CAAC,AAED,SAAS,4BAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,OAAO,CAAE,IAAI,OAAO,CAAC,CAAC,CAAC,AACxB,CAAC,AAED,QAAQ,4BAAC,CAAC,AACT,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,IAAI,OAAO,CAAC,CACnB,MAAM,CAAE,KAAK,CACb,aAAa,CAAE,GAAG,CAClB,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AAChC,CAAC,AAED,eAAe,4BAAC,CAAC,AAChB,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,SAAS,CAAE,WAAW,IAAI,CAAC,CAC3B,YAAY,CAAE,IAAI,CAClB,KAAK,CAAE,WAAW,AACnB,CAAC,AAED,WAAW,4BAAC,CAAC,AACZ,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACzB,OAAO,CAAE,GAAG,CAAC,GAAG,CAChB,YAAY,CAAE,GAAG,CACjB,aAAa,CAAE,GAAG,CAClB,WAAW,CAAE,MAAM,AACpB,CAAC,AAED,WAAW,IAAI,4BAAC,CAAC,AAChB,KAAK,CAAE,IAAI,SAAS,CAAC,AACtB,CAAC,AAED,MAAM,4BAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,IAAI,UAAU,CAAC,CACvB,YAAY,CAAE,IAAI,AACnB,CAAC,AAED,oBAAM,CAAG,cAAE,CAAC,AACX,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,SAAS,CAAE,WAAW,IAAI,CAAC,CAC3B,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,MAAM,AACpB,CAAC,AAED,KAAK,4BAAC,CAAC,AACN,gBAAgB,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AACrC,CAAC,AAED,IAAI,4BAAC,CAAC,AACL,gBAAgB,CAAE,IAAI,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AACpC,CAAC,AAED,IAAI,4BAAC,CAAC,AAGL,gBAAgB,CAAE,IAAI,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,AAClC,CAAC,AAED,GAAG,4BAAC,CAAC,AACJ,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AAChC,CAAC,AAED,GAAG,4BAAC,CAAC,AACJ,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AAChC,CAAC,AAED,GAAG,4BAAC,CAAC,AACJ,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AAChC,CAAC,AAED,GAAG,4BAAC,CAAC,AACJ,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AAChC,CAAC"}`
};
var Route_details = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selectedRoute, $$unsubscribe_selectedRoute;
  $$unsubscribe_selectedRoute = subscribe(selectedRoute, (value) => $selectedRoute = value);
  $$result.css.add(css$1);
  $$unsubscribe_selectedRoute();
  return `${validate_component(Box, "Box").$$render($$result, {}, {}, {
    default: () => `<div class="${"timeline svelte-8g00nf"}">${each($selectedRoute.segments, (segment) => `<div class="${"place svelte-8g00nf"}"><span class="${"svelte-8g00nf"}">${escape2(segment.startLocation)}</span></div>
			<div class="${"segment " + escape2(segment.mode) + " " + escape2(segment.modeIdentity) + " svelte-8g00nf"}"><span class="${"transport-mode svelte-8g00nf"}">${segment.mode === "walk" ? `Walk for ${escape2(Math.round(segment.distance))} metres` : `<span class="${"mode-label " + escape2(segment.mode) + " " + escape2(segment.modeIdentity) + " svelte-8g00nf"}">${escape2(segment.modeIdentity)}</span>
						for ${escape2(segment.intermediateStops)} stops`}
					(${escape2(Math.round(segment.duration / 60))} min)
				</span>
			</div>`)}
		<div class="${"place svelte-8g00nf"}"><span class="${"place-name svelte-8g00nf"}">Destination</span></div></div>`
  })}

<div class="${"alarm-container svelte-8g00nf"}"><span class="${"material-icons-outlined svelte-8g00nf"}">notifications </span>
	<span>Wake me up <br> on interchanges</span>
</div>`;
});
var routeDetails = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Route_details
});
var css = {
  code: "a.svelte-uk08vh{white-space:nowrap;overflow:hidden}",
  map: `{"version":3,"file":"select-[endpoint].svelte","sources":["select-[endpoint].svelte"],"sourcesContent":["<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport { page } from '$app/stores';\\nimport Box from '$lib/Box.svelte';\\nimport { currentPlace, destinationQuery, originQuery, routes } from './_stores';\\nfunction getPlaces(search) {\\n    return __awaiter(this, void 0, void 0, function* () {\\n        const res = yield fetch('/api/places?search=' + search);\\n        const data = yield res.json();\\n        return data;\\n    });\\n}\\nlet searchResults = [];\\n// Clear the routes store\\n$routes = [];\\n// Select the active query\\nconst locationQuery = $page.params.endpoint === 'destination' ? destinationQuery : originQuery;\\nconst oppositeQuery = $page.params.endpoint === 'destination' ? originQuery : destinationQuery;\\n$: getPlaces($locationQuery.name).then((result) => (searchResults = result));\\n$: if ($oppositeQuery.name !== 'Current location' &&\\n    !$locationQuery.name &&\\n    (!searchResults.length || searchResults[0].name !== 'Current location')) {\\n    searchResults = [$currentPlace, ...searchResults];\\n}\\n<\/script>\\n\\n<Box>\\n\\t{#each searchResults as location}\\n\\t\\t<a href=\\"/suggested-routes\\" on:click={() => ($locationQuery = location)}>\\n\\t\\t\\t{location.name}\\n\\t\\t</a>\\n\\t\\t<br />\\n\\t{:else}\\n\\t\\t{#if $locationQuery.name}\\n\\t\\t\\t\\"{$locationQuery.name}\\" not found\\n\\t\\t{:else}\\n\\t\\t\\ttype a location to search\\n\\t\\t{/if}\\n\\t{/each}\\n</Box>\\n\\n<style>\\n\\ta {\\n\\t\\twhite-space: nowrap;\\n\\t\\toverflow: hidden;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAiDC,CAAC,cAAC,CAAC,AACF,WAAW,CAAE,MAAM,CACnB,QAAQ,CAAE,MAAM,AACjB,CAAC"}`
};
var Select_u5Bendpointu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentPlace, $$unsubscribe_currentPlace;
  let $locationQuery, $$unsubscribe_locationQuery;
  let $oppositeQuery, $$unsubscribe_oppositeQuery;
  let $page, $$unsubscribe_page;
  let $routes, $$unsubscribe_routes;
  $$unsubscribe_currentPlace = subscribe(currentPlace, (value) => $currentPlace = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_routes = subscribe(routes, (value) => $routes = value);
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  function getPlaces(search) {
    return __awaiter(this, void 0, void 0, function* () {
      const res = yield fetch("/api/places?search=" + search);
      const data = yield res.json();
      return data;
    });
  }
  let searchResults = [];
  set_store_value(routes, $routes = [], $routes);
  const locationQuery = $page.params.endpoint === "destination" ? destinationQuery : originQuery;
  $$unsubscribe_locationQuery = subscribe(locationQuery, (value) => $locationQuery = value);
  const oppositeQuery = $page.params.endpoint === "destination" ? originQuery : destinationQuery;
  $$unsubscribe_oppositeQuery = subscribe(oppositeQuery, (value) => $oppositeQuery = value);
  $$result.css.add(css);
  {
    getPlaces($locationQuery.name).then((result) => searchResults = result);
  }
  {
    if ($oppositeQuery.name !== "Current location" && !$locationQuery.name && (!searchResults.length || searchResults[0].name !== "Current location")) {
      searchResults = [$currentPlace, ...searchResults];
    }
  }
  $$unsubscribe_currentPlace();
  $$unsubscribe_locationQuery();
  $$unsubscribe_oppositeQuery();
  $$unsubscribe_page();
  $$unsubscribe_routes();
  return `${validate_component(Box, "Box").$$render($$result, {}, {}, {
    default: () => `${searchResults.length ? each(searchResults, (location) => `<a href="${"/suggested-routes"}" class="${"svelte-uk08vh"}">${escape2(location.name)}</a>
		<br>`) : `${$locationQuery.name ? `&quot;${escape2($locationQuery.name)}&quot; not found` : `type a location to search`}`}`
  })}`;
});
var select__endpoint_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Select_u5Bendpointu5D
});

// .svelte-kit/vercel/entry.js
init();
var entry_default = async (req, res) => {
  const { pathname, searchParams } = new URL(req.url || "", "http://localhost");
  let body;
  try {
    body = await getRawBody(req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: body
  });
  if (rendered) {
    const { status, headers, body: body2 } = rendered;
    return res.writeHead(status, headers).end(body2);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
