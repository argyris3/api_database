//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) {
		__defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	}
	if (!no_symbols) {
		__defProp(target, Symbol.toStringTag, { value: "Module" });
	}
	return target;
};

//#endregion
//#region src/db/query-builder.ts
var QueryBuilder = class {
	constructor(projectUrl, table, apiKey) {
		this.projectUrl = projectUrl;
		this.table = table;
		this.apiKey = apiKey;
		this._method = "GET";
		this._body = null;
		this._filters = [];
		this._selectColumns = [];
		this._orderCol = null;
		this._orderDir = "asc";
		this._limitVal = null;
		this._offsetVal = null;
	}
	select(columns = "*") {
		this._selectColumns = columns === "*" ? [] : columns.split(",").map((c) => c.trim());
		return this;
	}
	eq(column, value) {
		this._filters.push({
			column,
			operator: "eq",
			value: String(value)
		});
		return this;
	}
	neq(column, value) {
		this._filters.push({
			column,
			operator: "neq",
			value: String(value)
		});
		return this;
	}
	gt(column, value) {
		this._filters.push({
			column,
			operator: "gt",
			value: String(value)
		});
		return this;
	}
	gte(column, value) {
		this._filters.push({
			column,
			operator: "gte",
			value: String(value)
		});
		return this;
	}
	lt(column, value) {
		this._filters.push({
			column,
			operator: "lt",
			value: String(value)
		});
		return this;
	}
	lte(column, value) {
		this._filters.push({
			column,
			operator: "lte",
			value: String(value)
		});
		return this;
	}
	like(column, pattern) {
		this._filters.push({
			column,
			operator: "like",
			value: pattern
		});
		return this;
	}
	ilike(column, pattern) {
		this._filters.push({
			column,
			operator: "ilike",
			value: pattern
		});
		return this;
	}
	is(column, value) {
		this._filters.push({
			column,
			operator: "is",
			value: value === "null" ? "null" : "not null"
		});
		return this;
	}
	order(column, direction = "asc") {
		this._orderCol = column;
		this._orderDir = direction;
		return this;
	}
	limit(n) {
		this._limitVal = n;
		return this;
	}
	offset(n) {
		this._offsetVal = n;
		return this;
	}
	insert(data) {
		this._method = "POST";
		this._body = data;
		return this;
	}
	update(data) {
		this._method = "PATCH";
		this._body = data;
		return this;
	}
	delete() {
		this._method = "DELETE";
		return this;
	}
	getRowIdForMutation() {
		const idFilter = this._filters.find((f) => f.column === "id" && f.operator === "eq");
		if (!idFilter) throw new Error("update() and delete() require .eq(\"id\", rowId) before executing");
		return idFilter.value;
	}
	buildUrl() {
		const base = `${this.projectUrl}/rest/${this.table}`;
		if (this._method === "PATCH" || this._method === "DELETE") return `${base}/${this.getRowIdForMutation()}`;
		const params = new URLSearchParams();
		if (this._selectColumns.length > 0) params.set("select", this._selectColumns.join(","));
		for (const { column, operator, value } of this._filters) params.set(column, `${operator}.${value}`);
		if (this._orderCol) params.set("order", `${this._orderCol}.${this._orderDir}`);
		if (this._limitVal !== null) params.set("limit", String(this._limitVal));
		if (this._offsetVal !== null) params.set("offset", String(this._offsetVal));
		const query = params.toString();
		return query ? `${base}?${query}` : base;
	}
	async execute() {
		try {
			const res = await fetch(this.buildUrl(), {
				method: this._method,
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
					"Content-Type": "application/json"
				},
				body: this._body ? JSON.stringify(this._body) : void 0
			});
			if (!res.ok) return {
				data: null,
				error: (await res.json().catch(() => ({}))).message ?? `HTTP ${res.status}`
			};
			if (res.status === 204) return {
				data: null,
				error: null
			};
			return {
				data: await res.json(),
				error: null
			};
		} catch (err) {
			return {
				data: null,
				error: err instanceof Error ? err.message : "Network error"
			};
		}
	}
	then(onfulfilled, onrejected) {
		return this.execute().then(onfulfilled, onrejected);
	}
};

