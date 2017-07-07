var vows = require('vows'),
    assert = require('assert'),
    ChordUtils = require('../../p2p/libs/utils');

vows.describe('Chord Development Environment').addBatch({
    'Testing hashTestId()': {
        'is 4-bytes length': function () {
            var id = ChordUtils.hashTestId();

            assert.strictEqual(id.length, 4);
        }
    }
}).export(module);;
