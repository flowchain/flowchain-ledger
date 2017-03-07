![](https://flowchain.io/fb0/images/logo-text%40128.png)

Flowchain-ledger is a distributed ledger for the Internet of Things (IoT), and designed the software architecture from the ground up.

# Introduction

Flowchain created a new software architecture for the IoT blockchain to provide a distributed ledger programming framework for peer-to-peer IoT networks and real-time data transactions, and ```flowchain-ledger``` is the distributed ledger subsystem of the Flowchain framework.

This is a pre-release for coming public alpha, and it's not currently ready to use.

## How to use

Start a flowchain boot node first:

```
$ git clone https://github.com/flowchain/flowchain-ledger.git
$ cd flowchain-core
$ npm install
$ export HOST=192.168.1.1
$ export PORT=8000
$ node boot.js
```

The server runs at ```192.168.1.1:8000```, and please modify the IP address and port number to fit your environment.

```
export PORT=8001
node node1.js
```

Then, please open ```node.js``` and modify the ```join``` property:

```
server.start({
    onstart: onstart,
	onmessage: onmessage,
	join: {
		address: '192.168.1.1',
		port: 8000
	}
});
```


## History

alpha-3: 2017.03.07
 * Add PicoDB support
 * Support MediaTek LinkIt Smart 7688
 * Pre-release for public alpha

v0.5: 2016.12.28
 * Support transaction verify
 * Update boot node and peer node applications

v0.4: 2016.12.28
 * Bug fixes. ([#62bbfb876f0cca1c4144cc55831a2a5cd42e4f6d])
 * Support leveldb and nedb
 * Add new event: ```ondata```

v0.3: 2016.12.27
 * New difficulty algorithm based on normal distribution
 * Support [IoT broker architecture](https://wotcity.com)
 * Support data query
 * Support failure check

v0.2: 2016.12.26
 * New feature: Save K to successor(K)
 * New feature: event aggregation
 * Support block store based on LevelDB

v0.1: 2016.12.23
 * Ontology: blockchain, IoT, WoT, p2p and IoT hub/gateway.
 * Architecture: REST, RPC

## License

Copyright (C) 2016-present Jollen. The source code is licensed under the MIT license found in the [LICENSE](LICENSE) file.
