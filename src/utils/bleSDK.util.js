var _0x23e1 = ['getUint16', 'getUint8', 'setFullYear', 'setHours', 'setMinutes', 'setSeconds', 'getInt16', 'year', 'month', 'day', 'hour', 'minute', 'second', 'timeOffset', 'glucoseConcentration', 'mealData', 'exports', '00002A18-0000-1000-8000-00805F9B34FB', '00002A34-0000-1000-8000-00805F9B34FB', 'startBluetoothDevicesDiscovery', '00001808-0000-1000-8000-00805F9B34FB', 'devices', 'forEach', 'name', 'deviceId', 'indexOf', 'meter', 'Accu', 'push', 'length', 'createBLEConnection', 'closeBLEConnection', 'getBLEDeviceServices', 'services', 'isPrimary', 'log', 'getBLEDeviceCharacteristics', 'characteristics', 'uuid', 'notifyBLECharacteristicValueChange', 'splice', 'setUint8', '写入成功\x0a', 'onBLECharacteristicValueChange', 'characteristicId', 'sequence', '读取2018', 'value', '读取2034', '写入失败\x0a']; (function (_0x43ff18, _0x3d65c8) { var _0x1c2150 = function (_0x583db5) { while (--_0x583db5) { _0x43ff18['push'](_0x43ff18['shift']()); } }; _0x1c2150(++_0x3d65c8); }(_0x23e1, 0x1a1)); var _0x2ad9 = function (_0x653733, _0x2a7593) { _0x653733 = _0x653733 - 0x0; var _0x1da6c6 = _0x23e1[_0x653733]; return _0x1da6c6; }; var foundDevices = []; const glucoseList = []; const mealStatusList = []; const writeCharacteristicId = '00002A52-0000-1000-8000-00805F9B34FB'; const notifyCharacteristicId = _0x2ad9('0x0'); const notifyCharacteristicId1 = _0x2ad9('0x1'); function searchRoche(_0x4b53d6, _0x1b06c4) { foundDevices = []; wx['openBluetoothAdapter']({ 'success': function (_0x17f0ca) { wx[_0x2ad9('0x2')]({ 'allowDuplicatesKey': !![], 'services': [_0x2ad9('0x3')], 'success': function (_0x17f0ca) { wx['onBluetoothDeviceFound'](function (_0x17f0ca) { _0x17f0ca[_0x2ad9('0x4')][_0x2ad9('0x5')](function (_0x2d4cde) { if (!_0x2d4cde[_0x2ad9('0x6')] && !_0x2d4cde['localName']) { return; } const _0x4513f1 = inArray(foundDevices, _0x2ad9('0x7'), _0x2d4cde[_0x2ad9('0x7')]); if (_0x4513f1 === -0x1) { if (_0x2d4cde[_0x2ad9('0x6')][_0x2ad9('0x8')](_0x2ad9('0x9')) != -0x1 || _0x2d4cde[_0x2ad9('0x6')][_0x2ad9('0x8')](_0x2ad9('0xa')) != -0x1) { foundDevices[_0x2ad9('0xb')](_0x2d4cde); } } _0x4b53d6(foundDevices); }); }); }, 'fail': function (_0x17f0ca) { _0x1b06c4(_0x17f0ca); } }); }, 'fail': function (_0x41e909) { _0x1b06c4(_0x41e909); } }); } function inArray(_0x5b76c8, _0x4bf890, _0x496014) { for (let _0x383de0 = 0x0; _0x383de0 < _0x5b76c8[_0x2ad9('0xc')]; _0x383de0++) { if (_0x5b76c8[_0x383de0][_0x4bf890] === _0x496014) { return _0x383de0; } } return -0x1; } function pair(_0x393f70, _0x2736b8, _0x5e09c6) { wx[_0x2ad9('0xd')]({ 'deviceId': _0x393f70, 'success': function (_0xf8ec3d) { getBLEDeviceServices(_0x393f70, _0x2736b8, _0x5e09c6); }, 'fail': function (_0x33fa56) { _0x5e09c6(_0x33fa56); wx[_0x2ad9('0xe')]({ 'deviceId': _0x393f70 }); } }); wx['stopBluetoothDevicesDiscovery'](); } function pairLastDevice(_0x1363e9, _0x653d78, _0x25866c) { wx[_0x2ad9('0xd')]({ 'deviceId': _0x1363e9, 'success': function (_0x2d8854) { setTimeout(function () { notifyBLECharacteristicValueChange(_0x1363e9, '00001808-0000-1000-8000-00805F9B34FB', writeCharacteristicId, _0x653d78, _0x25866c); notifyBLECharacteristicValueChange(_0x1363e9, _0x2ad9('0x3'), notifyCharacteristicId, _0x653d78, _0x25866c); notifyBLECharacteristicValueChange(_0x1363e9, '00001808-0000-1000-8000-00805F9B34FB', notifyCharacteristicId1, _0x653d78, _0x25866c); }, 0x3e8); }, 'fail': function (_0x1496b6) { _0x25866c(_0x1496b6); wx[_0x2ad9('0xe')]({ 'deviceId': _0x1363e9 }); } }); } function getBLEDeviceServices(_0x12549a, _0x2bb6c7, _0x3a4faa) { wx[_0x2ad9('0xf')]({ 'deviceId': _0x12549a, 'success': function (_0x2643ba) { for (let _0x172337 = 0x0; _0x172337 < _0x2643ba[_0x2ad9('0x10')]['length']; _0x172337++) { if (_0x2643ba[_0x2ad9('0x10')][_0x172337][_0x2ad9('0x11')]) { var _0x8699a0 = _0x2643ba[_0x2ad9('0x10')][_0x172337]['uuid']; _0x2bb6c7(_0x8699a0); console[_0x2ad9('0x12')](_0x8699a0); return; } } }, 'fail': function (_0x4b8185) { _0x3a4faa(_0x4b8185); } }); } function getBLEDeviceCharacteristics(_0x5388c7, _0x1cf6ba, _0x1e0c78, _0x1e09f3) { wx[_0x2ad9('0x13')]({ 'deviceId': _0x5388c7, 'serviceId': _0x1cf6ba, 'success': function (_0x205afa) { for (let _0x156dca = 0x0; _0x156dca < _0x205afa[_0x2ad9('0x14')][_0x2ad9('0xc')]; _0x156dca++) { let _0x4a58d9 = _0x205afa[_0x2ad9('0x14')][_0x156dca]; if (_0x4a58d9[_0x2ad9('0x15')] == writeCharacteristicId) { notifyBLECharacteristicValueChange(_0x5388c7, _0x1cf6ba, _0x4a58d9[_0x2ad9('0x15')], _0x1e0c78, _0x1e09f3); } if (_0x4a58d9['uuid'] == notifyCharacteristicId1) { notifyBLECharacteristicValueChange(_0x5388c7, _0x1cf6ba, _0x4a58d9[_0x2ad9('0x15')], _0x1e0c78, _0x1e09f3); } if (_0x4a58d9[_0x2ad9('0x15')] == notifyCharacteristicId) { notifyBLECharacteristicValueChange(_0x5388c7, _0x1cf6ba, _0x4a58d9[_0x2ad9('0x15')], _0x1e0c78, _0x1e09f3); } } }, 'fail': function (_0x36d0cb) { _0x1e09f3(_0x36d0cb); } }); } function notifyBLECharacteristicValueChange(_0x2e03c8, _0x1b0081, _0xf435aa, _0x5a72d1, _0x3d1f6c) { wx[_0x2ad9('0x16')]({ 'state': !![], 'deviceId': _0x2e03c8, 'serviceId': _0x1b0081, 'characteristicId': _0xf435aa, 'success': function (_0x305f6a) { _0x5a72d1(_0x305f6a); }, 'fail': function (_0x49bb5c) { _0x3d1f6c(_0x49bb5c); } }); } function syncData(_0x578f7d, _0x42458c, _0x46d45a, _0x4a8003, _0x487c0c) { if (glucoseList[_0x2ad9('0xc')] > 0x0) { glucoseList[_0x2ad9('0x17')](0x0, glucoseList[_0x2ad9('0xc')]); }; if (mealStatusList[_0x2ad9('0xc')] > 0x0) { mealStatusList[_0x2ad9('0x17')](0x0, mealStatusList[_0x2ad9('0xc')]); }; let _0x2851e8 = new ArrayBuffer(0x2); let _0x2e2b00 = new DataView(_0x2851e8); _0x2e2b00[_0x2ad9('0x18')](0x0, 0x1); _0x2e2b00[_0x2ad9('0x18')](0x1, 0x1); wx['writeBLECharacteristicValue']({ 'deviceId': _0x578f7d, 'serviceId': _0x42458c, 'characteristicId': writeCharacteristicId, 'value': _0x2851e8, 'success': function (_0x4d7165) { console[_0x2ad9('0x12')](_0x2ad9('0x19')); wx[_0x2ad9('0x1a')](function (_0x4d7165) { if (_0x4d7165[_0x2ad9('0x1b')] == notifyCharacteristicId) { var _0x399cce = glucoseReadingRx(_0x4d7165['value']); const _0x55f9c3 = inArray(glucoseList, _0x2ad9('0x1c'), _0x399cce['sequence']); if (_0x55f9c3 === -0x1) { glucoseList['push'](_0x399cce); } console[_0x2ad9('0x12')](_0x2ad9('0x1d')); } if (_0x4d7165['characteristicId'] == notifyCharacteristicId1) { var _0x399cce = mealStatusReadingRx(_0x4d7165[_0x2ad9('0x1e')]); const _0x4ab048 = inArray(mealStatusList, 'sequence', _0x399cce[_0x2ad9('0x1c')]); if (_0x4ab048 === -0x1) { mealStatusList['push'](_0x399cce); } } if (_0x4d7165[_0x2ad9('0x1b')] == writeCharacteristicId) { console[_0x2ad9('0x12')](_0x2ad9('0x1f')); setTimeout(function () { _0x46d45a(glucoseList); _0x4a8003(mealStatusList); }, 0x3e8); } }); }, 'fail': function (_0x1ccaf6) { console[_0x2ad9('0x12')](_0x2ad9('0x20')); _0x487c0c(_0x1ccaf6); } }); } function glucoseReadingRx(_0x4be359) { var _0x5495b5 = new Object(); let _0x52178d = new DataView(_0x4be359); var _0x222b83 = 0x0; var _0x487307 = _0x52178d['getUint8'](0x0); _0x222b83 += 0x1; var _0x4ddeb8 = 0x0; var _0x36b854 = (_0x487307 & 0x1) > 0x0; var _0x4dbe9d = 0x0; var _0x1930b8 = (_0x487307 & 0x2) > 0x0; var _0x1653ab = (_0x487307 & 0x4) == 0x0; var _0x272efe = (_0x487307 & 0x8) > 0x0; var _0x2a7a5a = _0x52178d[_0x2ad9('0x21')](_0x222b83, !![]); _0x222b83 += 0x2; var _0x590f2a = _0x52178d[_0x2ad9('0x21')](_0x222b83, !![]); var _0x2a7fcd = _0x52178d[_0x2ad9('0x22')](_0x222b83 + 0x2); var _0x4fb61c = _0x52178d[_0x2ad9('0x22')](_0x222b83 + 0x3); var _0x32d9b7 = _0x52178d[_0x2ad9('0x22')](_0x222b83 + 0x4); var _0x22d152 = _0x52178d[_0x2ad9('0x22')](_0x222b83 + 0x5); var _0x32ddc3 = _0x52178d['getUint8'](_0x222b83 + 0x6); _0x222b83 += 0x7; var _0x5ba20b = new Date(); _0x5ba20b[_0x2ad9('0x23')](_0x590f2a, _0x2a7fcd - 0x1, _0x4fb61c); _0x5ba20b[_0x2ad9('0x24')](_0x32d9b7); _0x5ba20b[_0x2ad9('0x25')](_0x22d152); _0x5ba20b[_0x2ad9('0x26')](_0x32ddc3); if (_0x36b854) { _0x4dbe9d = _0x52178d[_0x2ad9('0x27')](_0x222b83, !![]); _0x222b83 += 0x2; } if (_0x1930b8) { var _0x24d668 = _0x52178d[_0x2ad9('0x21')](_0x222b83, !![]); var _0x24d668 = getSfloat16(_0x52178d[_0x2ad9('0x22')](_0x222b83), _0x52178d[_0x2ad9('0x22')](_0x222b83 + 0x1)); _0x4ddeb8 = _0x24d668 * 0x186a0 / 0x12; _0x222b83 += 0x3; } if (_0x272efe) { var _0x1e65d4 = _0x52178d[_0x2ad9('0x21')](_0x222b83, !![]); } _0x5495b5[_0x2ad9('0x1c')] = _0x2a7a5a; _0x5495b5[_0x2ad9('0x28')] = _0x590f2a; _0x5495b5[_0x2ad9('0x29')] = _0x2a7fcd; _0x5495b5[_0x2ad9('0x2a')] = _0x4fb61c; _0x5495b5[_0x2ad9('0x2b')] = _0x32d9b7; _0x5495b5[_0x2ad9('0x2c')] = _0x22d152; _0x5495b5[_0x2ad9('0x2d')] = _0x32ddc3; _0x5495b5[_0x2ad9('0x2e')] = _0x4dbe9d; _0x5495b5[_0x2ad9('0x2f')] = _0x4ddeb8; return _0x5495b5; } function mealStatusReadingRx(_0x8fe1de) { var _0x39706e = new Object(); let _0x1bdc44 = new DataView(_0x8fe1de); var _0x494d76 = _0x1bdc44[_0x2ad9('0x21')](0x1, !![]); var _0x476c31 = _0x1bdc44[_0x2ad9('0x22')](0x3); _0x39706e[_0x2ad9('0x1c')] = _0x494d76; _0x39706e[_0x2ad9('0x30')] = _0x476c31; return _0x39706e; } function getSfloat16(_0xed8784, _0xcc3263) { var _0x4f65c9 = unsignedToSigned(unsignedByteToInt(_0xed8784) + ((unsignedByteToInt(_0xcc3263) & 0xf) << 0x8), 0xc); var _0x460706 = unsignedToSigned(unsignedByteToInt(_0xcc3263) >> 0x4, 0x4); return _0x4f65c9 * Math['pow'](0xa, _0x460706); } function unsignedByteToInt(_0xa80a5f) { return _0xa80a5f & 0xff; } function unsignedBytesToInt(_0x477ded, _0x530fc5) { return (unsignedByteToInt(_0x530fc5) << 0x8) + unsignedByteToInt(_0x477ded) & 0xffff; } function unsignedToSigned(_0x23f441, _0x2d3348) { if ((_0x23f441 & 0x1 << _0x2d3348 - 0x1) != 0x0) { _0x23f441 = -0x1 * ((0x1 << _0x2d3348 - 0x1) - (_0x23f441 & (0x1 << _0x2d3348 - 0x1) - 0x1)); } return _0x23f441; } module[_0x2ad9('0x31')] = { 'searchRoche': searchRoche, 'pair': pair, 'syncData': syncData, 'getBLEDeviceServices': getBLEDeviceServices, 'getBLEDeviceCharacteristics': getBLEDeviceCharacteristics, 'pairLastDevice': pairLastDevice };
