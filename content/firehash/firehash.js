/*
	FIRE HASH BUILD 1.5
	Created: October 2011
	Last Update: 31 December 2011
	By Sasha Helena van den Heetkamp
	http://sun.io
*/

var firehash = { 

		tohex: function(str) {
			return ("0" + str.toString(16)).slice(-2);
		},
		
		bin2hex: function(str) {
			var res = [];
			var blank = '';
			var clen = str.length;
			var hexchars = '0123456789abcdef';
			var hex = new Array(clen * 2);
			for (var i = 0; i < clen; ++i) {
				hex[i * 2] = hexchars.charAt((str.charCodeAt(i) >> 4) & 15);
				hex[i * 2 + 1] = hexchars.charAt(str.charCodeAt(i) & 15);
			}
			return hex.join('');
		},
		
		computehash: function() {
			var method = document.getElementById('hashact').value;
			var str = document.getElementById('plaintext').value;
			if(str) {
				var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
				converter.charset = "UTF-8";
				var nocrc = true;
				var result = {};
				var data = converter.convertToByteArray(str, result);
				var hash_engine = Components.classes["@mozilla.org/security/hash;1"].createInstance().QueryInterface(Components.interfaces.nsICryptoHash);
			
				switch (method) {
					case 'MD2':
					hash_engine.init(hash_engine.MD2);
					break;
					case 'MD5':
					hash_engine.init(hash_engine.MD5);
					break;
					case 'SHA1':
					hash_engine.init(hash_engine.SHA1);
					break;
					case 'SHA256':
					hash_engine.init(hash_engine.SHA256);
					break;
					case 'SHA384':
					hash_engine.init(hash_engine.SHA384);
					break;
					case 'SHA512':
					hash_engine.init(hash_engine.SHA512);
					break;
				}
				hash_engine.update(data, result.value);
				document.getElementById('result').value = firehash.bin2hex(hash_engine.finish(false));
			}
		},
		
		hasher: function(path) {
		
			method = document.getElementById('hashact').value;
			var f = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			f.initWithPath(path);
			var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
			istream.init(f, 0x01, 0444, 0);
			var ch1 = Components.classes["@mozilla.org/security/hash;1"].createInstance(Components.interfaces.nsICryptoHash);
			switch (method) {
				case 'MD2':
				ch1.init(ch1.MD2);
				break;
				case 'MD5':
				ch1.init(ch1.MD5);
				break;
				case 'SHA1':
				ch1.init(ch1.SHA1);
				break;
				case 'SHA256':
				ch1.init(ch1.SHA256);
				break;
				case 'SHA384':
				ch1.init(ch1.SHA384);
				break;
				case 'SHA512':
				ch1.init(ch1.SHA512);
				break;
			}
			ch1.updateFromStream(istream, 0xffffffff);
			var hash1 = ch1.finish(false);
			return [firehash.tohex(hash1.charCodeAt(i)) for (i in hash1)].join("");
			istream.close();
		},
		
		checksum: function() {
			try {
				var stringsBundle = document.getElementById("string-bundle-bundle");
 				var fhxulpopup = stringsBundle.getString('fhxulpopup');
				} catch(e) {
				fhxulpopup = '';
			}
			const nsIFilePicker = Components.interfaces.nsIFilePicker;
			var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
			fp.init(window,fhxulpopup,nsIFilePicker.modeOpen);
			fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);
			var rv = fp.show();
			if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
				var file = fp.file;
				var path = fp.file.path;
				document.getElementById('result').value = firehash.hasher(path);
			}
		},
		
		clip: function() {
			var copytext = document.getElementById('result').value;
			if(copytext) {
			var str = Components.classes["@mozilla.org/supports-string;1"].
			createInstance(Components.interfaces.nsISupportsString);
			if (!str) return false;
			str.data = copytext;
			var trans = Components.classes["@mozilla.org/widget/transferable;1"].
			createInstance(Components.interfaces.nsITransferable);
			if (!trans) return false;
			trans.addDataFlavor("text/unicode");
			trans.setTransferData("text/unicode", str, copytext.length * 2);
			var clipid = Components.interfaces.nsIClipboard;
			var clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(clipid);
			if (!clip) return false;
			clip.setData(trans, null, clipid.kGlobalClipboard);
			var stringsBundle = document.getElementById("string-bundle-bundle");
 			var fhcopied = stringsBundle.getString('fhcopied');
			document.getElementById('result').value = fhcopied;
			}
		}
};