//#endregion
//#region src/db/index.ts
var ApiDatabaseDb = class {
	constructor(projectUrl, apiKey) {
		this.projectUrl = projectUrl;
		this.apiKey = apiKey;
	}
	from(table) {
		return new QueryBuilder(this.projectUrl, table, this.apiKey);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/commons.js
const PACKET_TYPES = Object.create(null);
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
const PACKET_TYPES_REVERSE = Object.create(null);
Object.keys(PACKET_TYPES).forEach((key) => {
	PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
const ERROR_PACKET = {
	type: "error",
	data: "parser error"
};

//#endregion
//#region ../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/encodePacket.browser.js
const withNativeBlob$1 = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
const withNativeArrayBuffer$2 = typeof ArrayBuffer === "function";
const isView$1 = (obj) => {
	return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
};
const encodePacket = ({ type, data }, supportsBinary, callback) => {
	if (withNativeBlob$1 && data instanceof Blob) {
		if (supportsBinary) return callback(data);
		else return encodeBlobAsBase64(data, callback);
	} else if (withNativeArrayBuffer$2 && (data instanceof ArrayBuffer || isView$1(data))) {
		if (supportsBinary) return callback(data);
		else return encodeBlobAsBase64(new Blob([data]), callback);
	}
	return callback(PACKET_TYPES[type] + (data || ""));
};
const encodeBlobAsBase64 = (data, callback) => {
	const fileReader = new FileReader();
	fileReader.onload = function() {
		const content = fileReader.result.split(",")[1];
		callback("b" + (content || ""));
	};
	return fileReader.readAsDataURL(data);
};
function toArray(data) {
	if (data instanceof Uint8Array) return data;
	else if (data instanceof ArrayBuffer) return new Uint8Array(data);
	else return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}
let TEXT_ENCODER;
function encodePacketToBinary(packet, callback) {
	if (withNativeBlob$1 && packet.data instanceof Blob) return packet.data.arrayBuffer().then(toArray).then(callback);
	else if (withNativeArrayBuffer$2 && (packet.data instanceof ArrayBuffer || isView$1(packet.data))) return callback(toArray(packet.data));
	encodePacket(packet, false, (encoded) => {
		if (!TEXT_ENCODER) TEXT_ENCODER = new TextEncoder();
		callback(TEXT_ENCODER.encode(encoded));
	});
}

//#endregion
//#region ../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/contrib/base64-arraybuffer.js
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const lookup$1 = typeof Uint8Array === "undefined" ? [] : /* @__PURE__ */ new Uint8Array(256);
for (let i = 0; i < 64; i++) lookup$1[chars.charCodeAt(i)] = i;
const decode$1 = (base64) => {
	let bufferLength = base64.length * .75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
	if (base64[base64.length - 1] === "=") {
		bufferLength--;
		if (base64[base64.length - 2] === "=") bufferLength--;
	}
	const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
	for (i = 0; i < len; i += 4) {
		encoded1 = lookup$1[base64.charCodeAt(i)];
		encoded2 = lookup$1[base64.charCodeAt(i + 1)];
		encoded3 = lookup$1[base64.charCodeAt(i + 2)];
		encoded4 = lookup$1[base64.charCodeAt(i + 3)];
		bytes[p++] = encoded1 << 2 | encoded2 >> 4;
		bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
		bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
	}
	return arraybuffer;
};

//#endregion
//#region ../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/decodePacket.browser.js
const withNativeArrayBuffer$1 = typeof ArrayBuffer === "function";
const decodePacket = (encodedPacket, binaryType) => {
	if (typeof encodedPacket !== "string") return {
		type: "message",
		data: mapBinary(encodedPacket, binaryType)
	};
	const type = encodedPacket.charAt(0);
	if (type === "b") return {
		type: "message",
		data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
	};
	if (!PACKET_TYPES_REVERSE[type]) return ERROR_PACKET;
	return encodedPacket.length > 1 ? {
		type: PACKET_TYPES_REVERSE[type],
		data: encodedPacket.substring(1)
	} : { type: PACKET_TYPES_REVERSE[type] };
};
const decodeBase64Packet = (data, binaryType) => {
	if (withNativeArrayBuffer$1) {
		const decoded = decode$1(data);
		return mapBinary(decoded, binaryType);
	} else return {
		base64: true,
		data
	};
};
const mapBinary = (data, binaryType) => {
	switch (binaryType) {
		case "blob": if (data instanceof Blob) return data;
		else return new Blob([data]);
		default: if (data instanceof ArrayBuffer) return data;
		else return data.buffer;
	}
};

//#endregion
//#region ../../node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/index.js
const SEPARATOR = String.fromCharCode(30);
const encodePayload = (packets, callback) => {
	const length = packets.length;
	const encodedPackets = new Array(length);
	let count = 0;
	packets.forEach((packet, i) => {
		encodePacket(packet, false, (encodedPacket) => {
			encodedPackets[i] = encodedPacket;
			if (++count === length) callback(encodedPackets.join(SEPARATOR));
		});
	});
};
const decodePayload = (encodedPayload, binaryType) => {
	const encodedPackets = encodedPayload.split(SEPARATOR);
	const packets = [];
	for (let i = 0; i < encodedPackets.length; i++) {
		const decodedPacket = decodePacket(encodedPackets[i], binaryType);
		packets.push(decodedPacket);
		if (decodedPacket.type === "error") break;
	}
	return packets;
};
function createPacketEncoderStream() {
	return new TransformStream({ transform(packet, controller) {
		encodePacketToBinary(packet, (encodedPacket) => {
			const payloadLength = encodedPacket.length;
			let header;
			if (payloadLength < 126) {
				header = /* @__PURE__ */ new Uint8Array(1);
				new DataView(header.buffer).setUint8(0, payloadLength);
			} else if (payloadLength < 65536) {
				header = /* @__PURE__ */ new Uint8Array(3);
				const view = new DataView(header.buffer);
				view.setUint8(0, 126);
				view.setUint16(1, payloadLength);
			} else {
				header = /* @__PURE__ */ new Uint8Array(9);
				const view = new DataView(header.buffer);
				view.setUint8(0, 127);
				view.setBigUint64(1, BigInt(payloadLength));
			}
			if (packet.data && typeof packet.data !== "string") header[0] |= 128;
			controller.enqueue(header);
			controller.enqueue(encodedPacket);
		});
	} });
}
let TEXT_DECODER;
function totalLength(chunks) {
	return chunks.reduce((acc, chunk) => acc + chunk.length, 0);
}
function concatChunks(chunks, size) {
	if (chunks[0].length === size) return chunks.shift();
	const buffer = new Uint8Array(size);
	let j = 0;
	for (let i = 0; i < size; i++) {
		buffer[i] = chunks[0][j++];
		if (j === chunks[0].length) {
			chunks.shift();
			j = 0;
		}
	}
	if (chunks.length && j < chunks[0].length) chunks[0] = chunks[0].slice(j);
	return buffer;
}
function createPacketDecoderStream(maxPayload, binaryType) {
	if (!TEXT_DECODER) TEXT_DECODER = new TextDecoder();
	const chunks = [];
	let state = 0;
	let expectedLength = -1;
	let isBinary = false;
	return new TransformStream({ transform(chunk, controller) {
		chunks.push(chunk);
		while (true) {
			if (state === 0) {
				if (totalLength(chunks) < 1) break;
				const header = concatChunks(chunks, 1);
				isBinary = (header[0] & 128) === 128;
				expectedLength = header[0] & 127;
				if (expectedLength < 126) state = 3;
				else if (expectedLength === 126) state = 1;
				else state = 2;
			} else if (state === 1) {
				if (totalLength(chunks) < 2) break;
				const headerArray = concatChunks(chunks, 2);
				expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
				state = 3;
			} else if (state === 2) {
				if (totalLength(chunks) < 8) break;
				const headerArray = concatChunks(chunks, 8);
				const view = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length);
				const n = view.getUint32(0);
				if (n > Math.pow(2, 21) - 1) {
					controller.enqueue(ERROR_PACKET);
					break;
				}
				expectedLength = n * Math.pow(2, 32) + view.getUint32(4);
				state = 3;
			} else {
				if (totalLength(chunks) < expectedLength) break;
				const data = concatChunks(chunks, expectedLength);
				controller.enqueue(decodePacket(isBinary ? data : TEXT_DECODER.decode(data), binaryType));
				state = 0;
			}
			if (expectedLength === 0 || expectedLength > maxPayload) {
				controller.enqueue(ERROR_PACKET);
				break;
			}
		}
	} });
}

//#endregion
//#region ../../node_modules/.pnpm/@socket.io+component-emitter@3.1.2/node_modules/@socket.io/component-emitter/lib/esm/index.js
/**
* Initialize a new `Emitter`.
*
* @api public
*/
function Emitter(obj) {
	if (obj) return mixin(obj);
}
/**
* Mixin the emitter properties.
*
* @param {Object} obj
* @return {Object}
* @api private
*/
function mixin(obj) {
	for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
	return obj;
}
/**
* Listen on the given `event` with `fn`.
*
* @param {String} event
* @param {Function} fn
* @return {Emitter}
* @api public
*/
Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
	this._callbacks = this._callbacks || {};
	(this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
	return this;
};
/**
* Adds an `event` listener that will be invoked a single
* time then automatically removed.
*
* @param {String} event
* @param {Function} fn
* @return {Emitter}
* @api public
*/
Emitter.prototype.once = function(event, fn) {
	function on() {
		this.off(event, on);
		fn.apply(this, arguments);
	}
	on.fn = fn;
	this.on(event, on);
	return this;
};
/**
* Remove the given callback for `event` or all
* registered callbacks.
*
* @param {String} event
* @param {Function} fn
* @return {Emitter}
* @api public
*/
Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
	this._callbacks = this._callbacks || {};
	if (0 == arguments.length) {
		this._callbacks = {};
		return this;
	}
	var callbacks = this._callbacks["$" + event];
	if (!callbacks) return this;
	if (1 == arguments.length) {
		delete this._callbacks["$" + event];
		return this;
	}
	var cb;
	for (var i = 0; i < callbacks.length; i++) {
		cb = callbacks[i];
		if (cb === fn || cb.fn === fn) {
			callbacks.splice(i, 1);
			break;
		}
	}
	if (callbacks.length === 0) delete this._callbacks["$" + event];
	return this;
};
/**
* Emit `event` with the given args.
*
* @param {String} event
* @param {Mixed} ...
* @return {Emitter}
*/
Emitter.prototype.emit = function(event) {
	this._callbacks = this._callbacks || {};
	var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
	for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
	if (callbacks) {
		callbacks = callbacks.slice(0);
		for (var i = 0, len = callbacks.length; i < len; ++i) callbacks[i].apply(this, args);
	}
	return this;
};
Emitter.prototype.emitReserved = Emitter.prototype.emit;
/**
* Return array of callbacks for `event`.
*
* @param {String} event
* @return {Array}
* @api public
*/
Emitter.prototype.listeners = function(event) {
	this._callbacks = this._callbacks || {};
	return this._callbacks["$" + event] || [];
};
/**
* Check if this emitter has `event` handlers.
*
* @param {String} event
* @return {Boolean}
* @api public
*/
Emitter.prototype.hasListeners = function(event) {
	return !!this.listeners(event).length;
};

//#endregion
//#region ../../node_modules/.pnpm/engine.io-client@6.6.6_supports-color@10.2.2/node_modules/engine.io-client/build/esm/globals.js
const nextTick = (() => {
	if (typeof Promise === "function" && typeof Promise.resolve === "function") return (cb) => Promise.resolve().then(cb);
	else return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
})();
const globalThisShim = (() => {
	if (typeof self !== "undefined") return self;
	else if (typeof window !== "undefined") return window;
	else return Function("return this")();
})();
const defaultBinaryType = "arraybuffer";
function createCookieJar() {}

//#endregion
//#region ../../node_modules/.pnpm/engine.io-client@6.6.6_supports-color@10.2.2/node_modules/engine.io-client/build/esm/util.js
function pick(obj, ...attr) {
	return attr.reduce((acc, k) => {
		if (obj.hasOwnProperty(k)) acc[k] = obj[k];
		return acc;
	}, {});
}
const NATIVE_SET_TIMEOUT = globalThisShim.setTimeout;
const NATIVE_CLEAR_TIMEOUT = globalThisShim.clearTimeout;
function installTimerFunctions(obj, opts) {
	if (opts.useNativeTimers) {
		obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
		obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
	} else {
		obj.setTimeoutFn = globalThisShim.setTimeout.bind(globalThisShim);
		obj.clearTimeoutFn = globalThisShim.clearTimeout.bind(globalThisShim);
	}
}
const BASE64_OVERHEAD = 1.33;
function byteLength(obj) {
	if (typeof obj === "string") return utf8Length(obj);
	return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
}
function utf8Length(str) {
	let c = 0, length = 0;
	for (let i = 0, l = str.length; i < l; i++) {
		c = str.charCodeAt(i);
		if (c < 128) length += 1;
		else if (c < 2048) length += 2;
		else if (c < 55296 || c >= 57344) length += 3;
		else {
			i++;
			length += 4;
		}
	}
	return length;
}
/**
* Generates a random 8-characters string.
*/
function randomString() {
	return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}

//#endregion
//#region ../../node_modules/.pnpm/engine.io-client@6.6.6_supports-color@10.2.2/node_modules/engine.io-client/build/esm/contrib/parseqs.js
/**
* Compiles a querystring
* Returns string representation of the object
*
* @param {Object}
* @api private
*/
function encode(obj) {
	let str = "";
	for (let i in obj) if (obj.hasOwnProperty(i)) {
		if (str.length) str += "&";
		str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
	}
	return str;
}
/**
* Parses a simple querystring into an object
*
* @param {String} qs
* @api private
*/
function decode(qs) {
	let qry = {};
	let pairs = qs.split("&");
	for (let i = 0, l = pairs.length; i < l; i++) {
		let pair = pairs[i].split("=");
		qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	}
	return qry;
}

//#endregion
//#region ../../node_modules/.pnpm/engine.io-client@6.6.6_supports-color@10.2.2/node_modules/engine.io-client/build/esm/transport.js
var TransportError = class extends Error {
	constructor(reason, description, context) {
		super(reason);
		this.description = description;
		this.context = context;
		this.type = "TransportError";
	}
};
var Transport = class extends Emitter {
	/**
	* Transport abstract constructor.
	*
	* @param {Object} opts - options
	* @protected
	*/
	constructor(opts) {
		super();
		this.writable = false;
		installTimerFunctions(this, opts);
		this.opts = opts;
		this.query = opts.query;
		this.socket = opts.socket;
		this.supportsBinary = !opts.forceBase64;
	}
	/**
	* Emits an error.
	*
	* @param {String} reason
	* @param description
	* @param context - the error context
	* @return {Transport} for chaining
	* @protected
	*/
	onError(reason, description, context) {
		super.emitReserved("error", new TransportError(reason, description, context));
		return this;
	}
	/**
	* Opens the transport.
	*/
	open() {
		this.readyState = "opening";
		this.doOpen();
		return this;
	}
	/**
	* Closes the transport.
	*/
	close() {
		if (this.readyState === "opening" || this.readyState === "open") {
			this.doClose();
			this.onClose();
		}
		return this;
	}
	/**
	* Sends multiple packets.
	*
	* @param {Array} packets
	*/
	send(packets) {
		if (this.readyState === "open") this.write(packets);
	}
	/**
	* Called upon open
	*
	* @protected
	*/
	onOpen() {
		this.readyState = "open";
		this.writable = true;
		super.emitReserved("open");
	}
	/**
	* Called with data.
	*
	* @param {String} data
	* @protected
	*/
	onData(data) {
		const packet = decodePacket(data, this.socket.binaryType);
		this.onPacket(packet);
	}
	/**
	* Called with a decoded packet.
	*
	* @protected
	*/
	onPacket(packet) {
		super.emitReserved("packet", packet);
	}
	/**
	* Called upon close.
	*
	* @protected
	*/
	onClose(details) {
		this.readyState = "closed";
		super.emitReserved("close", details);
	}
	/**
	* Pauses the transport, in order not to lose packets during an upgrade.
	*
	* @param onPause
	*/
	pause(onPause) {}
	createUri(schema, query = {}) {
		return schema + "://" + this._hostname() + this._port() + this.opts.path + this._query(query);
	}
	_hostname() {
		const hostname = this.opts.hostname;
		return hostname.indexOf(":") === -1 ? hostname : "[" + hostname + "]";
	}
	_port() {
		if (this.opts.port && (this.opts.secure && Number(this.opts.port) !== 443 || !this.opts.secure && Number(this.opts.port) !== 80)) return ":" + this.opts.port;
		else return "";
	}
	_query(query) {
		const encodedQuery = encode(query);
		return encodedQuery.length ? "?" + encodedQuery : "";
	}
};

//#endregion
//#region ../../node_modules/.pnpm/engine.io-client@6.6.6_supports-color@10.2.2/node_modules/engine.io-client/build/esm/transports/polling.js
var Polling = class extends Transport {
	constructor() {
		super(...arguments);
		this._polling = false;
	}
	get name() {
		return "polling";
	}
	/**
	* Opens the socket (triggers polling). We write a PING message to determine
	* when the transport is open.
	*
	* @protected
	*/
	doOpen() {
		this._poll();
	}
	/**
	* Pauses polling.
	*
	* @param {Function} onPause - callback upon buffers are flushed and transport is paused
	* @package
	*/
	pause(onPause) {
		this.readyState = "pausing";
		const pause = () => {
			this.readyState = "paused";
			onPause();
		};
		if (this._polling || !this.writable) {
			let total = 0;
			if (this._polling) {
				total++;
				this.once("pollComplete", function() {
					--total || pause();
				});
			}
			if (!this.writable) {
				total++;
				this.once("drain", function() {
					--total || pause();
				});
			}
		} else pause();
	}
	/**
	* Starts polling cycle.
	*
	* @private
	*/
	_poll() {
		this._polling = true;
		this.doPoll();
		this.emitReserved("poll");
	}
	/**
	* Overloads onData to detect payloads.
	*
	* @protected
	*/
	onData(data) {
		const callback = (packet) => {
			if ("opening" === this.readyState && packet.type === "open") this.onOpen();
			if ("close" === packet.type) {
				this.onClose({ description: "transport closed by the server" });
				return false;
			}
			this.onPacket(packet);
		};
		decodePayload(data, this.socket.binaryType).forEach(callback);
		if ("closed" !== this.readyState) {
			this._polling = false;
			this.emitReserved("pollComplete");
			if ("open" === this.readyState) this._poll();
		}
	}
	/**
	* For polling, send a close packet.
	*
	* @protected
	*/
	doClose() {
		const close = () => {
			this.write([{ type: "close" }]);
		};
		if ("open" === this.readyState) close();
		else this.once("open", close);
	}
	/**
	* Writes a packets payload.
	*
	* @param {Array} packets - data packets
	* @protected
	*/
	write(packets) {
		this.writable = false;
		encodePayload(packets, (data) => {
			this.doWrite(data, () => {
				this.writable = true;
				this.emitReserved("drain");
			});
		});
	}
	/**
	* Generates uri for connection.
	*
	* @private
	*/
	uri() {
		const schema = this.opts.secure ? "https" : "http";
		const query = this.query || {};
		if (false !== this.opts.timestampRequests) query[this.opts.timestampParam] = randomString();
		if (!this.supportsBinary && !query.sid) query.b64 = 1;
		return this.createUri(schema, query);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/engine.io-client@6.6.6_supports-color@10.2.2/node_modules/engine.io-client/build/esm/contrib/has-cors.js
let value = false;
try {
	value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
} catch (err) {}
const hasCORS = value;

//#endregion
//#region ../../node_modules/.pnpm/engine.io-client@6.6.6_supports-color@10.2.2/node_modules/engine.io-client/build/esm/transports/polling-xhr.js
function empty() {}
var BaseXHR = class extends Polling {
	/**
	* XHR Polling constructor.
	*
	* @param {Object} opts
	* @package
	*/
	constructor(opts) {
		super(opts);
		if (typeof location !== "undefined") {
			const isSSL = "https:" === location.protocol;
			let port = location.port;
			if (!port) port = isSSL ? "443" : "80";
			this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
		}
	}
	/**
	* Sends data.
	*
	* @param {String} data - data to send.
	* @param {Function} fn - called upon flush.
	* @private
	*/
	doWrite(data, fn) {
		const req = this.request({
			method: "POST",
			data
		});
		req.on("success", fn);
		req.on("error", (xhrStatus, context) => {
			this.onError("xhr post error", xhrStatus, context);
		});
	}
	/**
	* Starts a poll cycle.
	*
	* @private
	*/
	doPoll() {
		const req = this.request();
		req.on("data", this.onData.bind(this));
		req.on("error", (xhrStatus, context) => {
			this.onError("xhr poll error", xhrStatus, context);
		});
		this.pollXhr = req;
	}
};
var Request = class Request extends Emitter {
	/**
	* Request constructor
	*
	* @param {Object} options
	* @package
	*/
	constructor(createRequest, uri, opts) {
		super();
		this.createRequest = createRequest;
		installTimerFunctions(this, opts);
		this._opts = opts;
		this._method = opts.method || "GET";
		this._uri = uri;
		this._data = void 0 !== opts.data ? opts.data : null;
		this._create();
	}
	/**
	* Creates the XHR object and sends the request.
	*
	* @private
	*/
	_create() {
		var _a;
		const opts = pick(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
		opts.xdomain = !!this._opts.xd;
		const xhr = this._xhr = this.createRequest(opts);
		try {
			xhr.open(this._method, this._uri, true);
			try {
				if (this._opts.extraHeaders) {
					xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
					for (let i in this._opts.extraHeaders) if (this._opts.extraHeaders.hasOwnProperty(i)) xhr.setRequestHeader(i, this._opts.extraHeaders[i]);
				}
			} catch (e) {}
			if ("POST" === this._method) try {
				xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
			} catch (e) {}
			try {
				xhr.setRequestHeader("Accept", "*/*");
			} catch (e) {}
			(_a = this._opts.cookieJar) === null || _a === void 0 || _a.addCookies(xhr);
			if ("withCredentials" in xhr) xhr.withCredentials = this._opts.withCredentials;
			if (this._opts.requestTimeout) xhr.timeout = this._opts.requestTimeout;
			xhr.onreadystatechange = () => {
				var _a;
				if (xhr.readyState === 3) (_a = this._opts.cookieJar) === null || _a === void 0 || _a.parseCookies(xhr.getResponseHeader("set-cookie"));
				if (4 !== xhr.readyState) return;
				if (200 === xhr.status || 1223 === xhr.status) this._onLoad();
				else this.setTimeoutFn(() => {
					this._onError(typeof xhr.status === "number" ? xhr.status : 0);
				}, 0);
			};
			xhr.send(this._data);
		} catch (e) {
			this.setTimeoutFn(() => {
				this._onError(e);
			}, 0);
			return;
		}
		if (typeof document !== "undefined") {
			this._index = Request.requestsCount++;
			Request.requests[this._index] = this;
		}
	}
	/**
	* Called upon error.
	*
	* @private
	*/
	_onError(err) {
		this.emitReserved("error", err, this._xhr);
		this._cleanup(true);
	}
	/**
	* Cleans up house.
	*
	* @private
	*/
	_cleanup(fromError) {
		if ("undefined" === typeof this._xhr || null === this._xhr) return;
		this._xhr.onreadystatechange = empty;
		if (fromError) try {
			this._xhr.abort();
		} catch (e) {}
		if (typeof document !== "undefined") delete Request.requests[this._index];
		this._xhr = null;
	}
	/**
	* Called upon load.
	*
	* @private
	*/
	_onLoad() {
		const data = this._xhr.responseText;
		if (data !== null) {
			this.emitReserved("data", data);
			this.emitReserved("success");
			this._cleanup();
		}
	}
	/**
	* Aborts the request.
	*
	* @package
	*/
	abort() {
		this._cleanup();
	}
};
Request.requestsCount = 0;
Request.requests = {};
/**
* Aborts pending requests when unloading the window. This is needed to prevent
* memory leaks (e.g. when using IE) and to ensure that no spurious error is
* emitted.
*/
if (typeof document !== "undefined") {
	if (typeof attachEvent === "function") attachEvent("onunload", unloadHandler);
	else if (typeof addEventListener === "function") {
		const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
		addEventListener(terminationEvent, unloadHandler, false);
	}
}
function unloadHandler() {
	for (let i in Request.requests) if (Request.requests.hasOwnProperty(i)) Request.requests[i].abort();
}
const hasXHR2 = (function() {
	const xhr = newRequest({ xdomain: false });
	return xhr && xhr.responseType !== null;
})();
/**
* HTTP long-polling based on the built-in `XMLHttpRequest` object.
*
* Usage: browser
*
* @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
*/
var XHR = class extends BaseXHR {
	constructor(opts) {
		super(opts);
		const forceBase64 = opts && opts.forceBase64;
		this.supportsBinary = hasXHR2 && !forceBase64;
	}
	request(opts = {}) {
		Object.assign(opts, { xd: this.xd }, this.opts);
		return new Request(newRequest, this.uri(), opts);
	}
};
function newRequest(opts) {
	const xdomain = opts.xdomain;
	try {
		if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) return new XMLHttpRequest();
	} catch (e) {}
	if (!xdomain) try {
		return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
	} catch (e) {}
}

//#endregion
//#region ../../node_modules/.pnpm/engine.io-client@6.6.6_supports-color@10.2.2/node_modules/engine.io-client/build/esm/transports/websocket.js
const isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
var BaseWS = class extends Transport {
	get name() {
		return "websocket";
	}
	doOpen() {
		const uri = this.uri();
		const protocols = this.opts.protocols;
		const opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
		if (this.opts.extraHeaders) opts.headers = this.opts.extraHeaders;
		try {
			this.ws = this.createSocket(uri, protocols, opts);
		} catch (err) {
			return this.emitReserved("error", err);
		}
		this.ws.binaryType = this.socket.binaryType;
		this.addEventListeners();
	}
	/**
	* Adds event listeners to the socket
	*
	* @private
	*/
	addEventListeners() {
		this.ws.onopen = () => {
			if (this.opts.autoUnref) this.ws._socket.unref();
			this.onOpen();
		};
		this.ws.onclose = (closeEvent) => this.onClose({
			description: "websocket connection closed",
			context: closeEvent
		});
		this.ws.onmessage = (ev) => this.onData(ev.data);
		this.ws.onerror = (e) => this.onError("websocket error", e);
	}
	write(packets) {
		this.writable = false;
		for (let i = 0; i < packets.length; i++) {
			const packet = packets[i];
			const lastPacket = i === packets.length - 1;
			encodePacket(packet, this.supportsBinary, (data) => {
				try {
					this.doWrite(packet, data);
				} catch (e) {}
				if (lastPacket) nextTick(() => {
					this.writable = true;
					this.emitReserved("drain");
				}, this.setTimeoutFn);
			});
		}
	}
	doClose() {
		if (typeof this.ws !== "undefined") {
			this.ws.onerror = () => {};
			this.ws.close();
			this.ws = null;
		}
	}
	/**
	* Generates uri for connection.
	*
	* @private
	*/
	uri() {
		const schema = this.opts.secure ? "wss" : "ws";
		const query = this.query || {};
		if (this.opts.timestampRequests) query[this.opts.timestampParam] = randomString();
		if (!this.supportsBinary) query.b64 = 1;
		return this.createUri(schema, query);
	}
};
const WebSocketCtor = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
/**
* WebSocket transport based on the built-in `WebSocket` object.
*
* Usage: browser, Node.js (since v21), Deno, Bun
*
* @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
* @see https://caniuse.com/mdn-api_websocket
* @see https://nodejs.org/api/globals.html#websocket
*/
var WS = class extends BaseWS {
	createSocket(uri, protocols, opts) {
		return !isReactNative ? protocols ? new WebSocketCtor(uri, protocols) : new WebSocketCtor(uri) : new WebSocketCtor(uri, protocols, opts);
	}
	doWrite(_packet, data) {
		this.ws.send(data);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/engine.io-client@6.6.6_supports-color@10.2.2/node_modules/engine.io-client/build/esm/transports/webtransport.js
/**
* WebTransport transport based on the built-in `WebTransport` object.
*
* Usage: browser, Node.js (with the `@fails-components/webtransport` package)
*
* @see https://developer.mozilla.org/en-US/docs/Web/API/WebTransport
* @see https://caniuse.com/webtransport
*/
var WT = class extends Transport {
	get name() {
		return "webtransport";
	}
	doOpen() {
		try {
			this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
		} catch (err) {
			return this.emitReserved("error", err);
		}
		this._transport.closed.then(() => {
			this.onClose();
		}).catch((err) => {
			this.onError("webtransport error", err);
		});
		this._transport.ready.then(() => {
			this._transport.createBidirectionalStream().then((stream) => {
				const decoderStream = createPacketDecoderStream(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
				const reader = stream.readable.pipeThrough(decoderStream).getReader();
				const encoderStream = createPacketEncoderStream();
				encoderStream.readable.pipeTo(stream.writable);
				this._writer = encoderStream.writable.getWriter();
				const read = () => {
					reader.read().then(({ done, value }) => {
						if (done) return;
						this.onPacket(value);
						read();
					}).catch((err) => {});
				};
				read();
				const packet = { type: "open" };
				if (this.query.sid) packet.data = `{"sid":"${this.query.sid}"}`;
				this._writer.write(packet).then(() => this.onOpen());
			});
		});
	}
	write(packets) {
		this.writable = false;
		for (let i = 0; i < packets.length; i++) {
			const packet = packets[i];
			const lastPacket = i === packets.length - 1;
			this._writer.write(packet).then(() => {
				if (lastPacket) nextTick(() => {
					this.writable = true;
					this.emitReserved("drain");
				}, this.setTimeoutFn);
			});
		}
	}
	doClose() {
		var _a;
		(_a = this._transport) === null || _a === void 0 || _a.close();
	}
};

//#endregion
//#region ../../node_modules/.pnpm/engine.io-client@6.6.6_supports-color@10.2.2/node_modules/engine.io-client/build/esm/transports/index.js
const transports = {
	websocket: WS,
	webtransport: WT,
	polling: XHR
};

//#endregion
//#region ../../node_modules/.pnpm/engine.io-client@6.6.6_supports-color@10.2.2/node_modules/engine.io-client/build/esm/contrib/parseuri.js
/**
* Parses a URI
*
* Note: we could also have used the built-in URL object, but it isn't supported on all platforms.
*
* See:
* - https://developer.mozilla.org/en-US/docs/Web/API/URL
* - https://caniuse.com/url
* - https://www.rfc-editor.org/rfc/rfc3986#appendix-B
*
* History of the parse() method:
* - first commit: https://github.com/socketio/socket.io-client/commit/4ee1d5d94b3906a9c052b459f1a818b15f38f91c
* - export into its own module: https://github.com/socketio/engine.io-client/commit/de2c561e4564efeb78f1bdb1ba39ef81b2822cb3
* - reimport: https://github.com/socketio/engine.io-client/commit/df32277c3f6d622eec5ed09f493cae3f3391d242
*
* @author Steven Levithan <stevenlevithan.com> (MIT license)
* @api private
*/
const re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
const parts = [
	"source",
	"protocol",
	"authority",
	"userInfo",
	"user",
	"password",
	"host",
	"port",
	"relative",
	"path",
	"directory",
	"file",
	"query",
	"anchor"
];
function parse(str) {
	if (str.length > 8e3) throw "URI too long";
	const src = str, b = str.indexOf("["), e = str.indexOf("]");
	if (b != -1 && e != -1) str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length);
	let m = re.exec(str || ""), uri = {}, i = 14;
	while (i--) uri[parts[i]] = m[i] || "";
	if (b != -1 && e != -1) {
		uri.source = src;
		uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
		uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
		uri.ipv6uri = true;
	}
	uri.pathNames = pathNames(uri, uri["path"]);
	uri.queryKey = queryKey(uri, uri["query"]);
	return uri;
}
function pathNames(obj, path) {
	const names = path.replace(/\/{2,9}/g, "/").split("/");
	if (path.slice(0, 1) == "/" || path.length === 0) names.splice(0, 1);
	if (path.slice(-1) == "/") names.splice(names.length - 1, 1);
	return names;
}
function queryKey(uri, query) {
	const data = {};
	query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
		if ($1) data[$1] = $2;
	});
	return data;
}

//#endregion
//#region ../../node_modules/.pnpm/engine.io-client@6.6.6_supports-color@10.2.2/node_modules/engine.io-client/build/esm/socket.js
const withEventListeners = typeof addEventListener === "function" && typeof removeEventListener === "function";
const OFFLINE_EVENT_LISTENERS = [];
if (withEventListeners) addEventListener("offline", () => {
	OFFLINE_EVENT_LISTENERS.forEach((listener) => listener());
}, false);
/**
* This class provides a WebSocket-like interface to connect to an Engine.IO server. The connection will be established
* with one of the available low-level transports, like HTTP long-polling, WebSocket or WebTransport.
*
* This class comes without upgrade mechanism, which means that it will keep the first low-level transport that
* successfully establishes the connection.
*
* In order to allow tree-shaking, there are no transports included, that's why the `transports` option is mandatory.
*
* @example
* import { SocketWithoutUpgrade, WebSocket } from "engine.io-client";
*
* const socket = new SocketWithoutUpgrade({
*   transports: [WebSocket]
* });
*
* socket.on("open", () => {
*   socket.send("hello");
* });
*
* @see SocketWithUpgrade
* @see Socket
*/
var SocketWithoutUpgrade = class SocketWithoutUpgrade extends Emitter {
	/**
	* Socket constructor.
	*
	* @param {String|Object} uri - uri or options
	* @param {Object} opts - options
	*/
	constructor(uri, opts) {
		super();
		this.binaryType = defaultBinaryType;
		this.writeBuffer = [];
		this._prevBufferLen = 0;
		this._pingInterval = -1;
		this._pingTimeout = -1;
		this._maxPayload = -1;
		/**
		* The expiration timestamp of the {@link _pingTimeoutTimer} object is tracked, in case the timer is throttled and the
		* callback is not fired on time. This can happen for example when a laptop is suspended or when a phone is locked.
		*/
		this._pingTimeoutTime = Infinity;
		if (uri && "object" === typeof uri) {
			opts = uri;
			uri = null;
		}
		if (uri) {
			const parsedUri = parse(uri);
			opts.hostname = parsedUri.host;
			opts.secure = parsedUri.protocol === "https" || parsedUri.protocol === "wss";
			opts.port = parsedUri.port;
			if (parsedUri.query) opts.query = parsedUri.query;
		} else if (opts.host) opts.hostname = parse(opts.host).host;
		installTimerFunctions(this, opts);
		this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
		if (opts.hostname && !opts.port) opts.port = this.secure ? "443" : "80";
		this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
		this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
		this.transports = [];
		this._transportsByName = {};
		opts.transports.forEach((t) => {
			const transportName = t.prototype.name;
			this.transports.push(transportName);
			this._transportsByName[transportName] = t;
		});
		this.opts = Object.assign({
			path: "/engine.io",
			agent: false,
			withCredentials: false,
			upgrade: true,
			timestampParam: "t",
			rememberUpgrade: false,
			addTrailingSlash: true,
			rejectUnauthorized: true,
			perMessageDeflate: { threshold: 1024 },
			transportOptions: {},
			closeOnBeforeunload: false
		}, opts);
		this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
		if (typeof this.opts.query === "string") this.opts.query = decode(this.opts.query);
		if (withEventListeners) {
			if (this.opts.closeOnBeforeunload) {
				this._beforeunloadEventListener = () => {
					if (this.transport) {
						this.transport.removeAllListeners();
						this.transport.close();
					}
				};
				addEventListener("beforeunload", this._beforeunloadEventListener, false);
			}
			if (this.hostname !== "localhost") {
				this._offlineEventListener = () => {
					this._onClose("transport close", { description: "network connection lost" });
				};
				OFFLINE_EVENT_LISTENERS.push(this._offlineEventListener);
			}
		}
		if (this.opts.withCredentials) this._cookieJar = /* @__PURE__ */ createCookieJar();
		this._open();
	}
	/**
	* Creates transport of the given type.
	*
	* @param {String} name - transport name
	* @return {Transport}
	* @private
	*/
	createTransport(name) {
		const query = Object.assign({}, this.opts.query);
		query.EIO = 4;
		query.transport = name;
		if (this.id) query.sid = this.id;
		const opts = Object.assign({}, this.opts, {
			query,
			socket: this,
			hostname: this.hostname,
			secure: this.secure,
			port: this.port
		}, this.opts.transportOptions[name]);
		return new this._transportsByName[name](opts);
	}
	/**
	* Initializes transport to use and starts probe.
	*
	* @private
	*/
	_open() {
		if (this.transports.length === 0) {
			this.setTimeoutFn(() => {
				this.emitReserved("error", "No transports available");
			}, 0);
			return;
		}
		const transportName = this.opts.rememberUpgrade && SocketWithoutUpgrade.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
		this.readyState = "opening";
		const transport = this.createTransport(transportName);
		transport.open();
		this.setTransport(transport);
	}
	/**
	* Sets the current transport. Disables the existing one (if any).
	*
	* @private
	*/
	setTransport(transport) {
		if (this.transport) this.transport.removeAllListeners();
		this.transport = transport;
		transport.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (reason) => this._onClose("transport close", reason));
	}
	/**
	* Called when connection is deemed open.
	*
	* @private
	*/
	onOpen() {
		this.readyState = "open";
		SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === this.transport.name;
		this.emitReserved("open");
		this.flush();
	}
	/**
	* Handles a packet.
	*
	* @private
	*/
	_onPacket(packet) {
		if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
			this.emitReserved("packet", packet);
			this.emitReserved("heartbeat");
			switch (packet.type) {
				case "open":
					this.onHandshake(JSON.parse(packet.data));
					break;
				case "ping":
					this._sendPacket("pong");
					this.emitReserved("ping");
					this.emitReserved("pong");
					this._resetPingTimeout();
					break;
				case "error":
					const err = /* @__PURE__ */ new Error("server error");
					err.code = packet.data;
					this._onError(err);
					break;
				case "message":
					this.emitReserved("data", packet.data);
					this.emitReserved("message", packet.data);
			}
		}
	}
	/**
	* Called upon handshake completion.
	*
	* @param {Object} data - handshake obj
	* @private
	*/
	onHandshake(data) {
		this.emitReserved("handshake", data);
		this.id = data.sid;
		this.transport.query.sid = data.sid;
		this._pingInterval = data.pingInterval;
		this._pingTimeout = data.pingTimeout;
		this._maxPayload = data.maxPayload;
		this.onOpen();
		if ("closed" === this.readyState) return;
		this._resetPingTimeout();
	}
	/**
	* Sets and resets ping timeout timer based on server pings.
	*
	* @private
	*/
	_resetPingTimeout() {
		this.clearTimeoutFn(this._pingTimeoutTimer);
		const delay = this._pingInterval + this._pingTimeout;
		this._pingTimeoutTime = Date.now() + delay;
		this._pingTimeoutTimer = this.setTimeoutFn(() => {
			this._onClose("ping timeout");
		}, delay);
		if (this.opts.autoUnref) this._pingTimeoutTimer.unref();
	}
	/**
	* Called on `drain` event
	*
	* @private
	*/
	_onDrain() {
		this.writeBuffer.splice(0, this._prevBufferLen);
		this._prevBufferLen = 0;
		if (0 === this.writeBuffer.length) this.emitReserved("drain");
		else this.flush();
	}
	/**
	* Flush write buffers.
	*
	* @private
	*/
	flush() {
		if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
			const packets = this._getWritablePackets();
			this.transport.send(packets);
			this._prevBufferLen = packets.length;
			this.emitReserved("flush");
		}
	}
	/**
	* Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
	* long-polling)
	*
	* @private
	*/
	_getWritablePackets() {
		if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1)) return this.writeBuffer;
		let payloadSize = 1;
		for (let i = 0; i < this.writeBuffer.length; i++) {
			const data = this.writeBuffer[i].data;
			if (data) payloadSize += byteLength(data);
			if (i > 0 && payloadSize > this._maxPayload) return this.writeBuffer.slice(0, i);
			payloadSize += 2;
		}
		return this.writeBuffer;
	}
	/**
	* Checks whether the heartbeat timer has expired but the socket has not yet been notified.
	*
	* Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
	* `write()` method then the message would not be buffered by the Socket.IO client.
	*
	* @return {boolean}
	* @private
	*/
	_hasPingExpired() {
		if (!this._pingTimeoutTime) return true;
		const hasExpired = Date.now() > this._pingTimeoutTime;
		if (hasExpired) {
			this._pingTimeoutTime = 0;
			nextTick(() => {
				this._onClose("ping timeout");
			}, this.setTimeoutFn);
		}
		return hasExpired;
	}
	/**
	* Sends a message.
	*
	* @param {String} msg - message.
	* @param {Object} options.
	* @param {Function} fn - callback function.
	* @return {Socket} for chaining.
	*/
	write(msg, options, fn) {
		this._sendPacket("message", msg, options, fn);
		return this;
	}
	/**
	* Sends a message. Alias of {@link Socket#write}.
	*
	* @param {String} msg - message.
	* @param {Object} options.
	* @param {Function} fn - callback function.
	* @return {Socket} for chaining.
	*/
	send(msg, options, fn) {
		this._sendPacket("message", msg, options, fn);
		return this;
	}
	/**
	* Sends a packet.
	*
	* @param {String} type - packet type.
	* @param {String} data.
	* @param {Object} options.
	* @param {Function} fn - callback function.
	* @private
	*/
	_sendPacket(type, data, options, fn) {
		if ("function" === typeof data) {
			fn = data;
			data = void 0;
		}
		if ("function" === typeof options) {
			fn = options;
			options = null;
		}
		if ("closing" === this.readyState || "closed" === this.readyState) return;
		options = options || {};
		options.compress = false !== options.compress;
		const packet = {
			type,
			data,
			options
		};
		this.emitReserved("packetCreate", packet);
		this.writeBuffer.push(packet);
		if (fn) this.once("flush", fn);
		this.flush();
	}
	/**
	* Closes the connection.
	*/
	close() {
		const close = () => {
			this._onClose("forced close");
			this.transport.close();
		};
		const cleanupAndClose = () => {
			this.off("upgrade", cleanupAndClose);
			this.off("upgradeError", cleanupAndClose);
			close();
		};
		const waitForUpgrade = () => {
			this.once("upgrade", cleanupAndClose);
			this.once("upgradeError", cleanupAndClose);
		};
		if ("opening" === this.readyState || "open" === this.readyState) {
			this.readyState = "closing";
			if (this.writeBuffer.length) this.once("drain", () => {
				if (this.upgrading) waitForUpgrade();
				else close();
			});
			else if (this.upgrading) waitForUpgrade();
			else close();
		}
		return this;
	}
	/**
	* Called upon transport error
	*
	* @private
	*/
	_onError(err) {
		SocketWithoutUpgrade.priorWebsocketSuccess = false;
		if (this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening") {
			this.transports.shift();
			return this._open();
		}
		this.emitReserved("error", err);
		this._onClose("transport error", err);
	}
	/**
	* Called upon transport close.
	*
	* @private
	*/
	_onClose(reason, description) {
		if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
			this.clearTimeoutFn(this._pingTimeoutTimer);
			this.transport.removeAllListeners("close");
			this.transport.close();
			this.transport.removeAllListeners();
			if (withEventListeners) {
				if (this._beforeunloadEventListener) removeEventListener("beforeunload", this._beforeunloadEventListener, false);
				if (this._offlineEventListener) {
					const i = OFFLINE_EVENT_LISTENERS.indexOf(this._offlineEventListener);
					if (i !== -1) OFFLINE_EVENT_LISTENERS.splice(i, 1);
				}
			}
			this.readyState = "closed";
			this.id = null;
			this.emitReserved("close", reason, description);
			this.writeBuffer = [];
			this._prevBufferLen = 0;
		}
	}
};
SocketWithoutUpgrade.protocol = 4;
/**
* This class provides a WebSocket-like interface to connect to an Engine.IO server. The connection will be established
* with one of the available low-level transports, like HTTP long-polling, WebSocket or WebTransport.
*
* This class comes with an upgrade mechanism, which means that once the connection is established with the first
* low-level transport, it will try to upgrade to a better transport.
*
* In order to allow tree-shaking, there are no transports included, that's why the `transports` option is mandatory.
*
* @example
* import { SocketWithUpgrade, WebSocket } from "engine.io-client";
*
* const socket = new SocketWithUpgrade({
*   transports: [WebSocket]
* });
*
* socket.on("open", () => {
*   socket.send("hello");
* });
*
* @see SocketWithoutUpgrade
* @see Socket
*/
var SocketWithUpgrade = class extends SocketWithoutUpgrade {
	constructor() {
		super(...arguments);
		this._upgrades = [];
	}
	onOpen() {
		super.onOpen();
		if ("open" === this.readyState && this.opts.upgrade) for (let i = 0; i < this._upgrades.length; i++) this._probe(this._upgrades[i]);
	}
	/**
	* Probes a transport.
	*
	* @param {String} name - transport name
	* @private
	*/
	_probe(name) {
		let transport = this.createTransport(name);
		let failed = false;
		SocketWithoutUpgrade.priorWebsocketSuccess = false;
		const onTransportOpen = () => {
			if (failed) return;
			transport.send([{
				type: "ping",
				data: "probe"
			}]);
			transport.once("packet", (msg) => {
				if (failed) return;
				if ("pong" === msg.type && "probe" === msg.data) {
					this.upgrading = true;
					this.emitReserved("upgrading", transport);
					if (!transport) return;
					SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === transport.name;
					this.transport.pause(() => {
						if (failed) return;
						if ("closed" === this.readyState) return;
						cleanup();
						this.setTransport(transport);
						transport.send([{ type: "upgrade" }]);
						this.emitReserved("upgrade", transport);
						transport = null;
						this.upgrading = false;
						this.flush();
					});
				} else {
					const err = /* @__PURE__ */ new Error("probe error");
					err.transport = transport.name;
					this.emitReserved("upgradeError", err);
				}
			});
		};
		function freezeTransport() {
			if (failed) return;
			failed = true;
			cleanup();
			transport.close();
			transport = null;
		}
		const onerror = (err) => {
			const error = /* @__PURE__ */ new Error("probe error: " + err);
			error.transport = transport.name;
			freezeTransport();
			this.emitReserved("upgradeError", error);
		};
		function onTransportClose() {
			onerror("transport closed");
		}
		function onclose() {
			onerror("socket closed");
		}
		function onupgrade(to) {
			if (transport && to.name !== transport.name) freezeTransport();
		}
		const cleanup = () => {
			transport.removeListener("open", onTransportOpen);
			transport.removeListener("error", onerror);
			transport.removeListener("close", onTransportClose);
			this.off("close", onclose);
			this.off("upgrading", onupgrade);
		};
		transport.once("open", onTransportOpen);
		transport.once("error", onerror);
		transport.once("close", onTransportClose);
		this.once("close", onclose);
		this.once("upgrading", onupgrade);
		if (this._upgrades.indexOf("webtransport") !== -1 && name !== "webtransport") this.setTimeoutFn(() => {
			if (!failed) transport.open();
		}, 200);
		else transport.open();
	}
	onHandshake(data) {
		this._upgrades = this._filterUpgrades(data.upgrades);
		super.onHandshake(data);
	}
	/**
	* Filters upgrades, returning only those matching client transports.
	*
	* @param {Array} upgrades - server upgrades
	* @private
	*/
	_filterUpgrades(upgrades) {
		const filteredUpgrades = [];
		for (let i = 0; i < upgrades.length; i++) if (~this.transports.indexOf(upgrades[i])) filteredUpgrades.push(upgrades[i]);
		return filteredUpgrades;
	}
};
/**
* This class provides a WebSocket-like interface to connect to an Engine.IO server. The connection will be established
* with one of the available low-level transports, like HTTP long-polling, WebSocket or WebTransport.
*
* This class comes with an upgrade mechanism, which means that once the connection is established with the first
* low-level transport, it will try to upgrade to a better transport.
*
* @example
* import { Socket } from "engine.io-client";
*
* const socket = new Socket();
*
* socket.on("open", () => {
*   socket.send("hello");
* });
*
* @see SocketWithoutUpgrade
* @see SocketWithUpgrade
*/
var Socket$1 = class extends SocketWithUpgrade {
	constructor(uri, opts = {}) {
		const isOptionsOnly = typeof uri === "object";
		const o = isOptionsOnly ? { ...uri } : { ...opts };
		if (!o.transports || o.transports && typeof o.transports[0] === "string") o.transports = (o.transports || [
			"polling",
			"websocket",
			"webtransport"
		]).map((transportName) => transports[transportName]).filter((t) => !!t);
		super(isOptionsOnly ? o : uri, o);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/engine.io-client@6.6.6_supports-color@10.2.2/node_modules/engine.io-client/build/esm/index.js
const protocol$1 = Socket$1.protocol;

//#endregion
//#region ../../node_modules/.pnpm/socket.io-client@4.8.3_supports-color@10.2.2/node_modules/socket.io-client/build/esm/url.js
/**
* URL parser.
*
* @param uri - url
* @param path - the request path of the connection
* @param loc - An object meant to mimic window.location.
*        Defaults to window.location.
* @public
*/
function url(uri, path = "", loc) {
	let obj = uri;
	loc = loc || typeof location !== "undefined" && location;
	if (null == uri) uri = loc.protocol + "//" + loc.host;
	if (typeof uri === "string") {
		if ("/" === uri.charAt(0)) {
			if ("/" === uri.charAt(1)) uri = loc.protocol + uri;
			else uri = loc.host + uri;
		}
		if (!/^(https?|wss?):\/\//.test(uri)) {
			if ("undefined" !== typeof loc) uri = loc.protocol + "//" + uri;
			else uri = "https://" + uri;
		}
		obj = parse(uri);
	}
	if (!obj.port) {
		if (/^(http|ws)$/.test(obj.protocol)) obj.port = "80";
		else if (/^(http|ws)s$/.test(obj.protocol)) obj.port = "443";
	}
	obj.path = obj.path || "/";
	const host = obj.host.indexOf(":") !== -1 ? "[" + obj.host + "]" : obj.host;
	obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
	obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
	return obj;
}

//#endregion
//#region ../../node_modules/.pnpm/socket.io-parser@4.2.7_supports-color@10.2.2/node_modules/socket.io-parser/build/esm/is-binary.js
const withNativeArrayBuffer = typeof ArrayBuffer === "function";
const isView = (obj) => {
	return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
};
const toString = Object.prototype.toString;
const withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
const withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
/**
* Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
*
* @private
*/
function isBinary(obj) {
	return withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)) || withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File;
}
function hasBinary(obj, toJSON) {
	if (!obj || typeof obj !== "object") return false;
	if (Array.isArray(obj)) {
		for (let i = 0, l = obj.length; i < l; i++) if (hasBinary(obj[i])) return true;
		return false;
	}
	if (isBinary(obj)) return true;
	if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) return hasBinary(obj.toJSON(), true);
	for (const key in obj) if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) return true;
	return false;
}

