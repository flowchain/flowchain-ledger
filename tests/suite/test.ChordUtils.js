var vows = require('vows'),
    assert = require('assert'),
    ChordUtils = require('../../p2p/libs/utils');

vows.describe('Chord Utils').addBatch({
    'Testing key in half ranges': {
        'is in half range': function () {
            assert.isTrue( ChordUtils.isInHalfRange('a40990f3092be5541c2edf2d8ce9a7f32a5bad14',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad10',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad20') );
        },

        'key equals n, key ∈ (n, successor]': function () {
            assert.isFalse( ChordUtils.isInHalfRange('a40990f3092be5541c2edf2d8ce9a7f32a5bad10',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad10',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad20') );
        },

        'key equals successor, key ∈ (n, successor]': function () {
            assert.isTrue( ChordUtils.isInHalfRange('a40990f3092be5541c2edf2d8ce9a7f32a5bad20',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad10',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad20') );
        },

        'out of range': function () {
            assert.isFalse( ChordUtils.isInHalfRange('a40990f3092be5541c2edf2d8ce9a7f32a5bfd20',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad10',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad20') );
        }
    },

    'Testing key in ranges': {
        'is in range': function () {
            assert.isTrue( ChordUtils.isInRange('a40990f3092be5541c2edf2d8ce9a7f32a5bad14',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad10',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad20') );
        },

        'key equals left, key ∈ (left, right)': function () {
            assert.isFalse( ChordUtils.isInRange('a40990f3092be5541c2edf2d8ce9a7f32a5bad10',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad10',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad20') );
        },

        'key equals right, key ∈ (left, right)': function () {
            assert.isFalse( ChordUtils.isInRange('a40990f3092be5541c2edf2d8ce9a7f32a5bad20',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad10',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad20') );
        },

        'out of range': function () {
            assert.isFalse( ChordUtils.isInRange('a40990f3092be5541c2edf2d8ce9a7f32a5bfd20',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad10',
                                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad20') );
        }
    },

    'Testing getFixFingerId when key is big integer': {
        'exponent is 0': function () {
            assert.deepStrictEqual( ChordUtils.getFixFingerId('00000000', 0),
                                    '00000001');
        },

        'exponent is 1': function () {
            assert.deepStrictEqual( ChordUtils.getFixFingerId('00000000', 1),
                                    '00000002');
        },

        'exponent is 2': function () {
            assert.deepStrictEqual( ChordUtils.getFixFingerId('00000000', 2),
                                    '00000004');
        },

        'exponent is 8': function () {
            assert.deepStrictEqual( ChordUtils.getFixFingerId('00000000', 8),
                                    '00000100');
        },

        'exponent is 64': function () {
            assert.deepStrictEqual( ChordUtils.getFixFingerId('00000000000000000000', 64),
                                    '00010000000000000000');
        },
    },

    'Testing getFixFingerId when key is SHA-1 hash': {
        'exponent is 0': function () {
            assert.deepStrictEqual( ChordUtils.getFixFingerId('a40990f3092be5541c2edf2d8ce9a7f32a5bad14', 0),
                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad15');
        },

        'exponent is 1': function () {
            assert.deepStrictEqual( ChordUtils.getFixFingerId('a40990f3092be5541c2edf2d8ce9a7f32a5bad14', 1),
                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad16');
        },

        'exponent is 2': function () {
            assert.deepStrictEqual( ChordUtils.getFixFingerId('a40990f3092be5541c2edf2d8ce9a7f32a5bad14', 2),
                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bad18');
        },

        'exponent is 8': function () {
            assert.deepStrictEqual( ChordUtils.getFixFingerId('a40990f3092be5541c2edf2d8ce9a7f32a5bad14', 8),
                                    'a40990f3092be5541c2edf2d8ce9a7f32a5bae14');
        },

        'exponent is 64': function () {
            assert.deepStrictEqual( ChordUtils.getFixFingerId('a40990f3092be5541c2edf2d8ce9a7f32a5bad14', 64),
                                    'a40990f3092be5541c2edf2e8ce9a7f32a5bb000');
        },
    }
}).export(module);;
