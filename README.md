![](https://flowchain.io/fb0/images/logo-text%40128.png)

Flowchain-ledger is a distributed ledger for the Internet of Things (IoT), and designed the software architecture from the ground up.

# Introduction

Flowchain created a new software architecture for the IoT blockchain to provide a distributed ledger programming framework for peer-to-peer IoT networks and real-time data transactions, and ```flowchain-ledger``` is the distributed ledger subsystem of the Flowchain framework.

This is a pre-release for coming public alpha, and it's not currently ready to use.

# Features

* Mining-based Proof-of-Stake (PoS)
* Run on every IoT node
* RPC over the Websocket protocol
* Distributed Hash Table (DHT) by the Chord protocol

## How to use

Start a flowchain boot node first:

```
$ git clone https://github.com/flowchain/flowchain-ledger.git
$ cd flowchain-ledger
$ npm install
$ export HOST=192.168.1.1
$ export PORT=8000
$ node boot.js
```

The server is running at ```192.168.1.1:8000```. Please modify the IP address and port number to fit your environment. Second, please open the ```node.js``` file and modify the ```join``` property:

```
server.start({
	...
	join: {
		address: '192.168.1.1',
		port: 8000
	}
});
```

Start the peer node:

```
$ export HOST=192.168.1.2
$ export PORT=8001
$ node node.js
```

The peer node will intend to join the p2p network via the ```192.168.1.1:8000``` node.

## Bibliography

[1] Chen, J. (2017). Flowchain: A Distributed Ledger Designed for Peer-to-Peer IoT Networks and Real-time Data Transactions. In: 2nd International Workshop on Linked Data and Distributed Ledgers. Portoroz.

## License

Copyright (C) 2016-present Jollen. The source code is licensed under the MIT license found in the [LICENSE](LICENSE) file.