//#endregion
//#region ../../node_modules/.pnpm/socket.io-parser@4.2.7_supports-color@10.2.2/node_modules/socket.io-parser/build/esm/binary.js
/**
* Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
*
* @param {Object} packet - socket.io event packet
* @return {Object} with deconstructed packet and list of buffers
* @public
*/
function deconstructPacket(packet) {
	const buffers = [];
	const packetData = packet.data;
	const pack = packet;
	pack.data = _deconstructPacket(packetData, buffers);
	pack.attachments = buffers.length;
	return {
		packet: pack,
		buffers
	};
}
function _deconstructPacket(data, buffers, toJSON) {
	if (!data) return data;
	if (isBinary(data)) {
		const placeholder = {
			_placeholder: true,
			num: buffers.length
		};
		buffers.push(data);
		return placeholder;
	} else if (Array.isArray(data)) {
		const newData = new Array(data.length);
		for (let i = 0; i < data.length; i++) newData[i] = _deconstructPacket(data[i], buffers);
		return newData;
	} else if (typeof data === "object" && !(data instanceof Date)) {
		if (data.toJSON && typeof data.toJSON === "function" && !toJSON) return _deconstructPacket(data.toJSON(), buffers, true);
		const newData = {};
		for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) newData[key] = _deconstructPacket(data[key], buffers);
		return newData;
	}
	return data;
}
/**
* Reconstructs a binary packet from its placeholder packet and buffers
*
* @param {Object} packet - event packet with placeholders
* @param {Array} buffers - binary buffers to put in placeholder positions
* @return {Object} reconstructed packet
* @public
*/
function reconstructPacket(packet, buffers) {
	packet.data = _reconstructPacket(packet.data, buffers);
	delete packet.attachments;
	return packet;
}
function _reconstructPacket(data, buffers) {
	if (!data) return data;
	if (data && data._placeholder === true) {
		if (typeof data.num === "number" && data.num >= 0 && data.num < buffers.length) return buffers[data.num];
		else throw new Error("illegal attachments");
	} else if (Array.isArray(data)) for (let i = 0; i < data.length; i++) data[i] = _reconstructPacket(data[i], buffers);
	else if (typeof data === "object") {
		for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) data[key] = _reconstructPacket(data[key], buffers);
	}
	return data;
}

//#endregion
//#region ../../node_modules/.pnpm/socket.io-parser@4.2.7_supports-color@10.2.2/node_modules/socket.io-parser/build/esm/index.js
var esm_exports = /* @__PURE__ */ __exportAll({
	Decoder: () => Decoder,
	Encoder: () => Encoder,
	PacketType: () => PacketType,
	isPacketValid: () => isPacketValid,
	protocol: () => 5
});
/**
* These strings must not be used as event names, as they have a special meaning.
*/
const RESERVED_EVENTS$1 = [
	"connect",
	"connect_error",
	"disconnect",
	"disconnecting",
	"newListener",
	"removeListener"
];
/**
* Protocol version.
*
* @public
*/
const protocol = 5;
var PacketType;
(function(PacketType) {
	PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
	PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
	PacketType[PacketType["EVENT"] = 2] = "EVENT";
	PacketType[PacketType["ACK"] = 3] = "ACK";
	PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
	PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
	PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType || (PacketType = {}));
/**
* A socket.io Encoder instance
*/
var Encoder = class {
	/**
	* Encoder constructor
	*
	* @param {function} replacer - custom replacer to pass down to JSON.parse
	*/
	constructor(replacer) {
		this.replacer = replacer;
	}
	/**
	* Encode a packet as a single string if non-binary, or as a
	* buffer sequence, depending on packet type.
	*
	* @param {Object} obj - packet object
	*/
	encode(obj) {
		if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
			if (hasBinary(obj)) return this.encodeAsBinary({
				type: obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK,
				nsp: obj.nsp,
				data: obj.data,
				id: obj.id
			});
		}
		return [this.encodeAsString(obj)];
	}
	/**
	* Encode packet as string.
	*/
	encodeAsString(obj) {
		let str = "" + obj.type;
		if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) str += obj.attachments + "-";
		if (obj.nsp && "/" !== obj.nsp) str += obj.nsp + ",";
		if (null != obj.id) str += obj.id;
		if (null != obj.data) str += JSON.stringify(obj.data, this.replacer);
		return str;
	}
	/**
	* Encode packet as 'buffer sequence' by removing blobs, and
	* deconstructing packet into object with placeholders and
	* a list of buffers.
	*/
	encodeAsBinary(obj) {
		const deconstruction = deconstructPacket(obj);
		const pack = this.encodeAsString(deconstruction.packet);
		const buffers = deconstruction.buffers;
		buffers.unshift(pack);
		return buffers;
	}
};
/**
* A socket.io Decoder instance
*
* @return {Object} decoder
*/
var Decoder = class Decoder extends Emitter {
	/**
	* Decoder constructor
	*/
	constructor(opts) {
		super();
		this.opts = Object.assign({
			reviver: void 0,
			maxAttachments: 10
		}, typeof opts === "function" ? { reviver: opts } : opts);
	}
	/**
	* Decodes an encoded packet string into packet JSON.
	*
	* @param {String} obj - encoded packet
	*/
	add(obj) {
		let packet;
		if (typeof obj === "string") {
			if (this.reconstructor) throw new Error("got plaintext data when reconstructing a packet");
			packet = this.decodeString(obj);
			const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
			if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
				packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
				this.reconstructor = new BinaryReconstructor(packet);
			} else super.emitReserved("decoded", packet);
		} else if (isBinary(obj) || obj.base64) {
			if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
			else {
				packet = this.reconstructor.takeBinaryData(obj);
				if (packet) {
					this.reconstructor = null;
					super.emitReserved("decoded", packet);
				}
			}
		} else throw new Error("Unknown type: " + obj);
	}
	/**
	* Decode a packet String (JSON data)
	*
	* @param {String} str
	* @return {Object} packet
	*/
	decodeString(str) {
		let i = 0;
		const p = { type: Number(str.charAt(0)) };
		if (PacketType[p.type] === void 0) throw new Error("unknown packet type " + p.type);
		if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
			const start = i + 1;
			while (str.charAt(++i) !== "-" && i != str.length);
			const buf = str.substring(start, i);
			if (buf != Number(buf) || str.charAt(i) !== "-") throw new Error("Illegal attachments");
			const n = Number(buf);
			if (!isInteger(n) || n < 1) throw new Error("Illegal attachments");
			else if (n > this.opts.maxAttachments) throw new Error("too many attachments");
			p.attachments = n;
		}
		if ("/" === str.charAt(i + 1)) {
			const start = i + 1;
			while (++i) {
				if ("," === str.charAt(i)) break;
				if (i === str.length) break;
			}
			p.nsp = str.substring(start, i);
		} else p.nsp = "/";
		const next = str.charAt(i + 1);
		if ("" !== next && Number(next) == next) {
			const start = i + 1;
			while (++i) {
				const c = str.charAt(i);
				if (null == c || Number(c) != c) {
					--i;
					break;
				}
				if (i === str.length) break;
			}
			p.id = Number(str.substring(start, i + 1));
		}
		if (str.charAt(++i)) {
			const payload = this.tryParse(str.substr(i));
			if (Decoder.isPayloadValid(p.type, payload)) p.data = payload;
			else throw new Error("invalid payload");
		}
		return p;
	}
	tryParse(str) {
		try {
			return JSON.parse(str, this.opts.reviver);
		} catch (e) {
			return false;
		}
	}
	static isPayloadValid(type, payload) {
		switch (type) {
			case PacketType.CONNECT: return isObject$1(payload);
			case PacketType.DISCONNECT: return payload === void 0;
			case PacketType.CONNECT_ERROR: return typeof payload === "string" || isObject$1(payload);
			case PacketType.EVENT:
			case PacketType.BINARY_EVENT: return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS$1.indexOf(payload[0]) === -1);
			case PacketType.ACK:
			case PacketType.BINARY_ACK: return Array.isArray(payload);
		}
	}
	/**
	* Deallocates a parser's resources
	*/
	destroy() {
		if (this.reconstructor) {
			this.reconstructor.finishedReconstruction();
			this.reconstructor = null;
		}
	}
};
/**
* A manager of a binary event's 'buffer sequence'. Should
* be constructed whenever a packet of type BINARY_EVENT is
* decoded.
*
* @param {Object} packet
* @return {BinaryReconstructor} initialized reconstructor
*/
var BinaryReconstructor = class {
	constructor(packet) {
		this.packet = packet;
		this.buffers = [];
		this.reconPack = packet;
	}
	/**
	* Method to be called when binary data received from connection
	* after a BINARY_EVENT packet.
	*
	* @param {Buffer | ArrayBuffer} binData - the raw binary data received
	* @return {null | Object} returns null if more binary data is expected or
	*   a reconstructed packet object if all buffers have been received.
	*/
	takeBinaryData(binData) {
		this.buffers.push(binData);
		if (this.buffers.length === this.reconPack.attachments) {
			const packet = reconstructPacket(this.reconPack, this.buffers);
			this.finishedReconstruction();
			return packet;
		}
		return null;
	}
	/**
	* Cleans up binary packet reconstruction variables.
	*/
	finishedReconstruction() {
		this.reconPack = null;
		this.buffers = [];
	}
};
function isNamespaceValid(nsp) {
	return typeof nsp === "string";
}
const isInteger = Number.isInteger || function(value) {
	return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};
function isAckIdValid(id) {
	return id === void 0 || isInteger(id);
}
function isObject$1(value) {
	return Object.prototype.toString.call(value) === "[object Object]";
}
function isDataValid(type, payload) {
	switch (type) {
		case PacketType.CONNECT: return payload === void 0 || isObject$1(payload);
		case PacketType.DISCONNECT: return payload === void 0;
		case PacketType.EVENT: return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS$1.indexOf(payload[0]) === -1);
		case PacketType.ACK: return Array.isArray(payload);
		case PacketType.CONNECT_ERROR: return typeof payload === "string" || isObject$1(payload);
		default: return false;
	}
}
function isPacketValid(packet) {
	return isNamespaceValid(packet.nsp) && isAckIdValid(packet.id) && isDataValid(packet.type, packet.data);
}

//#endregion
//#region ../../node_modules/.pnpm/socket.io-client@4.8.3_supports-color@10.2.2/node_modules/socket.io-client/build/esm/on.js
function on(obj, ev, fn) {
	obj.on(ev, fn);
	return function subDestroy() {
		obj.off(ev, fn);
	};
}

