var NodeRSA = require('node-rsa');

/*
 * Load key from PEM string
 */
var keyData =
'-----BEGIN RSA PRIVATE KEY-----\n'+
'MIIEpQIBAAKCAQEAvHBt1149/oWUZT9ji7NLd8nWb1zFnQ1p9gz5zoZtxyJ0iKuQ\n'+
'rMUl7Yw93r4+TpPwXBBn0aeZo5EAaN+zg0VDkM+bKujTezTdJRmg9TkycAhyWjPI\n'+
'UdsJRwu5ivXkYKzYAujzySKlVfnm3E8i3jafy0s8ezpzeVNR0741HkG6ft16ajMl\n'+
'wOfizay8w/z9mwJ8HxTqs4Ehhkm8NJ6zCLr3haCzHbKfQpzYXi9ZTocRKpKtZYfk\n'+
'OngPJlIlJTDxL32/LTq6A1nHUiNCIsxQQ6ArfZocbTEcUuMQd2xTLsio+bX897Rp\n'+
'D0f6s4y/t2HC4bf0DyI10/M5B/bdkykrY4QwxQIDAQABAoIBAA667ystt8TkpkP/\n'+
'34U1H8oeYf/UjbIIMWdFfmWRhpVRcTCZ0LZgtuVJ2DBISNCVqe1YbvUpl838cL7B\n'+
'9eNmD7ELOYLyLk3sRPk4dqeUsAen8WBxudAEQkZmeTuOmyqfeEdJ9Hydk7UT0uMX\n'+
'4I7kUDtxBypO2GX8iGH39WkHFFAEV83CCDD19jF7hVk4Fj5celosFWQUcUNIrE51\n'+
'tUKJGt1zhGtsqhHotKAc64QdHrgV6ue0b7XVs5G/PF39vROYqD6GFT+nUkFEqRZz\n'+
'fglQbr8PaibdMWxK/dz6dYcIz5FLygY2GnpkQdsF5dir9rX6qypaIihlwAMhF+ij\n'+
'Nj+o7AUCgYEA28AVdi2gN4XSuKpwqJYnNqyw/KMOpG7nZBD9Wc+P0FjPyZHVQrxX\n'+
'vhu4MFV9zdupLaFGP6VpSAavq2Bct5tGnzB99T3fmfzMNfJeoDknGzdZekxetkyO\n'+
'oBpHH15Q3fKemVs7K6PyaWqDyN0lsDBEUF/ZWvioUxNRSILQ5yaC+yMCgYEA24YY\n'+
'ZDhGj9/geH6d/6WGvDHbO1xcbzaRr+GReMrqOJZI/5YawC/7Ua+smOfQgSlm+d0s\n'+
'vAFGE0GsqfqxMSrKWL61FaMeb3cTEdSNpQHN9fcXPzjj+VBqaxGGBTeKZu5WiT05\n'+
'F9EJsxn5lG6B3O1ylTExiwbfJBNGCU8m5rMTtvcCgYEAh9b1bVhG8guHdx/lBFHN\n'+
'a77UqVcidgMYhoL6Gcp03BYKXFAJxHcoxhvcgARZACgJLGvFQRK/QgbgENBAgD88\n'+
'KKuRMUhOMKJUmgR4+hJaWjic1zzeT1KD1/Rmgr2Kv6h64dHDgfaWoxN043XRFli/\n'+
'4e9eLR4I71HBrVEwUbM8xIECgYEAupf+v6E+CSlIyeMGNbjjD7BpIsndIAMITrGz\n'+
'TzNbZ4IGxok2b8nZG5PxZ38TsdYZW6VuUtfaUp/uPgWC+8HdgRWJIr0mL6TNJsi/\n'+
'JVSlVr8SmYCn9tEtw5h/jIurLtbD45+QmffrALvBczODWuDSFpJcBEpw/V8Mlvka\n'+
'ndn1lf0CgYEAxvTLQGoVblZOmkL8d/lILdO6KNk+EWHXmSYi2BsyPZ7JHGoXOPZF\n'+
'sMKGylniYig2vi0tHrkR0c2yA9+81/S++Y5ODiSVlDiOc0NQEvw0mFbxregFkRxV\n'+
'd+HEPKioC9aIW3+nykW7vKOz1Ezfxz7TgTrSWukXX5MwyjtP4SUsW4s=\n'+
'-----END RSA PRIVATE KEY-----';
//var key = new NodeRSA();
//key.importKey(keyData, 'pkcs1');

/*
 * Generate a new 512bit-length key (64 bytes)
 */
var key = new NodeRSA({b: 512});
key.importKey(keyData, 'pkcs1');

var newPrivateKey = key.exportKey('pkcs1-der')
var encrypted = key.encrypt(newPrivateKey, 'base64');

console.log( encrypted );