//#endregion
//#region ../../node_modules/.pnpm/socket.io-client@4.8.3_supports-color@10.2.2/node_modules/socket.io-client/build/esm/socket.js
/**
* Internal events.
* These events can't be emitted by the user.
*/
const RESERVED_EVENTS = Object.freeze({
	connect: 1,
	connect_error: 1,
	disconnect: 1,
	disconnecting: 1,
	newListener: 1,
	removeListener: 1
});
/**
* A Socket is the fundamental class for interacting with the server.
*
* A Socket belongs to a certain Namespace (by default /) and uses an underlying {@link Manager} to communicate.
*
* @example
* const socket = io();
*
* socket.on("connect", () => {
*   console.log("connected");
* });
*
* // send an event to the server
* socket.emit("foo", "bar");
*
* socket.on("foobar", () => {
*   // an event was received from the server
* });
*
* // upon disconnection
* socket.on("disconnect", (reason) => {
*   console.log(`disconnected due to ${reason}`);
* });
*/
var Socket = class extends Emitter {
	/**
	* `Socket` constructor.
	*/
	constructor(io, nsp, opts) {
		super();
		/**
		* Whether the socket is currently connected to the server.
		*
		* @example
		* const socket = io();
		*
		* socket.on("connect", () => {
		*   console.log(socket.connected); // true
		* });
		*
		* socket.on("disconnect", () => {
		*   console.log(socket.connected); // false
		* });
		*/
		this.connected = false;
		/**
		* Whether the connection state was recovered after a temporary disconnection. In that case, any missed packets will
		* be transmitted by the server.
		*/
		this.recovered = false;
		/**
		* Buffer for packets received before the CONNECT packet
		*/
		this.receiveBuffer = [];
		/**
		* Buffer for packets that will be sent once the socket is connected
		*/
		this.sendBuffer = [];
		/**
		* The queue of packets to be sent with retry in case of failure.
		*
		* Packets are sent one by one, each waiting for the server acknowledgement, in order to guarantee the delivery order.
		* @private
		*/
		this._queue = [];
		/**
		* A sequence to generate the ID of the {@link QueuedPacket}.
		* @private
		*/
		this._queueSeq = 0;
		this.ids = 0;
		/**
		* A map containing acknowledgement handlers.
		*
		* The `withError` attribute is used to differentiate handlers that accept an error as first argument:
		*
		* - `socket.emit("test", (err, value) => { ... })` with `ackTimeout` option
		* - `socket.timeout(5000).emit("test", (err, value) => { ... })`
		* - `const value = await socket.emitWithAck("test")`
		*
		* From those that don't:
		*
		* - `socket.emit("test", (value) => { ... });`
		*
		* In the first case, the handlers will be called with an error when:
		*
		* - the timeout is reached
		* - the socket gets disconnected
		*
		* In the second case, the handlers will be simply discarded upon disconnection, since the client will never receive
		* an acknowledgement from the server.
		*
		* @private
		*/
		this.acks = {};
		this.flags = {};
		this.io = io;
		this.nsp = nsp;
		if (opts && opts.auth) this.auth = opts.auth;
		this._opts = Object.assign({}, opts);
		if (this.io._autoConnect) this.open();
	}
	/**
	* Whether the socket is currently disconnected
	*
	* @example
	* const socket = io();
	*
	* socket.on("connect", () => {
	*   console.log(socket.disconnected); // false
	* });
	*
	* socket.on("disconnect", () => {
	*   console.log(socket.disconnected); // true
	* });
	*/
	get disconnected() {
		return !this.connected;
	}
	/**
	* Subscribe to open, close and packet events
	*
	* @private
	*/
	subEvents() {
		if (this.subs) return;
		const io = this.io;
		this.subs = [
			on(io, "open", this.onopen.bind(this)),
			on(io, "packet", this.onpacket.bind(this)),
			on(io, "error", this.onerror.bind(this)),
			on(io, "close", this.onclose.bind(this))
		];
	}
	/**
	* Whether the Socket will try to reconnect when its Manager connects or reconnects.
	*
	* @example
	* const socket = io();
	*
	* console.log(socket.active); // true
	*
	* socket.on("disconnect", (reason) => {
	*   if (reason === "io server disconnect") {
	*     // the disconnection was initiated by the server, you need to manually reconnect
	*     console.log(socket.active); // false
	*   }
	*   // else the socket will automatically try to reconnect
	*   console.log(socket.active); // true
	* });
	*/
	get active() {
		return !!this.subs;
	}
	/**
	* "Opens" the socket.
	*
	* @example
	* const socket = io({
	*   autoConnect: false
	* });
	*
	* socket.connect();
	*/
	connect() {
		if (this.connected) return this;
		this.subEvents();
		if (!this.io["_reconnecting"]) this.io.open();
		if ("open" === this.io._readyState) this.onopen();
		return this;
	}
	/**
	* Alias for {@link connect()}.
	*/
	open() {
		return this.connect();
	}
	/**
	* Sends a `message` event.
	*
	* This method mimics the WebSocket.send() method.
	*
	* @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
	*
	* @example
	* socket.send("hello");
	*
	* // this is equivalent to
	* socket.emit("message", "hello");
	*
	* @return self
	*/
	send(...args) {
		args.unshift("message");
		this.emit.apply(this, args);
		return this;
	}
	/**
	* Override `emit`.
	* If the event is in `events`, it's emitted normally.
	*
	* @example
	* socket.emit("hello", "world");
	*
	* // all serializable datastructures are supported (no need to call JSON.stringify)
	* socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
	*
	* // with an acknowledgement from the server
	* socket.emit("hello", "world", (val) => {
	*   // ...
	* });
	*
	* @return self
	*/
	emit(ev, ...args) {
		var _a, _b, _c;
		if (RESERVED_EVENTS.hasOwnProperty(ev)) throw new Error("\"" + ev.toString() + "\" is a reserved event name");
		args.unshift(ev);
		if (this._opts.retries && !this.flags.fromQueue && !this.flags.volatile) {
			this._addToQueue(args);
			return this;
		}
		const packet = {
			type: PacketType.EVENT,
			data: args
		};
		packet.options = {};
		packet.options.compress = this.flags.compress !== false;
		if ("function" === typeof args[args.length - 1]) {
			const id = this.ids++;
			const ack = args.pop();
			this._registerAckCallback(id, ack);
			packet.id = id;
		}
		const isTransportWritable = (_b = (_a = this.io.engine) === null || _a === void 0 ? void 0 : _a.transport) === null || _b === void 0 ? void 0 : _b.writable;
		const isConnected = this.connected && !((_c = this.io.engine) === null || _c === void 0 ? void 0 : _c._hasPingExpired());
		if (this.flags.volatile && !isTransportWritable) {} else if (isConnected) {
			this.notifyOutgoingListeners(packet);
			this.packet(packet);
		} else this.sendBuffer.push(packet);
		this.flags = {};
		return this;
	}
	/**
	* @private
	*/
	_registerAckCallback(id, ack) {
		var _a;
		const timeout = (_a = this.flags.timeout) !== null && _a !== void 0 ? _a : this._opts.ackTimeout;
		if (timeout === void 0) {
			this.acks[id] = ack;
			return;
		}
		const timer = this.io.setTimeoutFn(() => {
			delete this.acks[id];
			for (let i = 0; i < this.sendBuffer.length; i++) if (this.sendBuffer[i].id === id) this.sendBuffer.splice(i, 1);
			ack.call(this, /* @__PURE__ */ new Error("operation has timed out"));
		}, timeout);
		const fn = (...args) => {
			this.io.clearTimeoutFn(timer);
			ack.apply(this, args);
		};
		fn.withError = true;
		this.acks[id] = fn;
	}
	/**
	* Emits an event and waits for an acknowledgement
	*
	* @example
	* // without timeout
	* const response = await socket.emitWithAck("hello", "world");
	*
	* // with a specific timeout
	* try {
	*   const response = await socket.timeout(1000).emitWithAck("hello", "world");
	* } catch (err) {
	*   // the server did not acknowledge the event in the given delay
	* }
	*
	* @return a Promise that will be fulfilled when the server acknowledges the event
	*/
	emitWithAck(ev, ...args) {
		return new Promise((resolve, reject) => {
			const fn = (arg1, arg2) => {
				return arg1 ? reject(arg1) : resolve(arg2);
			};
			fn.withError = true;
			args.push(fn);
			this.emit(ev, ...args);
		});
	}
	/**
	* Add the packet to the queue.
	* @param args
	* @private
	*/
	_addToQueue(args) {
		let ack;
		if (typeof args[args.length - 1] === "function") ack = args.pop();
		const packet = {
			id: this._queueSeq++,
			tryCount: 0,
			pending: false,
			args,
			flags: Object.assign({ fromQueue: true }, this.flags)
		};
		args.push((err, ...responseArgs) => {
			if (packet !== this._queue[0]) {}
			if (err !== null) {
				if (packet.tryCount > this._opts.retries) {
					this._queue.shift();
					if (ack) ack(err);
				}
			} else {
				this._queue.shift();
				if (ack) ack(null, ...responseArgs);
			}
			packet.pending = false;
			return this._drainQueue();
		});
		this._queue.push(packet);
		this._drainQueue();
	}
	/**
	* Send the first packet of the queue, and wait for an acknowledgement from the server.
	* @param force - whether to resend a packet that has not been acknowledged yet
	*
	* @private
	*/
	_drainQueue(force = false) {
		if (!this.connected || this._queue.length === 0) return;
		const packet = this._queue[0];
		if (packet.pending && !force) return;
		packet.pending = true;
		packet.tryCount++;
		this.flags = packet.flags;
		this.emit.apply(this, packet.args);
	}
	/**
	* Sends a packet.
	*
	* @param packet
	* @private
	*/
	packet(packet) {
		packet.nsp = this.nsp;
		this.io._packet(packet);
	}
	/**
	* Called upon engine `open`.
	*
	* @private
	*/
	onopen() {
		if (typeof this.auth == "function") this.auth((data) => {
			this._sendConnectPacket(data);
		});
		else this._sendConnectPacket(this.auth);
	}
	/**
	* Sends a CONNECT packet to initiate the Socket.IO session.
	*
	* @param data
	* @private
	*/
	_sendConnectPacket(data) {
		this.packet({
			type: PacketType.CONNECT,
			data: this._pid ? Object.assign({
				pid: this._pid,
				offset: this._lastOffset
			}, data) : data
		});
	}
	/**
	* Called upon engine or manager `error`.
	*
	* @param err
	* @private
	*/
	onerror(err) {
		if (!this.connected) this.emitReserved("connect_error", err);
	}
	/**
	* Called upon engine `close`.
	*
	* @param reason
	* @param description
	* @private
	*/
	onclose(reason, description) {
		this.connected = false;
		delete this.id;
		this.emitReserved("disconnect", reason, description);
		this._clearAcks();
	}
	/**
	* Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
	* the server.
	*
	* @private
	*/
	_clearAcks() {
		Object.keys(this.acks).forEach((id) => {
			if (!this.sendBuffer.some((packet) => String(packet.id) === id)) {
				const ack = this.acks[id];
				delete this.acks[id];
				if (ack.withError) ack.call(this, /* @__PURE__ */ new Error("socket has been disconnected"));
			}
		});
	}
	/**
	* Called with socket packet.
	*
	* @param packet
	* @private
	*/
	onpacket(packet) {
		if (!(packet.nsp === this.nsp)) return;
		switch (packet.type) {
			case PacketType.CONNECT:
				if (packet.data && packet.data.sid) this.onconnect(packet.data.sid, packet.data.pid);
				else this.emitReserved("connect_error", /* @__PURE__ */ new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
				break;
			case PacketType.EVENT:
			case PacketType.BINARY_EVENT:
				this.onevent(packet);
				break;
			case PacketType.ACK:
			case PacketType.BINARY_ACK:
				this.onack(packet);
				break;
			case PacketType.DISCONNECT:
				this.ondisconnect();
				break;
			case PacketType.CONNECT_ERROR:
				this.destroy();
				const err = new Error(packet.data.message);
				err.data = packet.data.data;
				this.emitReserved("connect_error", err);
		}
	}
	/**
	* Called upon a server event.
	*
	* @param packet
	* @private
	*/
	onevent(packet) {
		const args = packet.data || [];
		if (null != packet.id) args.push(this.ack(packet.id));
		if (this.connected) this.emitEvent(args);
		else this.receiveBuffer.push(Object.freeze(args));
	}
	emitEvent(args) {
		if (this._anyListeners && this._anyListeners.length) {
			const listeners = this._anyListeners.slice();
			for (const listener of listeners) listener.apply(this, args);
		}
		super.emit.apply(this, args);
		if (this._pid && args.length && typeof args[args.length - 1] === "string") this._lastOffset = args[args.length - 1];
	}
	/**
	* Produces an ack callback to emit with an event.
	*
	* @private
	*/
	ack(id) {
		const self = this;
		let sent = false;
		return function(...args) {
			if (sent) return;
			sent = true;
			self.packet({
				type: PacketType.ACK,
				id,
				data: args
			});
		};
	}
	/**
	* Called upon a server acknowledgement.
	*
	* @param packet
	* @private
	*/
	onack(packet) {
		const ack = this.acks[packet.id];
		if (typeof ack !== "function") return;
		delete this.acks[packet.id];
		if (ack.withError) packet.data.unshift(null);
		ack.apply(this, packet.data);
	}
	/**
	* Called upon server connect.
	*
	* @private
	*/
	onconnect(id, pid) {
		this.id = id;
		this.recovered = pid && this._pid === pid;
		this._pid = pid;
		this.connected = true;
		this.emitBuffered();
		this._drainQueue(true);
		this.emitReserved("connect");
	}
	/**
	* Emit buffered events (received and emitted).
	*
	* @private
	*/
	emitBuffered() {
		this.receiveBuffer.forEach((args) => this.emitEvent(args));
		this.receiveBuffer = [];
		this.sendBuffer.forEach((packet) => {
			this.notifyOutgoingListeners(packet);
			this.packet(packet);
		});
		this.sendBuffer = [];
	}
	/**
	* Called upon server disconnect.
	*
	* @private
	*/
	ondisconnect() {
		this.destroy();
		this.onclose("io server disconnect");
	}
	/**
	* Called upon forced client/server side disconnections,
	* this method ensures the manager stops tracking us and
	* that reconnections don't get triggered for this.
	*
	* @private
	*/
	destroy() {
		if (this.subs) {
			this.subs.forEach((subDestroy) => subDestroy());
			this.subs = void 0;
		}
		this.io["_destroy"](this);
	}
	/**
	* Disconnects the socket manually. In that case, the socket will not try to reconnect.
	*
	* If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
	*
	* @example
	* const socket = io();
	*
	* socket.on("disconnect", (reason) => {
	*   // console.log(reason); prints "io client disconnect"
	* });
	*
	* socket.disconnect();
	*
	* @return self
	*/
	disconnect() {
		if (this.connected) this.packet({ type: PacketType.DISCONNECT });
		this.destroy();
		if (this.connected) this.onclose("io client disconnect");
		return this;
	}
	/**
	* Alias for {@link disconnect()}.
	*
	* @return self
	*/
	close() {
		return this.disconnect();
	}
	/**
	* Sets the compress flag.
	*
	* @example
	* socket.compress(false).emit("hello");
	*
	* @param compress - if `true`, compresses the sending data
	* @return self
	*/
	compress(compress) {
		this.flags.compress = compress;
		return this;
	}
	/**
	* Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
	* ready to send messages.
	*
	* @example
	* socket.volatile.emit("hello"); // the server may or may not receive it
	*
	* @returns self
	*/
	get volatile() {
		this.flags.volatile = true;
		return this;
	}
	/**
	* Sets a modifier for a subsequent event emission that the callback will be called with an error when the
	* given number of milliseconds have elapsed without an acknowledgement from the server:
	*
	* @example
	* socket.timeout(5000).emit("my-event", (err) => {
	*   if (err) {
	*     // the server did not acknowledge the event in the given delay
	*   }
	* });
	*
	* @returns self
	*/
	timeout(timeout) {
		this.flags.timeout = timeout;
		return this;
	}
	/**
	* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
	* callback.
	*
	* @example
	* socket.onAny((event, ...args) => {
	*   console.log(`got ${event}`);
	* });
	*
	* @param listener
	*/
	onAny(listener) {
		this._anyListeners = this._anyListeners || [];
		this._anyListeners.push(listener);
		return this;
	}
	/**
	* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
	* callback. The listener is added to the beginning of the listeners array.
	*
	* @example
	* socket.prependAny((event, ...args) => {
	*   console.log(`got event ${event}`);
	* });
	*
	* @param listener
	*/
	prependAny(listener) {
		this._anyListeners = this._anyListeners || [];
		this._anyListeners.unshift(listener);
		return this;
	}
	/**
	* Removes the listener that will be fired when any event is emitted.
	*
	* @example
	* const catchAllListener = (event, ...args) => {
	*   console.log(`got event ${event}`);
	* }
	*
	* socket.onAny(catchAllListener);
	*
	* // remove a specific listener
	* socket.offAny(catchAllListener);
	*
	* // or remove all listeners
	* socket.offAny();
	*
	* @param listener
	*/
	offAny(listener) {
		if (!this._anyListeners) return this;
		if (listener) {
			const listeners = this._anyListeners;
			for (let i = 0; i < listeners.length; i++) if (listener === listeners[i]) {
				listeners.splice(i, 1);
				return this;
			}
		} else this._anyListeners = [];
		return this;
	}
	/**
	* Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
	* e.g. to remove listeners.
	*/
	listenersAny() {
		return this._anyListeners || [];
	}
	/**
	* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
	* callback.
	*
	* Note: acknowledgements sent to the server are not included.
	*
	* @example
	* socket.onAnyOutgoing((event, ...args) => {
	*   console.log(`sent event ${event}`);
	* });
	*
	* @param listener
	*/
	onAnyOutgoing(listener) {
		this._anyOutgoingListeners = this._anyOutgoingListeners || [];
		this._anyOutgoingListeners.push(listener);
		return this;
	}
	/**
	* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
	* callback. The listener is added to the beginning of the listeners array.
	*
	* Note: acknowledgements sent to the server are not included.
	*
	* @example
	* socket.prependAnyOutgoing((event, ...args) => {
	*   console.log(`sent event ${event}`);
	* });
	*
	* @param listener
	*/
	prependAnyOutgoing(listener) {
		this._anyOutgoingListeners = this._anyOutgoingListeners || [];
		this._anyOutgoingListeners.unshift(listener);
		return this;
	}
	/**
	* Removes the listener that will be fired when any event is emitted.
	*
	* @example
	* const catchAllListener = (event, ...args) => {
	*   console.log(`sent event ${event}`);
	* }
	*
	* socket.onAnyOutgoing(catchAllListener);
	*
	* // remove a specific listener
	* socket.offAnyOutgoing(catchAllListener);
	*
	* // or remove all listeners
	* socket.offAnyOutgoing();
	*
	* @param [listener] - the catch-all listener (optional)
	*/
	offAnyOutgoing(listener) {
		if (!this._anyOutgoingListeners) return this;
		if (listener) {
			const listeners = this._anyOutgoingListeners;
			for (let i = 0; i < listeners.length; i++) if (listener === listeners[i]) {
				listeners.splice(i, 1);
				return this;
			}
		} else this._anyOutgoingListeners = [];
		return this;
	}
	/**
	* Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
	* e.g. to remove listeners.
	*/
	listenersAnyOutgoing() {
		return this._anyOutgoingListeners || [];
	}
	/**
	* Notify the listeners for each packet sent
	*
	* @param packet
	*
	* @private
	*/
	notifyOutgoingListeners(packet) {
		if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
			const listeners = this._anyOutgoingListeners.slice();
			for (const listener of listeners) listener.apply(this, packet.data);
		}
	}
};

//#endregion
//#region ../../node_modules/.pnpm/socket.io-client@4.8.3_supports-color@10.2.2/node_modules/socket.io-client/build/esm/contrib/backo2.js
/**
* Initialize backoff timer with `opts`.
*
* - `min` initial timeout in milliseconds [100]
* - `max` max timeout [10000]
* - `jitter` [0]
* - `factor` [2]
*
* @param {Object} opts
* @api public
*/
function Backoff(opts) {
	opts = opts || {};
	this.ms = opts.min || 100;
	this.max = opts.max || 1e4;
	this.factor = opts.factor || 2;
	this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
	this.attempts = 0;
}
/**
* Return the backoff duration.
*
* @return {Number}
* @api public
*/
Backoff.prototype.duration = function() {
	var ms = this.ms * Math.pow(this.factor, this.attempts++);
	if (this.jitter) {
		var rand = Math.random();
		var deviation = Math.floor(rand * this.jitter * ms);
		ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
	}
	return Math.min(ms, this.max) | 0;
};
/**
* Reset the number of attempts.
*
* @api public
*/
Backoff.prototype.reset = function() {
	this.attempts = 0;
};
/**
* Set the minimum duration
*
* @api public
*/
Backoff.prototype.setMin = function(min) {
	this.ms = min;
};
/**
* Set the maximum duration
*
* @api public
*/
Backoff.prototype.setMax = function(max) {
	this.max = max;
};
/**
* Set the jitter
*
* @api public
*/
Backoff.prototype.setJitter = function(jitter) {
	this.jitter = jitter;
};

//#endregion
//#region ../../node_modules/.pnpm/socket.io-client@4.8.3_supports-color@10.2.2/node_modules/socket.io-client/build/esm/manager.js
var Manager = class extends Emitter {
	constructor(uri, opts) {
		var _a;
		super();
		this.nsps = {};
		this.subs = [];
		if (uri && "object" === typeof uri) {
			opts = uri;
			uri = void 0;
		}
		opts = opts || {};
		opts.path = opts.path || "/socket.io";
		this.opts = opts;
		installTimerFunctions(this, opts);
		this.reconnection(opts.reconnection !== false);
		this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
		this.reconnectionDelay(opts.reconnectionDelay || 1e3);
		this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
		this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : .5);
		this.backoff = new Backoff({
			min: this.reconnectionDelay(),
			max: this.reconnectionDelayMax(),
			jitter: this.randomizationFactor()
		});
		this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
		this._readyState = "closed";
		this.uri = uri;
		const _parser = opts.parser || esm_exports;
		this.encoder = new _parser.Encoder();
		this.decoder = new _parser.Decoder();
		this._autoConnect = opts.autoConnect !== false;
		if (this._autoConnect) this.open();
	}
	reconnection(v) {
		if (!arguments.length) return this._reconnection;
		this._reconnection = !!v;
		if (!v) this.skipReconnect = true;
		return this;
	}
	reconnectionAttempts(v) {
		if (v === void 0) return this._reconnectionAttempts;
		this._reconnectionAttempts = v;
		return this;
	}
	reconnectionDelay(v) {
		var _a;
		if (v === void 0) return this._reconnectionDelay;
		this._reconnectionDelay = v;
		(_a = this.backoff) === null || _a === void 0 || _a.setMin(v);
		return this;
	}
	randomizationFactor(v) {
		var _a;
		if (v === void 0) return this._randomizationFactor;
		this._randomizationFactor = v;
		(_a = this.backoff) === null || _a === void 0 || _a.setJitter(v);
		return this;
	}
	reconnectionDelayMax(v) {
		var _a;
		if (v === void 0) return this._reconnectionDelayMax;
		this._reconnectionDelayMax = v;
		(_a = this.backoff) === null || _a === void 0 || _a.setMax(v);
		return this;
	}
	timeout(v) {
		if (!arguments.length) return this._timeout;
		this._timeout = v;
		return this;
	}
	/**
	* Starts trying to reconnect if reconnection is enabled and we have not
	* started reconnecting yet
	*
	* @private
	*/
	maybeReconnectOnOpen() {
		if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) this.reconnect();
	}
	/**
	* Sets the current transport `socket`.
	*
	* @param {Function} fn - optional, callback
	* @return self
	* @public
	*/
	open(fn) {
		if (~this._readyState.indexOf("open")) return this;
		this.engine = new Socket$1(this.uri, this.opts);
		const socket = this.engine;
		const self = this;
		this._readyState = "opening";
		this.skipReconnect = false;
		const openSubDestroy = on(socket, "open", function() {
			self.onopen();
			fn && fn();
		});
		const onError = (err) => {
			this.cleanup();
			this._readyState = "closed";
			this.emitReserved("error", err);
			if (fn) fn(err);
			else this.maybeReconnectOnOpen();
		};
		const errorSub = on(socket, "error", onError);
		if (false !== this._timeout) {
			const timeout = this._timeout;
			const timer = this.setTimeoutFn(() => {
				openSubDestroy();
				onError(/* @__PURE__ */ new Error("timeout"));
				socket.close();
			}, timeout);
			if (this.opts.autoUnref) timer.unref();
			this.subs.push(() => {
				this.clearTimeoutFn(timer);
			});
		}
		this.subs.push(openSubDestroy);
		this.subs.push(errorSub);
		return this;
	}
	/**
	* Alias for open()
	*
	* @return self
	* @public
	*/
	connect(fn) {
		return this.open(fn);
	}
	/**
	* Called upon transport open.
	*
	* @private
	*/
	onopen() {
		this.cleanup();
		this._readyState = "open";
		this.emitReserved("open");
		const socket = this.engine;
		this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
	}
	/**
	* Called upon a ping.
	*
	* @private
	*/
	onping() {
		this.emitReserved("ping");
	}
	/**
	* Called with data.
	*
	* @private
	*/
	ondata(data) {
		try {
			this.decoder.add(data);
		} catch (e) {
			this.onclose("parse error", e);
		}
	}
	/**
	* Called when parser fully decodes a packet.
	*
	* @private
	*/
	ondecoded(packet) {
		nextTick(() => {
			this.emitReserved("packet", packet);
		}, this.setTimeoutFn);
	}
	/**
	* Called upon socket error.
	*
	* @private
	*/
	onerror(err) {
		this.emitReserved("error", err);
	}
	/**
	* Creates a new socket for the given `nsp`.
	*
	* @return {Socket}
	* @public
	*/
	socket(nsp, opts) {
		let socket = this.nsps[nsp];
		if (!socket) {
			socket = new Socket(this, nsp, opts);
			this.nsps[nsp] = socket;
		} else if (this._autoConnect && !socket.active) socket.connect();
		return socket;
	}
	/**
	* Called upon a socket close.
	*
	* @param socket
	* @private
	*/
	_destroy(socket) {
		const nsps = Object.keys(this.nsps);
		for (const nsp of nsps) if (this.nsps[nsp].active) return;
		this._close();
	}
	/**
	* Writes a packet.
	*
	* @param packet
	* @private
	*/
	_packet(packet) {
		const encodedPackets = this.encoder.encode(packet);
		for (let i = 0; i < encodedPackets.length; i++) this.engine.write(encodedPackets[i], packet.options);
	}
	/**
	* Clean up transport subscriptions and packet buffer.
	*
	* @private
	*/
	cleanup() {
		this.subs.forEach((subDestroy) => subDestroy());
		this.subs.length = 0;
		this.decoder.destroy();
	}
	/**
	* Close the current socket.
	*
	* @private
	*/
	_close() {
		this.skipReconnect = true;
		this._reconnecting = false;
		this.onclose("forced close");
	}
	/**
	* Alias for close()
	*
	* @private
	*/
	disconnect() {
		return this._close();
	}
	/**
	* Called when:
	*
	* - the low-level engine is closed
	* - the parser encountered a badly formatted packet
	* - all sockets are disconnected
	*
	* @private
	*/
	onclose(reason, description) {
		var _a;
		this.cleanup();
		(_a = this.engine) === null || _a === void 0 || _a.close();
		this.backoff.reset();
		this._readyState = "closed";
		this.emitReserved("close", reason, description);
		if (this._reconnection && !this.skipReconnect) this.reconnect();
	}
	/**
	* Attempt a reconnection.
	*
	* @private
	*/
	reconnect() {
		if (this._reconnecting || this.skipReconnect) return this;
		const self = this;
		if (this.backoff.attempts >= this._reconnectionAttempts) {
			this.backoff.reset();
			this.emitReserved("reconnect_failed");
			this._reconnecting = false;
		} else {
			const delay = this.backoff.duration();
			this._reconnecting = true;
			const timer = this.setTimeoutFn(() => {
				if (self.skipReconnect) return;
				this.emitReserved("reconnect_attempt", self.backoff.attempts);
				if (self.skipReconnect) return;
				self.open((err) => {
					if (err) {
						self._reconnecting = false;
						self.reconnect();
						this.emitReserved("reconnect_error", err);
					} else self.onreconnect();
				});
			}, delay);
			if (this.opts.autoUnref) timer.unref();
			this.subs.push(() => {
				this.clearTimeoutFn(timer);
			});
		}
	}
	/**
	* Called upon successful reconnect.
	*
	* @private
	*/
	onreconnect() {
		const attempt = this.backoff.attempts;
		this._reconnecting = false;
		this.backoff.reset();
		this.emitReserved("reconnect", attempt);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/socket.io-client@4.8.3_supports-color@10.2.2/node_modules/socket.io-client/build/esm/index.js
/**
* Managers cache.
*/
const cache = {};
function lookup(uri, opts) {
	if (typeof uri === "object") {
		opts = uri;
		uri = void 0;
	}
	opts = opts || {};
	const parsed = url(uri, opts.path || "/socket.io");
	const source = parsed.source;
	const id = parsed.id;
	const path = parsed.path;
	const sameNamespace = cache[id] && path in cache[id]["nsps"];
	const newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
	let io;
	if (newConnection) io = new Manager(source, opts);
	else {
		if (!cache[id]) cache[id] = new Manager(source, opts);
		io = cache[id];
	}
	if (parsed.query && !opts.query) opts.query = parsed.queryKey;
	return io.socket(parsed.path, opts);
}
Object.assign(lookup, {
	Manager,
	Socket,
	io: lookup,
	connect: lookup
});

//#endregion
//#region ../constants/src/index.ts
const REALTIME_EVENTS = {
	SUBSCRIBE: "subscribe",
	UNSUBSCRIBE: "unsubscribe",
	EVENT: "event",
	ERROR: "error"
};

//#endregion
//#region src/realtime/index.ts
function getRealtimeSocketUrl(projectUrl) {
	return `${new URL(projectUrl).origin}/realtime`;
}
var apiDatabaseRealtime = class {
	constructor(projectUrl, apiKey) {
		this.projectUrl = projectUrl;
		this.apiKey = apiKey;
		this.socket = null;
		this.callbacks = /* @__PURE__ */ new Map();
	}
	connect() {
		if (this.socket?.connected) return this.socket;
		this.socket = lookup(getRealtimeSocketUrl(this.projectUrl), {
			auth: { token: this.apiKey },
			transports: ["websocket", "polling"]
		});
		this.socket.on("connect", () => {
			for (const table of this.callbacks.keys()) this.socket?.emit(REALTIME_EVENTS.SUBSCRIBE, table);
		});
		this.socket.on(REALTIME_EVENTS.EVENT, (event) => {
			this.callbacks.get(event.table)?.forEach((cb) => cb(event));
		});
		this.socket.on(REALTIME_EVENTS.ERROR, (msg) => {
			console.error("[apiDatabase-js] realtime error:", msg);
		});
		return this.socket;
	}
	subscribe(table, callback) {
		const socket = this.connect();
		if (!this.callbacks.has(table)) {
			this.callbacks.set(table, /* @__PURE__ */ new Set());
			socket.emit(REALTIME_EVENTS.SUBSCRIBE, table);
		}
		this.callbacks.get(table).add(callback);
		return () => this.unsubscribe(table, callback);
	}
	unsubscribe(table, callback) {
		if (!callback) {
			this.callbacks.delete(table);
			this.socket?.emit(REALTIME_EVENTS.UNSUBSCRIBE, table);
			return;
		}
		const handlers = this.callbacks.get(table);
		if (!handlers) return;
		handlers.delete(callback);
		if (handlers.size === 0) {
			this.callbacks.delete(table);
			this.socket?.emit(REALTIME_EVENTS.UNSUBSCRIBE, table);
		}
	}
	disconnect() {
		this.socket?.disconnect();
		this.socket = null;
		this.callbacks.clear();
	}
};

//#endregion
//#region ../../node_modules/.pnpm/uploadthing@7.7.4_express@5.2.1_supports-color@10.2.2__next@16.2.11_@babel+core@7.29.7__9f81ec92001aa17acea116827f60b1df/node_modules/uploadthing/dist/package-DpScpvTA.js
var version = "7.7.4";

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/Function.js
/**
* Tests if a value is a `function`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isFunction } from "effect/Predicate"
*
* assert.deepStrictEqual(isFunction(isFunction), true)
* assert.deepStrictEqual(isFunction("function"), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isFunction$1 = (input) => typeof input === "function";
/**
* Creates a function that can be used in a data-last (aka `pipe`able) or
* data-first style.
*
* The first parameter to `dual` is either the arity of the uncurried function
* or a predicate that determines if the function is being used in a data-first
* or data-last style.
*
* Using the arity is the most common use case, but there are some cases where
* you may want to use a predicate. For example, if you have a function that
* takes an optional argument, you can use a predicate to determine if the
* function is being used in a data-first or data-last style.
*
* You can pass either the arity of the uncurried function or a predicate
* which determines if the function is being used in a data-first or
* data-last style.
*
* **Example** (Using arity to determine data-first or data-last style)
*
* ```ts
* import { dual, pipe } from "effect/Function"
*
* const sum = dual<
*   (that: number) => (self: number) => number,
*   (self: number, that: number) => number
* >(2, (self, that) => self + that)
*
* console.log(sum(2, 3)) // 5
* console.log(pipe(2, sum(3))) // 5
* ```
*
* **Example** (Using call signatures to define the overloads)
*
* ```ts
* import { dual, pipe } from "effect/Function"
*
* const sum: {
*   (that: number): (self: number) => number
*   (self: number, that: number): number
* } = dual(2, (self: number, that: number): number => self + that)
*
* console.log(sum(2, 3)) // 5
* console.log(pipe(2, sum(3))) // 5
* ```
*
* **Example** (Using a predicate to determine data-first or data-last style)
*
* ```ts
* import { dual, pipe } from "effect/Function"
*
* const sum = dual<
*   (that: number) => (self: number) => number,
*   (self: number, that: number) => number
* >(
*   (args) => args.length === 2,
*   (self, that) => self + that
* )
*
* console.log(sum(2, 3)) // 5
* console.log(pipe(2, sum(3))) // 5
* ```
*
* @since 2.0.0
*/
const dual = function(arity, body) {
	if (typeof arity === "function") return function() {
		if (arity(arguments)) return body.apply(this, arguments);
		return (self) => body(self, ...arguments);
	};
	switch (arity) {
		case 0:
		case 1: throw new RangeError(`Invalid arity ${arity}`);
		case 2: return function(a, b) {
			if (arguments.length >= 2) return body(a, b);
			return function(self) {
				return body(self, a);
			};
		};
		case 3: return function(a, b, c) {
			if (arguments.length >= 3) return body(a, b, c);
			return function(self) {
				return body(self, a, b);
			};
		};
		case 4: return function(a, b, c, d) {
			if (arguments.length >= 4) return body(a, b, c, d);
			return function(self) {
				return body(self, a, b, c);
			};
		};
		case 5: return function(a, b, c, d, e) {
			if (arguments.length >= 5) return body(a, b, c, d, e);
			return function(self) {
				return body(self, a, b, c, d);
			};
		};
		default: return function() {
			if (arguments.length >= arity) return body.apply(this, arguments);
			const args = arguments;
			return function(self) {
				return body(self, ...args);
			};
		};
	}
};
/**
* The identity function, i.e. A function that returns its input argument.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { identity } from "effect/Function"
*
* assert.deepStrictEqual(identity(5), 5)
* ```
*
* @since 2.0.0
*/
const identity = (a) => a;
/**
* Casts the result to the specified type.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { unsafeCoerce, identity } from "effect/Function"
*
* assert.deepStrictEqual(unsafeCoerce, identity)
* ```
*
* @since 2.0.0
*/
const unsafeCoerce = identity;
/**
* Creates a constant value that never changes.
*
* This is useful when you want to pass a value to a higher-order function (a function that takes another function as its argument)
* and want that inner function to always use the same value, no matter how many times it is called.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { constant } from "effect/Function"
*
* const constNull = constant(null)
*
* assert.deepStrictEqual(constNull(), null)
* assert.deepStrictEqual(constNull(), null)
* ```
*
* @since 2.0.0
*/
const constant = (value) => () => value;
/**
* A thunk that returns always `undefined`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { constUndefined } from "effect/Function"
*
* assert.deepStrictEqual(constUndefined(), undefined)
* ```
*
* @since 2.0.0
*/
const constUndefined = /*#__PURE__*/ constant(void 0);
/**
* A thunk that returns always `void`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { constVoid } from "effect/Function"
*
* assert.deepStrictEqual(constVoid(), undefined)
* ```
*
* @since 2.0.0
*/
const constVoid = constUndefined;
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
	switch (arguments.length) {
		case 1: return a;
		case 2: return ab(a);
		case 3: return bc(ab(a));
		case 4: return cd(bc(ab(a)));
		case 5: return de(cd(bc(ab(a))));
		case 6: return ef(de(cd(bc(ab(a)))));
		case 7: return fg(ef(de(cd(bc(ab(a))))));
		case 8: return gh(fg(ef(de(cd(bc(ab(a)))))));
		case 9: return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
		default: {
			let ret = arguments[0];
			for (let i = 1; i < arguments.length; i++) ret = arguments[i](ret);
			return ret;
		}
	}
}

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/GlobalValue.js
/**
* The `GlobalValue` module ensures that a single instance of a value is created globally,
* even when modules are imported multiple times (e.g., due to mixing CommonJS and ESM builds)
* or during hot-reloading in development environments like Next.js or Remix.
*
* It achieves this by using a versioned global store, identified by a unique `Symbol` tied to
* the current version of the `effect` library. The store holds values that are keyed by an identifier,
* allowing the reuse of previously computed instances across imports or reloads.
*
* This pattern is particularly useful in scenarios where frequent reloading can cause services or
* single-instance objects to be recreated unnecessarily, such as in development environments with hot-reloading.
*
* @since 2.0.0
*/
const globalStoreId = `effect/GlobalValue`;
let globalStore;
/**
* Retrieves or computes a global value associated with the given `id`. If the value for this `id`
* has already been computed, it will be returned from the global store. If it does not exist yet,
* the provided `compute` function will be executed to compute the value, store it, and then return it.
*
* This ensures that even in cases where the module is imported multiple times (e.g., in mixed environments
* like CommonJS and ESM, or during hot-reloading in development), the value is computed only once and reused
* thereafter.
*
* @example
* ```ts
* import { globalValue } from "effect/GlobalValue"
*
* // This cache will persist as long as the module is running,
* // even if reloaded or imported elsewhere
* const myCache = globalValue(
*   Symbol.for("myCache"),
*   () => new WeakMap<object, number>()
* )
* ```
*
* @since 2.0.0
*/
const globalValue = (id, compute) => {
	if (!globalStore) {
		globalThis[globalStoreId] ??= /* @__PURE__ */ new Map();
		globalStore = globalThis[globalStoreId];
	}
	if (!globalStore.has(id)) globalStore.set(id, compute());
	return globalStore.get(id);
};

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/Predicate.js
/**
* This module provides a collection of functions for working with predicates and refinements.
*
* A `Predicate<A>` is a function that takes a value of type `A` and returns a boolean.
* It is used to check if a value satisfies a certain condition.
*
* A `Refinement<A, B>` is a special type of predicate that not only checks a condition
* but also provides a type guard, allowing TypeScript to narrow the type of the input
* value from `A` to a more specific type `B` within a conditional block.
*
* The module includes:
* - Basic predicates and refinements for common types (e.g., `isString`, `isNumber`).
* - Combinators to create new predicates from existing ones (e.g., `and`, `or`, `not`).
* - Advanced combinators for working with data structures (e.g., `tuple`, `struct`).
* - Type-level utilities for inspecting predicate and refinement types.
*
* @since 2.0.0
*/
/**
* A refinement that checks if a value is a `string`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isString } from "effect/Predicate"
*
* assert.strictEqual(isString("hello"), true)
* assert.strictEqual(isString(""), true)
*
* assert.strictEqual(isString(123), false)
* assert.strictEqual(isString(null), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isString = (input) => typeof input === "string";
/**
* A refinement that checks if a value is a `number`. Note that this
* check returns `false` for `NaN`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isNumber } from "effect/Predicate"
*
* assert.strictEqual(isNumber(123), true)
* assert.strictEqual(isNumber(0), true)
* assert.strictEqual(isNumber(-1.5), true)
*
* assert.strictEqual(isNumber("123"), false)
* assert.strictEqual(isNumber(NaN), false) // Special case: NaN is a number type but returns false
* ```
*
* @category guards
* @since 2.0.0
*/
const isNumber = (input) => typeof input === "number";
/**
* A refinement that checks if a value is a `Function`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isFunction } from "effect/Predicate"
*
* assert.strictEqual(isFunction(() => {}), true)
* assert.strictEqual(isFunction(isFunction), true)
*
* assert.strictEqual(isFunction("function"), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isFunction = isFunction$1;
/**
* Checks if the input is an object or an array.
* @internal
*/
const isRecordOrArray = (input) => typeof input === "object" && input !== null;
/**
* A refinement that checks if a value is an `object`. Note that in JavaScript,
* arrays and functions are also considered objects.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isObject } from "effect/Predicate"
*
* assert.strictEqual(isObject({}), true)
* assert.strictEqual(isObject([]), true)
* assert.strictEqual(isObject(() => {}), true)
*
* assert.strictEqual(isObject(null), false)
* assert.strictEqual(isObject("hello"), false)
* ```
*
* @category guards
* @since 2.0.0
* @see isRecord to check for plain objects (excluding arrays and functions).
*/
const isObject = (input) => isRecordOrArray(input) || isFunction(input);
/**
* A refinement that checks if a value is an object-like value and has a specific property key.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { hasProperty } from "effect/Predicate"
*
* assert.strictEqual(hasProperty({ a: 1 }, "a"), true)
* assert.strictEqual(hasProperty({ a: 1 }, "b"), false)
*
* const value: unknown = { name: "Alice" };
* if (hasProperty(value, "name")) {
*   // The type of `value` is narrowed to `{ name: unknown }`
*   // and we can safely access `value.name`
*   console.log(value.name)
* }
* ```
*
* @category guards
* @since 2.0.0
*/
const hasProperty = /*#__PURE__*/ dual(2, (self, property) => isObject(self) && property in self);
/**
* A refinement that checks if a value is an object with a `_tag` property
* that matches the given tag. This is a powerful tool for working with
* discriminated union types.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isTagged } from "effect/Predicate"
*
* type Shape = { _tag: "circle"; radius: number } | { _tag: "square"; side: number }
*
* const isCircle = isTagged("circle")
*
* const shape1: Shape = { _tag: "circle", radius: 10 }
* const shape2: Shape = { _tag: "square", side: 5 }
*
* assert.strictEqual(isCircle(shape1), true)
* assert.strictEqual(isCircle(shape2), false)
*
* if (isCircle(shape1)) {
*   // shape1 is now narrowed to { _tag: "circle"; radius: number }
*   assert.strictEqual(shape1.radius, 10)
* }
* ```
*
* @category guards
* @since 2.0.0
*/
const isTagged = /*#__PURE__*/ dual(2, (self, tag) => hasProperty(self, "_tag") && self["_tag"] === tag);
/**
* A refinement that checks if a value is a record (i.e., a plain object).
* This check returns `false` for arrays, `null`, and functions.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isRecord } from "effect/Predicate"
*
* assert.strictEqual(isRecord({}), true)
* assert.strictEqual(isRecord({ a: 1 }), true)
*
* assert.strictEqual(isRecord([]), false)
* assert.strictEqual(isRecord(new Date()), false)
* assert.strictEqual(isRecord(null), false)
* assert.strictEqual(isRecord(() => null), false)
* ```
*
* @category guards
* @since 2.0.0
* @see isObject
*/
const isRecord = (input) => isRecordOrArray(input) && !Array.isArray(input);

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/internal/errors.js
/**
* @since 2.0.0
*/
/** @internal */
const getBugErrorMessage = (message) => `BUG: ${message} - please report an issue at https://github.com/Effect-TS/effect/issues`;

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/Utils.js
/**
* @category constructors
* @since 2.0.0
*/
var SingleShotGen = class SingleShotGen {
	self;
	called = false;
	constructor(self) {
		this.self = self;
	}
	/**
	* @since 2.0.0
	*/
	next(a) {
		return this.called ? {
			value: a,
			done: true
		} : (this.called = true, {
			value: this.self,
			done: false
		});
	}
	/**
	* @since 2.0.0
	*/
	return(a) {
		return {
			value: a,
			done: true
		};
	}
	/**
	* @since 2.0.0
	*/
	throw(e) {
		throw e;
	}
	/**
	* @since 2.0.0
	*/
	[Symbol.iterator]() {
		return new SingleShotGen(this.self);
	}
};
/**
* @since 3.0.6
*/
const YieldWrapTypeId = /*#__PURE__*/ Symbol.for("effect/Utils/YieldWrap");
/**
* @since 3.0.6
*/
var YieldWrap = class {
	/**
	* @since 3.0.6
	*/
	#value;
	constructor(value) {
		this.#value = value;
	}
	/**
	* @since 3.0.6
	*/
	[YieldWrapTypeId]() {
		return this.#value;
	}
};
/**
* @since 3.0.6
*/
function yieldWrapGet(self) {
	if (typeof self === "object" && self !== null && YieldWrapTypeId in self) return self[YieldWrapTypeId]();
	throw new Error(getBugErrorMessage("yieldWrapGet"));
}
/**
* Note: this is an experimental feature made available to allow custom matchers in tests, not to be directly used yet in user code
*
* @since 3.1.1
* @status experimental
* @category modifiers
*/
const structuralRegionState = /*#__PURE__*/ globalValue("effect/Utils/isStructuralRegion", () => ({
	enabled: false,
	tester: void 0
}));
const standard = { effect_internal_function: (body) => {
	return body();
} };
const forced = { effect_internal_function: (body) => {
	try {
		return body();
	} finally {}
} };
const isNotOptimizedAway = /*#__PURE__*/ standard.effect_internal_function(() => (/* @__PURE__ */ new Error()).stack)?.includes("effect_internal_function") === true;
/**
* @since 3.2.2
* @status experimental
* @category tracing
*/
const internalCall = isNotOptimizedAway ? standard.effect_internal_function : forced.effect_internal_function;
const genConstructor = function* () {}.constructor;

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/Hash.js
/**
* @since 2.0.0
*/
/** @internal */
const randomHashCache = /*#__PURE__*/ globalValue(/*#__PURE__*/ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap());
/**
* @since 2.0.0
* @category symbols
*/
const symbol$1 = /*#__PURE__*/ Symbol.for("effect/Hash");
/**
* @since 2.0.0
* @category hashing
*/
const hash = (self) => {
	if (structuralRegionState.enabled === true) return 0;
	switch (typeof self) {
		case "number": return number(self);
		case "bigint": return string(self.toString(10));
		case "boolean": return string(String(self));
		case "symbol": return string(String(self));
		case "string": return string(self);
		case "undefined": return string("undefined");
		case "function":
		case "object": if (self === null) return string("null");
		else if (self instanceof Date) return hash(self.toISOString());
		else if (self instanceof URL) return hash(self.href);
		else if (isHash(self)) return self[symbol$1]();
		else return random(self);
		default: throw new Error(`BUG: unhandled typeof ${typeof self} - please report an issue at https://github.com/Effect-TS/effect/issues`);
	}
};
/**
* @since 2.0.0
* @category hashing
*/
const random = (self) => {
	if (!randomHashCache.has(self)) randomHashCache.set(self, number(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)));
	return randomHashCache.get(self);
};
/**
* @since 2.0.0
* @category hashing
*/
const combine = (b) => (self) => self * 53 ^ b;
/**
* @since 2.0.0
* @category hashing
*/
const optimize = (n) => n & 3221225471 | n >>> 1 & 1073741824;
/**
* @since 2.0.0
* @category guards
*/
const isHash = (u) => hasProperty(u, symbol$1);
/**
* @since 2.0.0
* @category hashing
*/
const number = (n) => {
	if (n !== n || n === Infinity) return 0;
	let h = n | 0;
	if (h !== n) h ^= n * 4294967295;
	while (n > 4294967295) h ^= n /= 4294967295;
	return optimize(h);
};
/**
* @since 2.0.0
* @category hashing
*/
const string = (str) => {
	let h = 5381, i = str.length;
	while (i) h = h * 33 ^ str.charCodeAt(--i);
	return optimize(h);
};
/**
* @since 2.0.0
* @category hashing
*/
const structureKeys = (o, keys) => {
	let h = 12289;
	for (let i = 0; i < keys.length; i++) h ^= pipe(string(keys[i]), combine(hash(o[keys[i]])));
	return optimize(h);
};
/**
* @since 2.0.0
* @category hashing
*/
const structure = (o) => structureKeys(o, Object.keys(o));
/**
* @since 2.0.0
* @category hashing
*/
const cached = function() {
	if (arguments.length === 1) {
		const self = arguments[0];
		return function(hash) {
			Object.defineProperty(self, symbol$1, {
				value() {
					return hash;
				},
				enumerable: false
			});
			return hash;
		};
	}
	const self = arguments[0];
	const hash = arguments[1];
	Object.defineProperty(self, symbol$1, {
		value() {
			return hash;
		},
		enumerable: false
	});
	return hash;
};

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/Equal.js
/**
* @since 2.0.0
* @category symbols
*/
const symbol = /*#__PURE__*/ Symbol.for("effect/Equal");
function equals() {
	if (arguments.length === 1) return (self) => compareBoth(self, arguments[0]);
	return compareBoth(arguments[0], arguments[1]);
}
function compareBoth(self, that) {
	if (self === that) return true;
	const selfType = typeof self;
	if (selfType !== typeof that) return false;
	if (selfType === "object" || selfType === "function") {
		if (self !== null && that !== null) {
			if (isEqual(self) && isEqual(that)) {
				if (hash(self) === hash(that) && self[symbol](that)) return true;
				else return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
			} else if (self instanceof Date && that instanceof Date) return self.toISOString() === that.toISOString();
			else if (self instanceof URL && that instanceof URL) return self.href === that.href;
		}
		if (structuralRegionState.enabled) {
			if (Array.isArray(self) && Array.isArray(that)) return self.length === that.length && self.every((v, i) => compareBoth(v, that[i]));
			if (Object.getPrototypeOf(self) === Object.prototype && Object.getPrototypeOf(self) === Object.prototype) {
				const keysSelf = Object.keys(self);
				const keysThat = Object.keys(that);
				if (keysSelf.length === keysThat.length) {
					for (const key of keysSelf) if (!(key in that && compareBoth(self[key], that[key]))) return structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
					return true;
				}
			}
			return structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
		}
	}
	return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
}
/**
* @since 2.0.0
* @category guards
*/
const isEqual = (u) => hasProperty(u, symbol);

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/Inspectable.js
/**
* @since 2.0.0
* @category symbols
*/
const NodeInspectSymbol = /*#__PURE__*/ Symbol.for("nodejs.util.inspect.custom");
/**
* @since 2.0.0
*/
const toJSON = (x) => {
	try {
		if (hasProperty(x, "toJSON") && isFunction(x["toJSON"]) && x["toJSON"].length === 0) return x.toJSON();
		else if (Array.isArray(x)) return x.map(toJSON);
	} catch {
		return {};
	}
	return redact(x);
};
/**
* @since 2.0.0
*/
const format = (x) => JSON.stringify(x, null, 2);
/**
* @since 2.0.0
*/
const toStringUnknown = (u, whitespace = 2) => {
	if (typeof u === "string") return u;
	try {
		return typeof u === "object" ? stringifyCircular(u, whitespace) : String(u);
	} catch {
		return String(u);
	}
};
/**
* @since 2.0.0
*/
const stringifyCircular = (obj, whitespace) => {
	let cache = [];
	const retVal = JSON.stringify(obj, (_key, value) => typeof value === "object" && value !== null ? cache.includes(value) ? void 0 : cache.push(value) && (redactableState.fiberRefs !== void 0 && isRedactable(value) ? value[symbolRedactable](redactableState.fiberRefs) : value) : value, whitespace);
	cache = void 0;
	return retVal;
};
/**
* @since 3.10.0
* @category redactable
*/
const symbolRedactable = /*#__PURE__*/ Symbol.for("effect/Inspectable/Redactable");
/**
* @since 3.10.0
* @category redactable
*/
const isRedactable = (u) => typeof u === "object" && u !== null && symbolRedactable in u;
const redactableState = /*#__PURE__*/ globalValue("effect/Inspectable/redactableState", () => ({ fiberRefs: void 0 }));
/**
* @since 3.10.0
* @category redactable
*/
const redact = (u) => {
	if (isRedactable(u) && redactableState.fiberRefs !== void 0) return u[symbolRedactable](redactableState.fiberRefs);
	return u;
};

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/Pipeable.js
/**
* @since 2.0.0
*/
/**
* @since 2.0.0
*/
const pipeArguments = (self, args) => {
	switch (args.length) {
		case 0: return self;
		case 1: return args[0](self);
		case 2: return args[1](args[0](self));
		case 3: return args[2](args[1](args[0](self)));
		case 4: return args[3](args[2](args[1](args[0](self))));
		case 5: return args[4](args[3](args[2](args[1](args[0](self)))));
		case 6: return args[5](args[4](args[3](args[2](args[1](args[0](self))))));
		case 7: return args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))));
		case 8: return args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self))))))));
		case 9: return args[8](args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))))));
		default: {
			let ret = self;
			for (let i = 0, len = args.length; i < len; i++) ret = args[i](ret);
			return ret;
		}
	}
};

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/internal/opCodes/effect.js
/** @internal */
const OP_COMMIT = "Commit";

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/internal/version.js
let moduleVersion = "3.17.7";
const getCurrentVersion = () => moduleVersion;

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/internal/effectable.js
/** @internal */
const EffectTypeId = /*#__PURE__*/ Symbol.for("effect/Effect");
/** @internal */
const StreamTypeId = /*#__PURE__*/ Symbol.for("effect/Stream");
/** @internal */
const SinkTypeId = /*#__PURE__*/ Symbol.for("effect/Sink");
/** @internal */
const ChannelTypeId = /*#__PURE__*/ Symbol.for("effect/Channel");
/** @internal */
const effectVariance = {
	/* c8 ignore next */
	_R: (_) => _,
	/* c8 ignore next */
	_E: (_) => _,
	/* c8 ignore next */
	_A: (_) => _,
	_V: /*#__PURE__*/ getCurrentVersion()
};
const sinkVariance = {
	/* c8 ignore next */
	_A: (_) => _,
	/* c8 ignore next */
	_In: (_) => _,
	/* c8 ignore next */
	_L: (_) => _,
	/* c8 ignore next */
	_E: (_) => _,
	/* c8 ignore next */
	_R: (_) => _
};
const channelVariance = {
	/* c8 ignore next */
	_Env: (_) => _,
	/* c8 ignore next */
	_InErr: (_) => _,
	/* c8 ignore next */
	_InElem: (_) => _,
	/* c8 ignore next */
	_InDone: (_) => _,
	/* c8 ignore next */
	_OutErr: (_) => _,
	/* c8 ignore next */
	_OutElem: (_) => _,
	/* c8 ignore next */
	_OutDone: (_) => _
};
/** @internal */
const EffectPrototype$1 = {
	[EffectTypeId]: effectVariance,
	[StreamTypeId]: effectVariance,
	[SinkTypeId]: sinkVariance,
	[ChannelTypeId]: channelVariance,
	[symbol](that) {
		return this === that;
	},
	[symbol$1]() {
		return cached(this, random(this));
	},
	[Symbol.iterator]() {
		return new SingleShotGen(new YieldWrap(this));
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const StructuralPrototype = {
	[symbol$1]() {
		return cached(this, structure(this));
	},
	[symbol](that) {
		const selfKeys = Object.keys(this);
		const thatKeys = Object.keys(that);
		if (selfKeys.length !== thatKeys.length) return false;
		for (const key of selfKeys) if (!(key in that && equals(this[key], that[key]))) return false;
		return true;
	}
};
/** @internal */
const CommitPrototype = {
	...EffectPrototype$1,
	_op: OP_COMMIT
};
/** @internal */
const StructuralCommitPrototype = {
	...CommitPrototype,
	...StructuralPrototype
};

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/Array.js
/**
* Creates a new `Array` from an iterable collection of values.
* If the input is already an array, it returns the input as-is.
* Otherwise, it converts the iterable collection to an array.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.fromIterable(new Set([1, 2, 3]))
* console.log(result) // [1, 2, 3]
* ```
*
* @category constructors
* @since 2.0.0
*/
const fromIterable = (collection) => Array.isArray(collection) ? collection : Array.from(collection);
/**
* Creates a new `Array` from a value that might not be an iterable.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.ensure("a")) // ["a"]
* console.log(Array.ensure(["a"])) // ["a"]
* console.log(Array.ensure(["a", "b", "c"])) // ["a", "b", "c"]
* ```
*
* @category constructors
* @since 3.3.0
*/
const ensure = (self) => Array.isArray(self) ? self : [self];
/**
* Determine if `unknown` is an Array.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.isArray(null)) // false
* console.log(Array.isArray([1, 2, 3])) // true
* ```
*
* @category guards
* @since 2.0.0
*/
const isArray = Array.isArray;

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/internal/context.js
/** @internal */
const TagTypeId = /*#__PURE__*/ Symbol.for("effect/Context/Tag");
/** @internal */
const ReferenceTypeId = /*#__PURE__*/ Symbol.for("effect/Context/Reference");
/** @internal */
const STMSymbolKey = "effect/STM";
/** @internal */
const STMTypeId = /*#__PURE__*/ Symbol.for(STMSymbolKey);
/** @internal */
const TagProto = {
	...EffectPrototype$1,
	_op: "Tag",
	[STMTypeId]: effectVariance,
	[TagTypeId]: {
		_Service: (_) => _,
		_Identifier: (_) => _
	},
	toString() {
		return format(this.toJSON());
	},
	toJSON() {
		return {
			_id: "Tag",
			key: this.key,
			stack: this.stack
		};
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	of(self) {
		return self;
	},
	context(self) {
		return make(this, self);
	}
};
const ReferenceProto = {
	...TagProto,
	[ReferenceTypeId]: ReferenceTypeId
};
/** @internal */
const Tag$1 = (id) => () => {
	const limit = Error.stackTraceLimit;
	Error.stackTraceLimit = 2;
	const creationError = /* @__PURE__ */ new Error();
	Error.stackTraceLimit = limit;
	function TagClass() {}
	Object.setPrototypeOf(TagClass, TagProto);
	TagClass.key = id;
	Object.defineProperty(TagClass, "stack", { get() {
		return creationError.stack;
	} });
	return TagClass;
};
/** @internal */
const Reference$1 = () => (id, options) => {
	const limit = Error.stackTraceLimit;
	Error.stackTraceLimit = 2;
	const creationError = /* @__PURE__ */ new Error();
	Error.stackTraceLimit = limit;
	function ReferenceClass() {}
	Object.setPrototypeOf(ReferenceClass, ReferenceProto);
	ReferenceClass.key = id;
	ReferenceClass.defaultValue = options.defaultValue;
	Object.defineProperty(ReferenceClass, "stack", { get() {
		return creationError.stack;
	} });
	return ReferenceClass;
};
/** @internal */
const TypeId$1 = /*#__PURE__*/ Symbol.for("effect/Context");
/** @internal */
const ContextProto = {
	[TypeId$1]: { _Services: (_) => _ },
	[symbol](that) {
		if (isContext(that)) {
			if (this.unsafeMap.size === that.unsafeMap.size) {
				for (const k of this.unsafeMap.keys()) if (!that.unsafeMap.has(k) || !equals(this.unsafeMap.get(k), that.unsafeMap.get(k))) return false;
				return true;
			}
		}
		return false;
	},
	[symbol$1]() {
		return cached(this, number(this.unsafeMap.size));
	},
	pipe() {
		return pipeArguments(this, arguments);
	},
	toString() {
		return format(this.toJSON());
	},
	toJSON() {
		return {
			_id: "Context",
			services: Array.from(this.unsafeMap).map(toJSON)
		};
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
};
/** @internal */
const makeContext = (unsafeMap) => {
	const context = Object.create(ContextProto);
	context.unsafeMap = unsafeMap;
	return context;
};
const serviceNotFoundError = (tag) => {
	const error = /* @__PURE__ */ new Error(`Service not found${tag.key ? `: ${String(tag.key)}` : ""}`);
	if (tag.stack) {
		const lines = tag.stack.split("\n");
		if (lines.length > 2) {
			const afterAt = lines[2].match(/at (.*)/);
			if (afterAt) error.message = error.message + ` (defined at ${afterAt[1]})`;
		}
	}
	if (error.stack) {
		const lines = error.stack.split("\n");
		lines.splice(1, 3);
		error.stack = lines.join("\n");
	}
	return error;
};
/** @internal */
const isContext = (u) => hasProperty(u, TypeId$1);
/** @internal */
const make = (tag, service) => makeContext(/* @__PURE__ */ new Map([[tag.key, service]]));
/** @internal */
const add$1 = /*#__PURE__*/ dual(3, (self, tag, service) => {
	const map = new Map(self.unsafeMap);
	map.set(tag.key, service);
	return makeContext(map);
});
const defaultValueCache = /*#__PURE__*/ globalValue("effect/Context/defaultValueCache", () => /* @__PURE__ */ new Map());
const getDefaultValue = (tag) => {
	if (defaultValueCache.has(tag.key)) return defaultValueCache.get(tag.key);
	const value = tag.defaultValue();
	defaultValueCache.set(tag.key, value);
	return value;
};
/** @internal */
const unsafeGetReference = (self, tag) => {
	return self.unsafeMap.has(tag.key) ? self.unsafeMap.get(tag.key) : getDefaultValue(tag);
};
/** @internal */
const unsafeGet$1 = /*#__PURE__*/ dual(2, (self, tag) => {
	if (!self.unsafeMap.has(tag.key)) {
		if (ReferenceTypeId in tag) return getDefaultValue(tag);
		throw serviceNotFoundError(tag);
	}
	return self.unsafeMap.get(tag.key);
});

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/Context.js
/**
* Adds a service to a given `Context`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Context, pipe } from "effect"
*
* const Port = Context.GenericTag<{ PORT: number }>("Port")
* const Timeout = Context.GenericTag<{ TIMEOUT: number }>("Timeout")
*
* const someContext = Context.make(Port, { PORT: 8080 })
*
* const Services = pipe(
*   someContext,
*   Context.add(Timeout, { TIMEOUT: 5000 })
* )
*
* assert.deepStrictEqual(Context.get(Services, Port), { PORT: 8080 })
* assert.deepStrictEqual(Context.get(Services, Timeout), { TIMEOUT: 5000 })
* ```
*
* @since 2.0.0
*/
const add = add$1;
/**
* Get a service from the context that corresponds to the given tag.
* This function is unsafe because if the tag is not present in the context, a runtime error will be thrown.
*
* For a safer version see {@link getOption}.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Context } from "effect"
*
* const Port = Context.GenericTag<{ PORT: number }>("Port")
* const Timeout = Context.GenericTag<{ TIMEOUT: number }>("Timeout")
*
* const Services = Context.make(Port, { PORT: 8080 })
*
* assert.deepStrictEqual(Context.unsafeGet(Services, Port), { PORT: 8080 })
* assert.throws(() => Context.unsafeGet(Services, Timeout))
* ```
*
* @since 2.0.0
* @category unsafe
*/
const unsafeGet = unsafeGet$1;
/**
* @example
* ```ts
* import * as assert from "node:assert"
* import { Context, Layer } from "effect"
*
* class MyTag extends Context.Tag("MyTag")<
*  MyTag,
*  { readonly myNum: number }
* >() {
*  static Live = Layer.succeed(this, { myNum: 108 })
* }
* ```
*
* @since 2.0.0
* @category constructors
*/
const Tag = Tag$1;
/**
* Creates a context tag with a default value.
*
* **Details**
*
* `Context.Reference` allows you to create a tag that can hold a value. You can
* provide a default value for the service, which will automatically be used
* when the context is accessed, or override it with a custom implementation
* when needed.
*
* **Example** (Declaring a Tag with a default value)
*
* ```ts
* import * as assert from "node:assert"
* import { Context, Effect } from "effect"
*
* class SpecialNumber extends Context.Reference<SpecialNumber>()(
*   "SpecialNumber",
*   { defaultValue: () => 2048 }
* ) {}
*
* //      ┌─── Effect<void, never, never>
* //      ▼
* const program = Effect.gen(function* () {
*   const specialNumber = yield* SpecialNumber
*   console.log(`The special number is ${specialNumber}`)
* })
*
* // No need to provide the SpecialNumber implementation
* Effect.runPromise(program)
* // Output: The special number is 2048
* ```
*
* **Example** (Overriding the default value)
*
* ```ts
* import { Context, Effect } from "effect"
*
* class SpecialNumber extends Context.Reference<SpecialNumber>()(
*   "SpecialNumber",
*   { defaultValue: () => 2048 }
* ) {}
*
* const program = Effect.gen(function* () {
*   const specialNumber = yield* SpecialNumber
*   console.log(`The special number is ${specialNumber}`)
* })
*
* Effect.runPromise(program.pipe(Effect.provideService(SpecialNumber, -1)))
* // Output: The special number is -1
* ```
*
* @since 3.11.0
* @category constructors
* @experimental
*/
const Reference = Reference$1;

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/Effectable.js
/**
* @since 2.0.0
* @category prototypes
*/
const EffectPrototype = EffectPrototype$1;

//#endregion
//#region ../../node_modules/.pnpm/effect@3.17.7/node_modules/effect/dist/esm/Micro.js
/**
* A lightweight alternative to the `Effect` data type, with a subset of the functionality.
*
* @since 3.4.0
* @experimental
*/
/**
* @since 3.4.0
* @experimental
* @category type ids
*/
const TypeId = /*#__PURE__*/ Symbol.for("effect/Micro");
/**
* @since 3.4.0
* @experimental
* @category MicroExit
*/
const MicroExitTypeId = /*#__PURE__*/ Symbol.for("effect/Micro/MicroExit");
/**
* @since 3.4.0
* @experimental
* @category guards
*/
const isMicro = (u) => typeof u === "object" && u !== null && TypeId in u;
/**
* @since 3.4.6
* @experimental
* @category MicroCause
*/
const MicroCauseTypeId = /*#__PURE__*/ Symbol.for("effect/Micro/MicroCause");
const microCauseVariance = { _E: identity };
var MicroCauseImpl = class extends globalThis.Error {
	_tag;
	traces;
	[MicroCauseTypeId];
	constructor(_tag, originalError, traces) {
		const causeName = `MicroCause.${_tag}`;
		let name;
		let message;
		let stack;
		if (originalError instanceof globalThis.Error) {
			name = `(${causeName}) ${originalError.name}`;
			message = originalError.message;
			const messageLines = message.split("\n").length;
			stack = originalError.stack ? `(${causeName}) ${originalError.stack.split("\n").slice(0, messageLines + 3).join("\n")}` : `${name}: ${message}`;
		} else {
			name = causeName;
			message = toStringUnknown(originalError, 0);
			stack = `${name}: ${message}`;
		}
		if (traces.length > 0) stack += `\n    ${traces.join("\n    ")}`;
		super(message);
		this._tag = _tag;
		this.traces = traces;
		this[MicroCauseTypeId] = microCauseVariance;
		this.name = name;
		this.stack = stack;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
	toString() {
		return this.stack;
	}
	[NodeInspectSymbol]() {
		return this.stack;
	}
};
var Fail = class extends MicroCauseImpl {
	error;
	constructor(error, traces = []) {
		super("Fail", error, traces);
		this.error = error;
	}
};
/**
* @since 3.4.6
* @experimental
* @category MicroCause
*/
const causeFail = (error, traces = []) => new Fail(error, traces);
var Die = class extends MicroCauseImpl {
	defect;
	constructor(defect, traces = []) {
		super("Die", defect, traces);
		this.defect = defect;
	}
};
/**
* @since 3.4.6
* @experimental
* @category MicroCause
*/
const causeDie = (defect, traces = []) => new Die(defect, traces);
var Interrupt = class extends MicroCauseImpl {
	constructor(traces = []) {
		super("Interrupt", "interrupted", traces);
	}
};
/**
* @since 3.4.6
* @experimental
* @category MicroCause
*/
const causeInterrupt = (traces = []) => new Interrupt(traces);
/**
* @since 3.4.6
* @experimental
* @category MicroCause
*/
const causeIsFail = (self) => self._tag === "Fail";
/**
* @since 3.4.6
* @experimental
* @category MicroCause
*/
const causeIsInterrupt = (self) => self._tag === "Interrupt";
/**
* @since 3.4.6
* @experimental
* @category MicroCause
*/
const causeSquash = (self) => self._tag === "Fail" ? self.error : self._tag === "Die" ? self.defect : self;
/**
* @since 3.4.6
* @experimental
* @category MicroCause
*/
const causeWithTrace = /*#__PURE__*/ dual(2, (self, trace) => {
	const traces = [...self.traces, trace];
	switch (self._tag) {
		case "Die": return causeDie(self.defect, traces);
		case "Interrupt": return causeInterrupt(traces);
		case "Fail": return causeFail(self.error, traces);
	}
});
/**
* @since 3.11.0
* @experimental
* @category MicroFiber
*/
const MicroFiberTypeId = /*#__PURE__*/ Symbol.for("effect/Micro/MicroFiber");
const fiberVariance = {
	_A: identity,
	_E: identity
};
var MicroFiberImpl = class {
	context;
	interruptible;
	[MicroFiberTypeId];
	_stack = [];
	_observers = [];
	_exit;
	_children;
	currentOpCount = 0;
	constructor(context, interruptible = true) {
		this.context = context;
		this.interruptible = interruptible;
		this[MicroFiberTypeId] = fiberVariance;
	}
	getRef(ref) {
		return unsafeGetReference(this.context, ref);
	}
	addObserver(cb) {
		if (this._exit) {
			cb(this._exit);
			return constVoid;
		}
		this._observers.push(cb);
		return () => {
			const index = this._observers.indexOf(cb);
			if (index >= 0) this._observers.splice(index, 1);
		};
	}
	_interrupted = false;
	unsafeInterrupt() {
		if (this._exit) return;
		this._interrupted = true;
		if (this.interruptible) this.evaluate(exitInterrupt);
	}
	unsafePoll() {
		return this._exit;
	}
	evaluate(effect) {
		if (this._exit) return;
		else if (this._yielded !== void 0) {
			const yielded = this._yielded;
			this._yielded = void 0;
			yielded();
		}
		const exit = this.runLoop(effect);
		if (exit === Yield) return;
		const interruptChildren = fiberMiddleware.interruptChildren && fiberMiddleware.interruptChildren(this);
		if (interruptChildren !== void 0) return this.evaluate(flatMap(interruptChildren, () => exit));
		this._exit = exit;
		for (let i = 0; i < this._observers.length; i++) this._observers[i](exit);
		this._observers.length = 0;
	}
	runLoop(effect) {
		let yielding = false;
		let current = effect;
		this.currentOpCount = 0;
		try {
			while (true) {
				this.currentOpCount++;
				if (!yielding && this.getRef(CurrentScheduler).shouldYield(this)) {
					yielding = true;
					const prev = current;
					current = flatMap(yieldNow, () => prev);
				}
				current = current[evaluate](this);
				if (current === Yield) {
					const yielded = this._yielded;
					if (MicroExitTypeId in yielded) {
						this._yielded = void 0;
						return yielded;
					}
					return Yield;
				}
			}
		} catch (error) {
			if (!hasProperty(current, evaluate)) return exitDie(`MicroFiber.runLoop: Not a valid effect: ${String(current)}`);
			return exitDie(error);
		}
	}
	getCont(symbol) {
		while (true) {
			const op = this._stack.pop();
			if (!op) return void 0;
			const cont = op[ensureCont] && op[ensureCont](this);
			if (cont) return { [symbol]: cont };
			if (op[symbol]) return op;
		}
	}
	_yielded = void 0;
	yieldWith(value) {
		this._yielded = value;
		return Yield;
	}
	children() {
		return this._children ??= /* @__PURE__ */ new Set();
	}
};
const fiberMiddleware = /*#__PURE__*/ globalValue("effect/Micro/fiberMiddleware", () => ({ interruptChildren: void 0 }));
/**
* @since 3.11.0
* @experimental
* @category MicroFiber
*/
const fiberInterruptAll = (fibers) => suspend(() => {
	for (const fiber of fibers) fiber.unsafeInterrupt();
	const iter = fibers[Symbol.iterator]();
	const wait = suspend(() => {
		let result = iter.next();
		while (!result.done) {
			if (result.value.unsafePoll()) {
				result = iter.next();
				continue;
			}
			const fiber = result.value;
			return async((resume) => {
				fiber.addObserver((_) => {
					resume(wait);
				});
			});
		}
		return exitVoid;
	});
	return wait;
});
const identifier = /*#__PURE__*/ Symbol.for("effect/Micro/identifier");
const args = /*#__PURE__*/ Symbol.for("effect/Micro/args");
const evaluate = /*#__PURE__*/ Symbol.for("effect/Micro/evaluate");
const successCont = /*#__PURE__*/ Symbol.for("effect/Micro/successCont");
const failureCont = /*#__PURE__*/ Symbol.for("effect/Micro/failureCont");
const ensureCont = /*#__PURE__*/ Symbol.for("effect/Micro/ensureCont");
const Yield = /*#__PURE__*/ Symbol.for("effect/Micro/Yield");
const microVariance = {
	_A: identity,
	_E: identity,
	_R: identity
};
const MicroProto = {
	...EffectPrototype,
	_op: "Micro",
	[TypeId]: microVariance,
	pipe() {
		return pipeArguments(this, arguments);
	},
	[Symbol.iterator]() {
		return new SingleShotGen(new YieldWrap(this));
	},
	toJSON() {
		return {
			_id: "Micro",
			op: this[identifier],
			...args in this ? { args: this[args] } : void 0
		};
	},
	toString() {
		return format(this);
	},
	[NodeInspectSymbol]() {
		return format(this);
	}
};
function defaultEvaluate(_fiber) {
	return exitDie(`Micro.evaluate: Not implemented`);
}
const makePrimitiveProto = (options) => ({
	...MicroProto,
	[identifier]: options.op,
	[evaluate]: options.eval ?? defaultEvaluate,
	[successCont]: options.contA,
	[failureCont]: options.contE,
	[ensureCont]: options.ensure
});
const makePrimitive = (options) => {
	const Proto = makePrimitiveProto(options);
	return function() {
		const self = Object.create(Proto);
		self[args] = options.single === false ? arguments : arguments[0];
		return self;
	};
};
const makeExit = (options) => {
	const Proto = {
		...makePrimitiveProto(options),
		[MicroExitTypeId]: MicroExitTypeId,
		_tag: options.op,
		get [options.prop]() {
			return this[args];
		},
		toJSON() {
			return {
				_id: "MicroExit",
				_tag: options.op,
				[options.prop]: this[args]
			};
		},
		[symbol](that) {
			return isMicroExit(that) && that._tag === options.op && equals(this[args], that[args]);
		},
		[symbol$1]() {
			return cached(this, combine(string(options.op))(hash(this[args])));
		}
	};
	return function(value) {
		const self = Object.create(Proto);
		self[args] = value;
		self[successCont] = void 0;
		self[failureCont] = void 0;
		self[ensureCont] = void 0;
		return self;
	};
};
/**
* Creates a `Micro` effect that will succeed with the specified constant value.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const succeed = /*#__PURE__*/ makeExit({
	op: "Success",
	prop: "value",
	eval(fiber) {
		const cont = fiber.getCont(successCont);
		return cont ? cont[successCont](this[args], fiber) : fiber.yieldWith(this);
	}
});
/**
* Creates a `Micro` effect that will fail with the specified `MicroCause`.
*
* @since 3.4.6
* @experimental
* @category constructors
*/
const failCause = /*#__PURE__*/ makeExit({
	op: "Failure",
	prop: "cause",
	eval(fiber) {
		let cont = fiber.getCont(failureCont);
		while (causeIsInterrupt(this[args]) && cont && fiber.interruptible) cont = fiber.getCont(failureCont);
		return cont ? cont[failureCont](this[args], fiber) : fiber.yieldWith(this);
	}
});
/**
* Creates a `Micro` effect that fails with the given error.
*
* This results in a `Fail` variant of the `MicroCause` type, where the error is
* tracked at the type level.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const fail = (error) => failCause(causeFail(error));
/**
* Creates a `Micro` effect that succeeds with a lazily evaluated value.
*
* If the evaluation of the value throws an error, the effect will fail with a
* `Die` variant of the `MicroCause` type.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const sync = /*#__PURE__*/ makePrimitive({
	op: "Sync",
	eval(fiber) {
		const value = this[args]();
		const cont = fiber.getCont(successCont);
		return cont ? cont[successCont](value, fiber) : fiber.yieldWith(exitSucceed(value));
	}
});
/**
* Lazily creates a `Micro` effect from the given side-effect.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const suspend = /*#__PURE__*/ makePrimitive({
	op: "Suspend",
	eval(_fiber) {
		return this[args]();
	}
});
/**
* Pause the execution of the current `Micro` effect, and resume it on the next
* scheduler tick.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const yieldNowWith = /*#__PURE__*/ makePrimitive({
	op: "Yield",
	eval(fiber) {
		let resumed = false;
		fiber.getRef(CurrentScheduler).scheduleTask(() => {
			if (resumed) return;
			fiber.evaluate(exitVoid);
		}, this[args] ?? 0);
		return fiber.yieldWith(() => {
			resumed = true;
		});
	}
});
/**
* Pause the execution of the current `Micro` effect, and resume it on the next
* scheduler tick.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const yieldNow = /*#__PURE__*/ yieldNowWith(0);
/**
* Creates a `Micro` effect that will die with the specified error.
*
* This results in a `Die` variant of the `MicroCause` type, where the error is
* not tracked at the type level.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const die = (defect) => exitDie(defect);
const void_ = /*#__PURE__*/ succeed(void 0);
const try_ = (options) => suspend(() => {
	try {
		return succeed(options.try());
	} catch (err) {
		return fail(options.catch(err));
	}
});
/**
* Wrap a `Promise` into a `Micro` effect.
*
* Any errors will result in a `Die` variant of the `MicroCause` type, where the
* error is not tracked at the type level.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const promise = (evaluate) => asyncOptions(function(resume, signal) {
	evaluate(signal).then((a) => resume(succeed(a)), (e) => resume(die(e)));
}, evaluate.length !== 0);
/**
* Wrap a `Promise` into a `Micro` effect. Any errors will be caught and
* converted into a specific error type.
*
* @example
* ```ts
* import { Micro } from "effect"
*
* Micro.tryPromise({
*   try: () => Promise.resolve("success"),
*   catch: (cause) => new Error("caught", { cause })
* })
* ```
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const tryPromise = (options) => asyncOptions(function(resume, signal) {
	try {
		options.try(signal).then((a) => resume(succeed(a)), (e) => resume(fail(options.catch(e))));
	} catch (err) {
		resume(fail(options.catch(err)));
	}
}, options.try.length !== 0);
/**
* Create a `Micro` effect using the current `MicroFiber`.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const withMicroFiber = /*#__PURE__*/ makePrimitive({
	op: "WithMicroFiber",
	eval(fiber) {
		return this[args](fiber);
	}
});
const asyncOptions = /*#__PURE__*/ makePrimitive({
	op: "Async",
	single: false,
	eval(fiber) {
		const register = this[args][0];
		let resumed = false;
		let yielded = false;
		const controller = this[args][1] ? new AbortController() : void 0;
		const onCancel = register((effect) => {
			if (resumed) return;
			resumed = true;
			if (yielded) fiber.evaluate(effect);
			else yielded = effect;
		}, controller?.signal);
		if (yielded !== false) return yielded;
		yielded = true;
		fiber._yielded = () => {
			resumed = true;
		};
		if (controller === void 0 && onCancel === void 0) return Yield;
		fiber._stack.push(asyncFinalizer(() => {
			resumed = true;
			controller?.abort();
			return onCancel ?? exitVoid;
		}));
		return Yield;
	}
});
const asyncFinalizer = /*#__PURE__*/ makePrimitive({
	op: "AsyncFinalizer",
	ensure(fiber) {
		if (fiber.interruptible) {
			fiber.interruptible = false;
			fiber._stack.push(setInterruptible(true));
		}
	},
	contE(cause, _fiber) {
		return causeIsInterrupt(cause) ? flatMap(this[args](), () => failCause(cause)) : failCause(cause);
	}
});
/**
* Create a `Micro` effect from an asynchronous computation.
*
* You can return a cleanup effect that will be run when the effect is aborted.
* It is also passed an `AbortSignal` that is triggered when the effect is
* aborted.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const async = (register) => asyncOptions(register, register.length >= 2);
/**
* @since 3.4.0
* @experimental
* @category constructors
*/
const gen = (...args) => suspend(() => fromIterator(args.length === 1 ? args[0]() : args[1].call(args[0])));
const fromIterator = /*#__PURE__*/ makePrimitive({
	op: "Iterator",
	contA(value, fiber) {
		const state = this[args].next(value);
		if (state.done) return succeed(state.value);
		fiber._stack.push(this);
		return yieldWrapGet(state.value);
	},
	eval(fiber) {
		return this[successCont](void 0, fiber);
	}
});
/**
* Create a `Micro` effect that will replace the success value of the given
* effect.
*
* @since 3.4.0
* @experimental
* @category mapping & sequencing
*/
const as = /*#__PURE__*/ dual(2, (self, value) => map(self, (_) => value));
/**
* A more flexible version of `flatMap` that combines `map` and `flatMap` into a
* single API.
*
* It also lets you directly pass a `Micro` effect, which will be executed after
* the current effect.
*
* @since 3.4.0
* @experimental
* @category mapping & sequencing
*/
const andThen = /*#__PURE__*/ dual(2, (self, f) => flatMap(self, (a) => {
	const value = isMicro(f) ? f : typeof f === "function" ? f(a) : f;
	return isMicro(value) ? value : succeed(value);
}));
/**
* Execute a side effect from the success value of the `Micro` effect.
*
* It is similar to the `andThen` api, but the success value is ignored.
*
* @since 3.4.0
* @experimental
* @category mapping & sequencing
*/
const tap = /*#__PURE__*/ dual(2, (self, f) => flatMap(self, (a) => {
	const value = isMicro(f) ? f : typeof f === "function" ? f(a) : f;
	return isMicro(value) ? as(value, a) : succeed(a);
}));
/**
* Map the success value of this `Micro` effect to another `Micro` effect, then
* flatten the result.
*
* @since 3.4.0
* @experimental
* @category mapping & sequencing
*/
const flatMap = /*#__PURE__*/ dual(2, (self, f) => {
	const onSuccess = Object.create(OnSuccessProto);
	onSuccess[args] = self;
	onSuccess[successCont] = f;
	return onSuccess;
});
const OnSuccessProto = /*#__PURE__*/ makePrimitiveProto({
	op: "OnSuccess",
	eval(fiber) {
		fiber._stack.push(this);
		return this[args];
	}
});
/**
* Transforms the success value of the `Micro` effect with the specified
* function.
*
* @since 3.4.0
* @experimental
* @category mapping & sequencing
*/
const map = /*#__PURE__*/ dual(2, (self, f) => flatMap(self, (a) => succeed(f(a))));
/**
* @since 3.4.6
* @experimental
* @category MicroExit
*/
const isMicroExit = (u) => hasProperty(u, MicroExitTypeId);
/**
* @since 3.4.6
* @experimental
* @category MicroExit
*/
const exitSucceed = succeed;
/**
* @since 3.4.6
* @experimental
* @category MicroExit
*/
const exitFailCause = failCause;
/**
* @since 3.4.6
* @experimental
* @category MicroExit
*/
const exitInterrupt = /*#__PURE__*/ exitFailCause(/*#__PURE__*/ causeInterrupt());
/**
* @since 3.4.6
* @experimental
* @category MicroExit
*/
const exitDie = (defect) => exitFailCause(causeDie(defect));
/**
* @since 3.4.6
* @experimental
* @category MicroExit
*/
const exitIsFailure = (self) => self._tag === "Failure";
/**
* @since 3.4.6
* @experimental
* @category MicroExit
*/
const exitVoid = /*#__PURE__*/ exitSucceed(void 0);
const setImmediate = "setImmediate" in globalThis ? globalThis.setImmediate : (f) => setTimeout(f, 0);
/**
* @since 3.5.9
* @experimental
* @category scheduler
*/
var MicroSchedulerDefault = class {
	tasks = [];
	running = false;
	/**
	* @since 3.5.9
	*/
	scheduleTask(task, _priority) {
		this.tasks.push(task);
		if (!this.running) {
			this.running = true;
			setImmediate(this.afterScheduled);
		}
	}
	/**
	* @since 3.5.9
	*/
	afterScheduled = () => {
		this.running = false;
		this.runTasks();
	};
	/**
	* @since 3.5.9
	*/
	runTasks() {
		const tasks = this.tasks;
		this.tasks = [];
		for (let i = 0, len = tasks.length; i < len; i++) tasks[i]();
	}
	/**
	* @since 3.5.9
	*/
	shouldYield(fiber) {
		return fiber.currentOpCount >= fiber.getRef(MaxOpsBeforeYield);
	}
	/**
	* @since 3.5.9
	*/
	flush() {
		while (this.tasks.length > 0) this.runTasks();
	}
};
/**
* Access the given `Context.Tag` from the environment.
*
* @since 3.4.0
* @experimental
* @category environment
*/
const service = (tag) => withMicroFiber((fiber) => succeed(unsafeGet(fiber.context, tag)));
/**
* Update the Context with the given mapping function.
*
* @since 3.11.0
* @experimental
* @category environment
*/
const updateContext = /*#__PURE__*/ dual(2, (self, f) => withMicroFiber((fiber) => {
	const prev = fiber.context;
	fiber.context = f(prev);
	return onExit(self, () => {
		fiber.context = prev;
		return void_;
	});
}));
/**
* Add the provided service to the current context.
*
* @since 3.4.0
* @experimental
* @category environment
*/
const provideService = /*#__PURE__*/ dual(3, (self, tag, service) => updateContext(self, add(tag, service)));
/**
* @since 3.11.0
* @experimental
* @category references
*/
var MaxOpsBeforeYield = class extends Reference()("effect/Micro/currentMaxOpsBeforeYield", { defaultValue: () => 2048 }) {};
/**
* @since 3.11.0
* @experimental
* @category environment refs
*/
var CurrentConcurrency = class extends Reference()("effect/Micro/currentConcurrency", { defaultValue: () => "unbounded" }) {};
/**
* @since 3.11.0
* @experimental
* @category environment refs
*/
var CurrentScheduler = class extends Reference()("effect/Micro/currentScheduler", { defaultValue: () => new MicroSchedulerDefault() }) {};
/**
* Filter the specified effect with the provided function, failing with specified
* error if the predicate fails.
*
* In addition to the filtering capabilities discussed earlier, you have the option to further
* refine and narrow down the type of the success channel by providing a
*
* @since 3.4.0
* @experimental
* @category filtering & conditionals
*/
const filterOrFail = /*#__PURE__*/ dual((args) => isMicro(args[0]), (self, refinement, orFailWith) => flatMap(self, (a) => refinement(a) ? succeed(a) : fail(orFailWith(a))));
/**
* Catch the full `MicroCause` object of the given `Micro` effect, allowing you to
* recover from any kind of cause.
*
* @since 3.4.6
* @experimental
* @category error handling
*/
const catchAllCause = /*#__PURE__*/ dual(2, (self, f) => {
	const onFailure = Object.create(OnFailureProto);
	onFailure[args] = self;
	onFailure[failureCont] = f;
	return onFailure;
});
const OnFailureProto = /*#__PURE__*/ makePrimitiveProto({
	op: "OnFailure",
	eval(fiber) {
		fiber._stack.push(this);
		return this[args];
	}
});
/**
* Selectively catch a `MicroCause` object of the given `Micro` effect,
* using the provided predicate to determine if the failure should be caught.
*
* @since 3.4.6
* @experimental
* @category error handling
*/
const catchCauseIf = /*#__PURE__*/ dual(3, (self, predicate, f) => catchAllCause(self, (cause) => predicate(cause) ? f(cause) : failCause(cause)));
/**
* Perform a side effect using if a `MicroCause` object matches the specified
* predicate.
*
* @since 3.4.0
* @experimental
* @category error handling
*/
const tapErrorCauseIf = /*#__PURE__*/ dual(3, (self, refinement, f) => catchCauseIf(self, refinement, (cause) => andThen(f(cause), failCause(cause))));
/**
* Perform a side effect from expected errors of the given `Micro`.
*
* @since 3.4.6
* @experimental
* @category error handling
*/
const tapError = /*#__PURE__*/ dual(2, (self, f) => tapErrorCauseIf(self, causeIsFail, (fail) => f(fail.error)));
/**
* Catch any expected errors that match the specified predicate.
*
* @since 3.4.0
* @experimental
* @category error handling
*/
const catchIf = /*#__PURE__*/ dual(3, (self, predicate, f) => catchCauseIf(self, (f) => causeIsFail(f) && predicate(f.error), (fail) => f(fail.error)));
/**
* Recovers from the specified tagged error.
*
* @since 3.4.0
* @experimental
* @category error handling
*/
const catchTag = /*#__PURE__*/ dual(3, (self, k, f) => catchIf(self, isTagged(k), f));
/**
* Add a stack trace to any failures that occur in the effect. The trace will be
* added to the `traces` field of the `MicroCause` object.
*
* @since 3.4.0
* @experimental
* @category error handling
*/
const withTrace = function() {
	const prevLimit = globalThis.Error.stackTraceLimit;
	globalThis.Error.stackTraceLimit = 2;
	const error = new globalThis.Error();
	globalThis.Error.stackTraceLimit = prevLimit;
	function generate(name, cause) {
		const stack = error.stack;
		if (!stack) return cause;
		const line = stack.split("\n")[2]?.trim().replace(/^at /, "");
		if (!line) return cause;
		const lineMatch = line.match(/\((.*)\)$/);
		return causeWithTrace(cause, `at ${name} (${lineMatch ? lineMatch[1] : line})`);
	}
	const f = (name) => (self) => onError(self, (cause) => failCause(generate(name, cause)));
	if (arguments.length === 2) return f(arguments[1])(arguments[0]);
	return f(arguments[0]);
};
/**
* @since 3.4.6
* @experimental
* @category pattern matching
*/
const matchCauseEffect = /*#__PURE__*/ dual(2, (self, options) => {
	const primitive = Object.create(OnSuccessAndFailureProto);
	primitive[args] = self;
	primitive[successCont] = options.onSuccess;
	primitive[failureCont] = options.onFailure;
	return primitive;
});
const OnSuccessAndFailureProto = /*#__PURE__*/ makePrimitiveProto({
	op: "OnSuccessAndFailure",
	eval(fiber) {
		fiber._stack.push(this);
		return this[args];
	}
});
/**
* When the `Micro` effect is completed, run the given finalizer effect with the
* `MicroExit` of the executed effect.
*
* @since 3.4.6
* @experimental
* @category resources & finalization
*/
const onExit = /*#__PURE__*/ dual(2, (self, f) => uninterruptibleMask((restore) => matchCauseEffect(restore(self), {
	onFailure: (cause) => flatMap(f(exitFailCause(cause)), () => failCause(cause)),
	onSuccess: (a) => flatMap(f(exitSucceed(a)), () => succeed(a))
})));
/**
* When the `Micro` effect is completed, run the given finalizer effect if it
* matches the specified predicate.
*
* @since 3.4.6
* @experimental
* @category resources & finalization
*/
const onExitIf = /*#__PURE__*/ dual(3, (self, refinement, f) => onExit(self, (exit) => refinement(exit) ? f(exit) : exitVoid));
/**
* When the `Micro` effect fails, run the given finalizer effect with the
* `MicroCause` of the executed effect.
*
* @since 3.4.6
* @experimental
* @category resources & finalization
*/
const onError = /*#__PURE__*/ dual(2, (self, f) => onExitIf(self, exitIsFailure, (exit) => f(exit.cause)));
const setInterruptible = /*#__PURE__*/ makePrimitive({
	op: "SetInterruptible",
	ensure(fiber) {
		fiber.interruptible = this[args];
		if (fiber._interrupted && fiber.interruptible) return () => exitInterrupt;
	}
});
/**
* Flag the effect as interruptible, which means that when the effect is
* interrupted, it will be interrupted immediately.
*
* @since 3.4.0
* @experimental
* @category flags
*/
const interruptible = (self) => withMicroFiber((fiber) => {
	if (fiber.interruptible) return self;
	fiber.interruptible = true;
	fiber._stack.push(setInterruptible(false));
	if (fiber._interrupted) return exitInterrupt;
	return self;
});
/**
* Wrap the given `Micro` effect in an uninterruptible region, preventing the
* effect from being aborted.
*
* You can use the `restore` function to restore a `Micro` effect to the
* interruptibility state before the `uninterruptibleMask` was applied.
*
* @example
* ```ts
* import * as Micro from "effect/Micro"
*
* Micro.uninterruptibleMask((restore) =>
*   Micro.sleep(1000).pipe( // uninterruptible
*     Micro.andThen(restore(Micro.sleep(1000))) // interruptible
*   )
* )
* ```
*
* @since 3.4.0
* @experimental
* @category interruption
*/
const uninterruptibleMask = (f) => withMicroFiber((fiber) => {
	if (!fiber.interruptible) return f(identity);
	fiber.interruptible = false;
	fiber._stack.push(setInterruptible(true));
	return f(interruptible);
});
/**
* @since 3.11.0
* @experimental
* @category collecting & elements
*/
const whileLoop = /*#__PURE__*/ makePrimitive({
	op: "While",
	contA(value, fiber) {
		this[args].step(value);
		if (this[args].while()) {
			fiber._stack.push(this);
			return this[args].body();
		}
		return exitVoid;
	},
	eval(fiber) {
		if (this[args].while()) {
			fiber._stack.push(this);
			return this[args].body();
		}
		return exitVoid;
	}
});
/**
* For each element of the provided iterable, run the effect and collect the
* results.
*
* If the `discard` option is set to `true`, the results will be discarded and
* the effect will return `void`.
*
* The `concurrency` option can be set to control how many effects are run
* concurrently. By default, the effects are run sequentially.
*
* @since 3.4.0
* @experimental
* @category collecting & elements
*/
const forEach = (iterable, f, options) => withMicroFiber((parent) => {
	const concurrencyOption = options?.concurrency === "inherit" ? parent.getRef(CurrentConcurrency) : options?.concurrency ?? 1;
	const concurrency = concurrencyOption === "unbounded" ? Number.POSITIVE_INFINITY : Math.max(1, concurrencyOption);
	const items = fromIterable(iterable);
	let length = items.length;
	if (length === 0) return options?.discard ? void_ : succeed([]);
	const out = options?.discard ? void 0 : new Array(length);
	let index = 0;
	if (concurrency === 1) return as(whileLoop({
		while: () => index < items.length,
		body: () => f(items[index], index),
		step: out ? (b) => out[index++] = b : (_) => index++
	}), out);
	return async((resume) => {
		const fibers = /* @__PURE__ */ new Set();
		let result = void 0;
		let inProgress = 0;
		let doneCount = 0;
		let pumping = false;
		let interrupted = false;
		function pump() {
			pumping = true;
			while (inProgress < concurrency && index < length) {
				const currentIndex = index;
				const item = items[currentIndex];
				index++;
				inProgress++;
				try {
					const child = unsafeFork(parent, f(item, currentIndex), true, true);
					fibers.add(child);
					child.addObserver((exit) => {
						fibers.delete(child);
						if (interrupted) return;
						else if (exit._tag === "Failure") {
							if (result === void 0) {
								result = exit;
								length = index;
								fibers.forEach((fiber) => fiber.unsafeInterrupt());
							}
						} else if (out !== void 0) out[currentIndex] = exit.value;
						doneCount++;
						inProgress--;
						if (doneCount === length) resume(result ?? succeed(out));
						else if (!pumping && inProgress < concurrency) pump();
					});
				} catch (err) {
					result = exitDie(err);
					length = index;
					fibers.forEach((fiber) => fiber.unsafeInterrupt());
				}
			}
			pumping = false;
		}
		pump();
		return suspend(() => {
			interrupted = true;
			index = length;
			return fiberInterruptAll(fibers);
		});
	});
});
const unsafeFork = (parent, effect, immediate = false, daemon = false) => {
	const child = new MicroFiberImpl(parent.context, parent.interruptible);
	if (!daemon) {
		parent.children().add(child);
		child.addObserver(() => parent.children().delete(child));
	}
	if (immediate) child.evaluate(effect);
	else parent.getRef(CurrentScheduler).scheduleTask(() => child.evaluate(effect), 0);
	return child;
};
/**
* Execute the `Micro` effect and return a `MicroFiber` that can be awaited, joined,
* or aborted.
*
* You can listen for the result by adding an observer using the handle's
* `addObserver` method.
*
* @example
* ```ts
* import * as Micro from "effect/Micro"
*
* const handle = Micro.succeed(42).pipe(
*   Micro.delay(1000),
*   Micro.runFork
* )
*
* handle.addObserver((exit) => {
*   console.log(exit)
* })
* ```
*
* @since 3.4.0
* @experimental
* @category execution
*/
const runFork = (effect, options) => {
	const fiber = new MicroFiberImpl(CurrentScheduler.context(options?.scheduler ?? new MicroSchedulerDefault()));
	fiber.evaluate(effect);
	if (options?.signal) {
		if (options.signal.aborted) fiber.unsafeInterrupt();
		else {
			const abort = () => fiber.unsafeInterrupt();
			options.signal.addEventListener("abort", abort, { once: true });
			fiber.addObserver(() => options.signal.removeEventListener("abort", abort));
		}
	}
	return fiber;
};
/**
* Execute the `Micro` effect and return a `Promise` that resolves with the
* `MicroExit` of the computation.
*
* @since 3.4.6
* @experimental
* @category execution
*/
const runPromiseExit = (effect, options) => new Promise((resolve, _reject) => {
	runFork(effect, options).addObserver(resolve);
});
/**
* Execute the `Micro` effect and return a `Promise` that resolves with the
* successful value of the computation.
*
* @since 3.4.0
* @experimental
* @category execution
*/
const runPromise = (effect, options) => runPromiseExit(effect, options).then((exit) => {
	if (exit._tag === "Failure") throw exit.cause;
	return exit.value;
});
/**
* Attempt to execute the `Micro` effect synchronously and return the `MicroExit`.
*
* If any asynchronous effects are encountered, the function will return a
* `CauseDie` containing the `MicroFiber`.
*
* @since 3.4.6
* @experimental
* @category execution
*/
const runSyncExit = (effect) => {
	const scheduler = new MicroSchedulerDefault();
	const fiber = runFork(effect, { scheduler });
	scheduler.flush();
	return fiber._exit ?? exitDie(fiber);
};
/**
* Attempt to execute the `Micro` effect synchronously and return the success
* value.
*
* @since 3.4.0
* @experimental
* @category execution
*/
const runSync = (effect) => {
	const exit = runSyncExit(effect);
	if (exit._tag === "Failure") throw exit.cause;
	return exit.value;
};
const YieldableError = /*#__PURE__*/ function() {
	class YieldableError extends globalThis.Error {}
	Object.assign(YieldableError.prototype, MicroProto, StructuralPrototype, {
		[identifier]: "Failure",
		[evaluate]() {
			return fail(this);
		},
		toString() {
			return this.message ? `${this.name}: ${this.message}` : this.name;
		},
		toJSON() {
			return { ...this };
		},
		[NodeInspectSymbol]() {
			const stack = this.stack;
			if (stack) return `${this.toString()}\n${stack.split("\n").slice(1).join("\n")}`;
			return this.toString();
		}
	});
	return YieldableError;
}();
/**
* @since 3.4.0
* @experimental
* @category errors
*/
const Error$1 = /*#__PURE__*/ function() {
	return class extends YieldableError {
		constructor(args) {
			super();
			if (args) Object.assign(this, args);
		}
	};
}();
/**
* @since 3.4.0
* @experimental
* @category errors
*/
const TaggedError = (tag) => {
	class Base extends Error$1 {
		_tag = tag;
	}
	Base.prototype.name = tag;
	return Base;
};
/**
* Represents a checked exception which occurs when an expected element was
* unable to be found.
*
* @since 3.4.4
* @experimental
* @category errors
*/
var NoSuchElementException = class extends TaggedError("NoSuchElementException") {};
/**
* Represents a checked exception which occurs when a timeout occurs.
*
* @since 3.4.4
* @experimental
* @category errors
*/
var TimeoutException = class extends TaggedError("TimeoutException") {};

//#endregion
//#region ../../node_modules/.pnpm/@uploadthing+shared@7.1.10/node_modules/@uploadthing/shared/dist/index.js
var InvalidRouteConfigError = class extends TaggedError("InvalidRouteConfig") {
	constructor(type, field) {
		const reason = field ? `Expected route config to have a ${field} for key ${type} but none was found.` : `Encountered an invalid route config during backfilling. ${type} was not found.`;
		super({ reason });
	}
};
var UnknownFileTypeError = class extends TaggedError("UnknownFileType") {
	constructor(fileName) {
		const reason = `Could not determine type for ${fileName}`;
		super({ reason });
	}
};
var InvalidFileTypeError = class extends TaggedError("InvalidFileType") {
	constructor(fileType, fileName) {
		const reason = `File type ${fileType} not allowed for ${fileName}`;
		super({ reason });
	}
};
var InvalidFileSizeError = class extends TaggedError("InvalidFileSize") {
	constructor(fileSize) {
		const reason = `Invalid file size: ${fileSize}`;
		super({ reason });
	}
};
var InvalidURLError = class extends TaggedError("InvalidURL") {
	constructor(attemptedUrl) {
		super({ reason: `Failed to parse '${attemptedUrl}' as a URL.` });
	}
};
var RetryError = class extends TaggedError("RetryError") {};
var FetchError = class extends TaggedError("FetchError") {};
var InvalidJsonError = class extends TaggedError("InvalidJson") {};
var BadRequestError = class extends TaggedError("BadRequestError") {
	getMessage() {
		if (isRecord(this.json)) {
			if (typeof this.json.message === "string") return this.json.message;
		}
		return this.message;
	}
};
var UploadPausedError = class extends TaggedError("UploadAborted") {};
var UploadAbortedError = class extends TaggedError("UploadAborted") {};
const getFullApiUrl = (maybeUrl) => gen(function* () {
	const base = (() => {
		if (typeof window !== "undefined") return window.location.origin;
		if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
		return "http://localhost:3000";
	})();
	const url = yield* try_({
		try: () => new URL(maybeUrl ?? "/api/uploadthing", base),
		catch: () => new InvalidURLError(maybeUrl ?? "/api/uploadthing")
	});
	if (url.pathname === "/") url.pathname = "/api/uploadthing";
	return url;
});
const resolveMaybeUrlArg = (maybeUrl) => {
	return maybeUrl instanceof URL ? maybeUrl : runSync(getFullApiUrl(maybeUrl));
};
function noop() {}
function createIdentityProxy() {
	return new Proxy(noop, { get: (_, prop) => prop });
}
const ERROR_CODES = {
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	FORBIDDEN: 403,
	INTERNAL_SERVER_ERROR: 500,
	INTERNAL_CLIENT_ERROR: 500,
	TOO_LARGE: 413,
	TOO_SMALL: 400,
	TOO_MANY_FILES: 400,
	KEY_TOO_LONG: 400,
	URL_GENERATION_FAILED: 500,
	UPLOAD_FAILED: 500,
	MISSING_ENV: 500,
	INVALID_SERVER_CONFIG: 500,
	FILE_LIMIT_EXCEEDED: 500
};
function messageFromUnknown(cause, fallback) {
	if (typeof cause === "string") return cause;
	if (cause instanceof Error) return cause.message;
	if (cause && typeof cause === "object" && "message" in cause && typeof cause.message === "string") return cause.message;
	return fallback ?? "An unknown error occurred";
}
var UploadThingError = class UploadThingError extends Error$1 {
	_tag = "UploadThingError";
	name = "UploadThingError";
	cause;
	code;
	data;
	constructor(initOpts) {
		const opts = typeof initOpts === "string" ? {
			code: "INTERNAL_SERVER_ERROR",
			message: initOpts
		} : initOpts;
		const message = opts.message ?? messageFromUnknown(opts.cause, opts.code);
		super({ message });
		this.code = opts.code;
		this.data = opts.data;
		if (opts.cause instanceof Error) this.cause = opts.cause;
		else if (isRecord(opts.cause) && isNumber(opts.cause.status) && isString(opts.cause.statusText)) this.cause = /* @__PURE__ */ new Error(`Response ${opts.cause.status} ${opts.cause.statusText}`);
		else if (isString(opts.cause)) this.cause = new Error(opts.cause);
		else this.cause = opts.cause;
	}
	static toObject(error) {
		return {
			code: error.code,
			message: error.message,
			data: error.data
		};
	}
	static serialize(error) {
		return JSON.stringify(UploadThingError.toObject(error));
	}
};
function getErrorTypeFromStatusCode(statusCode) {
	for (const [code, status] of Object.entries(ERROR_CODES)) if (status === statusCode) return code;
	return "INTERNAL_SERVER_ERROR";
}
var FetchContext = class extends Tag("uploadthing/Fetch")() {};
const fetchEff = (input, init) => flatMap(service(FetchContext), (fetch) => {
	const headers = new Headers(init?.headers ?? []);
	const reqInfo = {
		url: input.toString(),
		method: init?.method,
		body: init?.body,
		headers: Object.fromEntries(headers)
	};
	return tryPromise({
		try: (signal) => fetch(input, {
			...init,
			headers,
			signal
		}),
		catch: (error) => new FetchError({
			error: error instanceof Error ? {
				...error,
				name: error.name,
				message: error.message,
				stack: error.stack
			} : error,
			input: reqInfo
		})
	}).pipe(tapError((e) => sync(() => console.error(e.input))), map((res) => Object.assign(res, { requestUrl: reqInfo.url })), withTrace("fetch"));
});
const parseResponseJson = (res) => tryPromise({
	try: async () => {
		return {
			json: await res.json(),
			ok: res.ok,
			status: res.status
		};
	},
	catch: (error) => new InvalidJsonError({
		error,
		input: res.requestUrl
	})
}).pipe(filterOrFail(({ ok }) => ok, ({ json, status }) => new BadRequestError({
	status,
	message: `Request to ${res.requestUrl} failed with status ${status}`,
	json
})), map(({ json }) => json), withTrace("parseJson"));
const encoder = new TextEncoder();

//#endregion
//#region ../../node_modules/.pnpm/uploadthing@7.7.4_express@5.2.1_supports-color@10.2.2__next@16.2.11_@babel+core@7.29.7__9f81ec92001aa17acea116827f60b1df/node_modules/uploadthing/dist/ut-reporter-Dlppchbx.js
const createDeferred = () => {
	let resolve;
	let reject;
	const ac = new AbortController();
	return {
		promise: new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		}),
		ac,
		resolve,
		reject
	};
};
const randomHexString = (function() {
	const characters = "abcdef0123456789";
	const charactersLength = 16;
	return function(length) {
		let result = "";
		for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
		return result;
	};
})();
const generateTraceHeaders = () => {
	const traceId = randomHexString(32);
	const spanId = randomHexString(16);
	const sampled = "01";
	return {
		b3: `${traceId}-${spanId}-${sampled}`,
		traceparent: `00-${traceId}-${spanId}-${sampled}`
	};
};
const createAPIRequestUrl = (config) => {
	const url = new URL(config.url);
	const queryParams = new URLSearchParams(url.search);
	queryParams.set("actionType", config.actionType);
	queryParams.set("slug", config.slug);
	url.search = queryParams.toString();
	return url;
};
/**
* Creates a "client" for reporting events to the UploadThing server via the user's API endpoint.
* Events are handled in "./handler.ts starting at L112"
*/
const createUTReporter = (cfg) => (type, payload) => gen(function* () {
	const url = createAPIRequestUrl({
		url: cfg.url,
		slug: cfg.endpoint,
		actionType: type
	});
	const headers = new Headers(yield* promise(async () => typeof cfg.headers === "function" ? await cfg.headers() : cfg.headers));
	if (cfg.package) headers.set("x-uploadthing-package", cfg.package);
	headers.set("x-uploadthing-version", version);
	headers.set("Content-Type", "application/json");
	headers.set("b3", cfg.traceHeaders.b3);
	headers.set("traceparent", cfg.traceHeaders.traceparent);
	return yield* fetchEff(url, {
		method: "POST",
		body: JSON.stringify(payload),
		headers
	}).pipe(
		andThen(parseResponseJson),
		/**
		* We don't _need_ to validate the response here, just cast it for now.
		* As of now, @effect/schema includes quite a few bytes we cut out by this...
		* We have "strong typing" on the backend that ensures the shape should match.
		*/
		map(unsafeCoerce),
		catchTag("FetchError", (e) => fail(new UploadThingError({
			code: "INTERNAL_CLIENT_ERROR",
			message: `Failed to report event "${type}" to UploadThing server`,
			cause: e
		}))),
		catchTag("BadRequestError", (e) => fail(new UploadThingError({
			code: getErrorTypeFromStatusCode(e.status),
			message: e.getMessage(),
			cause: e.json
		}))),
		catchTag("InvalidJson", (e) => fail(new UploadThingError({
			code: "INTERNAL_CLIENT_ERROR",
			message: "Failed to parse response from UploadThing server",
			cause: e
		})))
	);
});

//#endregion
//#region ../../node_modules/.pnpm/uploadthing@7.7.4_express@5.2.1_supports-color@10.2.2__next@16.2.11_@babel+core@7.29.7__9f81ec92001aa17acea116827f60b1df/node_modules/uploadthing/dist/deprecations-pLmw6Ytd.js
const logDeprecationWarning = (message) => {
	console.warn(`⚠️ [uploadthing][deprecated] ${message}`);
};

//#endregion
//#region ../../node_modules/.pnpm/uploadthing@7.7.4_express@5.2.1_supports-color@10.2.2__next@16.2.11_@babel+core@7.29.7__9f81ec92001aa17acea116827f60b1df/node_modules/uploadthing/client/index.js
const uploadWithProgress = (file, rangeStart, presigned, opts) => async((resume) => {
	const xhr = new XMLHttpRequest();
	xhr.open("PUT", presigned.url, true);
	xhr.setRequestHeader("Range", `bytes=${rangeStart}-`);
	xhr.setRequestHeader("x-uploadthing-version", version);
	xhr.setRequestHeader("b3", opts.traceHeaders.b3);
	xhr.setRequestHeader("traceparent", opts.traceHeaders.traceparent);
	xhr.responseType = "json";
	let previousLoaded = 0;
	xhr.upload.addEventListener("progress", ({ loaded }) => {
		const delta = loaded - previousLoaded;
		opts.onUploadProgress?.({
			loaded,
			delta
		});
		previousLoaded = loaded;
	});
	xhr.addEventListener("load", () => {
		if (xhr.status >= 200 && xhr.status < 300 && isRecord(xhr.response)) if (hasProperty(xhr.response, "error")) resume(new UploadThingError({
			code: "UPLOAD_FAILED",
			message: String(xhr.response.error),
			data: xhr.response
		}));
		else resume(succeed(xhr.response));
		else resume(new UploadThingError({
			code: "UPLOAD_FAILED",
			message: `XHR failed ${xhr.status} ${xhr.statusText}`,
			data: xhr.response
		}));
	});
	xhr.addEventListener("error", () => {
		resume(new UploadThingError({ code: "UPLOAD_FAILED" }));
	});
	const formData = new FormData();
	/**
	* iOS/React Native FormData handling requires special attention:
	*
	* Issue: In React Native, iOS crashes with "attempt to insert nil object" when appending File directly
	* to FormData. This happens because iOS tries to create NSDictionary from the file object and expects
	* specific structure {uri, type, name}.
	*
	*
	* Note: Don't try to use Blob or modify File object - iOS specifically needs plain object
	* with these properties to create valid NSDictionary.
	*/
	if ("uri" in file) formData.append("file", {
		uri: file.uri,
		type: file.type,
		name: file.name,
		...rangeStart > 0 && { range: rangeStart }
	});
	else formData.append("file", rangeStart > 0 ? file.slice(rangeStart) : file);
	xhr.send(formData);
	return sync(() => xhr.abort());
});
const uploadFile = (file, presigned, opts) => fetchEff(presigned.url, {
	method: "HEAD",
	headers: opts.traceHeaders
}).pipe(map(({ headers }) => parseInt(headers.get("x-ut-range-start") ?? "0", 10)), tap((start) => opts.onUploadProgress?.({
	delta: start,
	loaded: start
})), flatMap((start) => uploadWithProgress(file, start, presigned, {
	traceHeaders: opts.traceHeaders,
	onUploadProgress: (progressEvent) => opts.onUploadProgress?.({
		delta: progressEvent.delta,
		loaded: progressEvent.loaded + start
	})
})), map(unsafeCoerce), map((uploadResponse) => ({
	name: file.name,
	size: file.size,
	key: presigned.key,
	lastModified: file.lastModified,
	serverData: uploadResponse.serverData,
	get url() {
		logDeprecationWarning("`file.url` is deprecated and will be removed in uploadthing v9. Use `file.ufsUrl` instead.");
		return uploadResponse.url;
	},
	get appUrl() {
		logDeprecationWarning("`file.appUrl` is deprecated and will be removed in uploadthing v9. Use `file.ufsUrl` instead.");
		return uploadResponse.appUrl;
	},
	ufsUrl: uploadResponse.ufsUrl,
	customId: presigned.customId,
	type: file.type,
	fileHash: uploadResponse.fileHash
})));
const uploadFilesInternal = (endpoint, opts) => {
	const traceHeaders = generateTraceHeaders();
	const reportEventToUT = createUTReporter({
		endpoint: String(endpoint),
		package: opts.package,
		url: opts.url,
		headers: opts.headers,
		traceHeaders
	});
	const totalSize = opts.files.reduce((acc, f) => acc + f.size, 0);
	let totalLoaded = 0;
	return flatMap(reportEventToUT("upload", {
		input: "input" in opts ? opts.input : null,
		files: opts.files.map((f) => ({
			name: f.name,
			size: f.size,
			type: f.type,
			lastModified: f.lastModified
		}))
	}), (presigneds) => forEach(presigneds, (presigned, i) => flatMap(sync(() => opts.onUploadBegin?.({ file: opts.files[i].name })), () => uploadFile(opts.files[i], presigned, {
		traceHeaders,
		onUploadProgress: (ev) => {
			totalLoaded += ev.delta;
			opts.onUploadProgress?.({
				file: opts.files[i],
				progress: ev.loaded / opts.files[i].size * 100,
				loaded: ev.loaded,
				delta: ev.delta,
				totalLoaded,
				totalProgress: totalLoaded / totalSize
			});
		}
	})), { concurrency: 6 }));
};
/**
* Generate a typed uploader for a given FileRouter
* @public
*/
const genUploader = (initOpts) => {
	const routeRegistry = createIdentityProxy();
	const controllableUpload = async (slug, opts) => {
		const uploads = /* @__PURE__ */ new Map();
		const endpoint = typeof slug === "function" ? slug(routeRegistry) : slug;
		const traceHeaders = generateTraceHeaders();
		const utReporter = createUTReporter({
			endpoint: String(endpoint),
			package: initOpts?.package ?? "uploadthing/client",
			url: resolveMaybeUrlArg(initOpts?.url),
			headers: opts.headers,
			traceHeaders
		});
		const fetchFn = initOpts?.fetch ?? window.fetch;
		const presigneds = await runPromise(utReporter("upload", {
			input: "input" in opts ? opts.input : null,
			files: opts.files.map((f) => ({
				name: f.name,
				size: f.size,
				type: f.type,
				lastModified: f.lastModified
			}))
		}).pipe(provideService(FetchContext, fetchFn)));
		const totalSize = opts.files.reduce((acc, f) => acc + f.size, 0);
		let totalLoaded = 0;
		const uploadEffect = (file, presigned) => uploadFile(file, presigned, {
			traceHeaders,
			onUploadProgress: (progressEvent) => {
				totalLoaded += progressEvent.delta;
				opts.onUploadProgress?.({
					...progressEvent,
					file,
					progress: Math.round(progressEvent.loaded / file.size * 100),
					totalLoaded,
					totalProgress: Math.round(totalLoaded / totalSize * 100)
				});
			}
		}).pipe(provideService(FetchContext, fetchFn));
		for (const [i, p] of presigneds.entries()) {
			const file = opts.files[i];
			if (!file) continue;
			const deferred = createDeferred();
			uploads.set(file, {
				deferred,
				presigned: p
			});
			runPromiseExit(uploadEffect(file, p), { signal: deferred.ac.signal }).then((result) => {
				if (result._tag === "Success") return deferred.resolve(result.value);
				else if (result.cause._tag === "Interrupt") throw new UploadPausedError();
				throw causeSquash(result.cause);
			}).catch((err) => {
				if (err instanceof UploadPausedError) return;
				deferred.reject(err);
			});
		}
		/**
		* Pause an ongoing upload
		* @param file The file upload you want to pause. Can be omitted to pause all files
		*/
		const pauseUpload = (file) => {
			const files = ensure(file ?? opts.files);
			for (const file$1 of files) {
				const upload = uploads.get(file$1);
				if (!upload) return;
				if (upload.deferred.ac.signal.aborted) throw new UploadAbortedError();
				upload.deferred.ac.abort();
			}
		};
		/**
		* Resume a paused upload
		* @param file The file upload you want to resume. Can be omitted to resume all files
		*/
		const resumeUpload = (file) => {
			const files = ensure(file ?? opts.files);
			for (const file$1 of files) {
				const upload = uploads.get(file$1);
				if (!upload) throw "No upload found";
				upload.deferred.ac = new AbortController();
				runPromiseExit(uploadEffect(file$1, upload.presigned), { signal: upload.deferred.ac.signal }).then((result) => {
					if (result._tag === "Success") return upload.deferred.resolve(result.value);
					else if (result.cause._tag === "Interrupt") throw new UploadPausedError();
					throw causeSquash(result.cause);
				}).catch((err) => {
					if (err instanceof UploadPausedError) return;
					upload.deferred.reject(err);
				});
			}
		};
		/**
		* Wait for an upload to complete
		* @param file The file upload you want to wait for. Can be omitted to wait for all files
		*/
		const done = async (file) => {
			const promises = [];
			const files = ensure(file ?? opts.files);
			for (const file$1 of files) {
				const upload = uploads.get(file$1);
				if (!upload) throw "No upload found";
				promises.push(upload.deferred.promise);
			}
			const results = await Promise.all(promises);
			return file ? results[0] : results;
		};
		return {
			pauseUpload,
			resumeUpload,
			done
		};
	};
	/**
	* One step upload function that both requests presigned URLs
	* and then uploads the files to UploadThing
	*/
	const typedUploadFiles = (slug, opts) => {
		const endpoint = typeof slug === "function" ? slug(routeRegistry) : slug;
		const fetchFn = initOpts?.fetch ?? window.fetch;
		return uploadFilesInternal(endpoint, {
			...opts,
			skipPolling: {},
			url: resolveMaybeUrlArg(initOpts?.url),
			package: initOpts?.package ?? "uploadthing/client",
			input: opts.input
		}).pipe(provideService(FetchContext, fetchFn), (effect) => runPromiseExit(effect, opts.signal && { signal: opts.signal })).then((exit) => {
			if (exit._tag === "Success") return exit.value;
			else if (exit.cause._tag === "Interrupt") throw new UploadAbortedError();
			throw causeSquash(exit.cause);
		});
	};
	return {
		uploadFiles: typedUploadFiles,
		createUpload: controllableUpload,
		routeRegistry
	};
};

//#endregion
//#region src/storage/index.ts
async function apiFetch(url, apiKey, init) {
	try {
		const res = await fetch(url, {
			...init,
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
				...init?.headers
			}
		});
		if (!res.ok) return {
			data: null,
			error: (await res.json().catch(() => ({}))).message ?? `HTTP ${res.status}`
		};
		return {
			data: await res.json(),
			error: null
		};
	} catch (err) {
		return {
			data: null,
			error: err instanceof Error ? err.message : "Network error"
		};
	}
}
var StorageBucketRef = class {
	constructor(projectUrl, apiKey, bucketName) {
		this.projectUrl = projectUrl;
		this.apiKey = apiKey;
		this.bucketName = bucketName;
	}
	storageBase() {
		const bucket = encodeURIComponent(this.bucketName);
		return `${this.projectUrl}/storage/buckets/${bucket}`;
	}
	async list() {
		return apiFetch(`${this.storageBase()}/objects`, this.apiKey);
	}
	async upload(file) {
		try {
			const uploadUrl = `${this.storageBase()}/upload`;
			const { uploadFiles } = genUploader({ url: uploadUrl });
			const utFile = (await uploadFiles("bucketUploader", {
				files: [file],
				headers: { Authorization: `Bearer ${this.apiKey}` }
			}))[0];
			if (!utFile) return {
				data: null,
				error: "Upload returned no files"
			};
			return apiFetch(`${this.storageBase()}/objects`, this.apiKey, {
				method: "POST",
				body: JSON.stringify({
					name: utFile.name,
					size: utFile.size,
					type: file.type || "application/octet-stream",
					utKey: utFile.key,
					url: utFile.url
				})
			});
		} catch (err) {
			return {
				data: null,
				error: err instanceof Error ? err.message : "Upload failed"
			};
		}
	}
	async remove(objectId) {
		return apiFetch(`${this.projectUrl}/storage/objects/${objectId}`, this.apiKey, { method: "DELETE" });
	}
	async getSignedUrl(objectId) {
		return apiFetch(`${this.projectUrl}/storage/objects/${objectId}/signed-url`, this.apiKey);
	}
};
var ApiDatabaseStorage = class {
	constructor(projectUrl, apiKey) {
		this.projectUrl = projectUrl;
		this.apiKey = apiKey;
	}
	from(bucketName) {
		return new StorageBucketRef(this.projectUrl, this.apiKey, bucketName);
	}
};

//#endregion
//#region src/auth/index.ts
var ApiDatabaseAuth = class {
	constructor(projectUrl) {
		this.projectUrl = projectUrl;
		this.currentToken = null;
	}
	async signUp(credentials) {
		try {
			const res = await fetch(`${this.projectUrl}/auth/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(credentials)
			});
			if (!res.ok) return {
				data: null,
				error: (await res.json().catch(() => ({}))).message ?? "Sign up failed"
			};
			const data = await res.json();
			this.currentToken = data.accessToken;
			return {
				data,
				error: null
			};
		} catch (err) {
			return {
				data: null,
				error: err instanceof Error ? err.message : "Network error"
			};
		}
	}
	async signIn(credentials) {
		try {
			const res = await fetch(`${this.projectUrl}/auth/signin`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(credentials)
			});
			if (!res.ok) return {
				data: null,
				error: (await res.json().catch(() => ({}))).message ?? "Sign in failed"
			};
			const data = await res.json();
			this.currentToken = data.accessToken;
			return {
				data,
				error: null
			};
		} catch (err) {
			return {
				data: null,
				error: err instanceof Error ? err.message : "Network error"
			};
		}
	}
	async sendMagicLink(email) {
		try {
			if (!(await fetch(`${this.projectUrl}/auth/magic-link`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email })
			})).ok) return { error: "Failed to send magic link" };
			return { error: null };
		} catch (err) {
			return { error: err instanceof Error ? err.message : "Network error" };
		}
	}
	signInWithGoogle() {
		window.location.href = `${this.projectUrl}/auth/google`;
	}
	signInWithGithub() {
		window.location.href = `${this.projectUrl}/auth/github`;
	}
	signOut() {
		this.currentToken = null;
	}
	getUser() {
		if (!this.currentToken) return null;
		try {
			const payload = JSON.parse(atob(this.currentToken.split(".")[1]));
			return {
				id: payload.sub,
				email: payload.email
			};
		} catch {
			return null;
		}
	}
	getAccessToken() {
		return this.currentToken;
	}
};

//#endregion
//#region src/client.ts
var ApiDatabaseClient = class {
	constructor(projectUrl, apiKey) {
		this.projectUrl = projectUrl;
		this.apiKey = apiKey;
		this.db = new ApiDatabaseDb(projectUrl, apiKey);
		this.realtime = new apiDatabaseRealtime(projectUrl, apiKey);
		this.storage = new ApiDatabaseStorage(projectUrl, apiKey);
		this.auth = new ApiDatabaseAuth(projectUrl);
	}
	from(table) {
		return this.db.from(table);
	}
};

//#endregion
//#region src/index.ts
function createClient(projectUrl, apiKey) {
	return new ApiDatabaseClient(projectUrl, apiKey);
}

//#endregion
export { ApiDatabaseAuth, ApiDatabaseClient, ApiDatabaseDb, ApiDatabaseStorage, QueryBuilder, apiDatabaseRealtime, createClient };
//# sourceMappingURL=index.js.map