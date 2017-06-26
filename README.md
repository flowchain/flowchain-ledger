![](https://flowchain.io/fb0/images/logo-text%40128.png)

Flowchain-ledger is a distributed ledger technology (DLT) for the Internet of Things (IoT) devices (aka. IoT Blockchain). The Flowchain software framework is designed from the ground up to fit current IoT needs.

# Introduction

Flowchain is a software framework for the IoT blockchain to provide a distributed ledger programming framework for peer-to-peer IoT networks and real-time data transactions, and ```flowchain-ledger``` is the Node.js distribution for heterogeneous hardware devices, such as MediaTek LinkIt Smart 7688, Raspberry Pi, laptops, smart phones and etc.

This is a beta release, and it's now ready to be evaluated.

# Features

* Mining-based Proof-of-Stake (PoS)
* Run on every IoT node
* RPC over the Websocket protocol
* Distributed Hash Table (DHT) by the Chord protocol

## How to use

Start a flowchain boot node:

```
$ git clone https://github.com/flowchain/flowchain-ledger.git
$ cd flowchain-ledger
$ npm install
$ export HOST=192.168.1.1
$ export PORT=8000
$ node boot.js
```

The boot node is now running at the address ```192.168.1.1:8000```. Please modify the IP address and port number to fit your environment. 

Next, to start a peer node and join the boot node:

```
$ export HOST=192.168.1.2           ; Peer Node
$ export PORT=8001                  ; Peer Node
$ export PEER_ADDR=192.168.1.1      ; Boot Node
$ export PEER_PORT=8000             ; Boot Node
$ node node.js                      ; Start the peer node
```

The peer node will run at the address ```192.168.1.2:8001```, and subsequently join the boot node at the address ```192.168.1.1:8000```. The peer node will intend to join the p2p network.

## Bibliography

This work is based on the research papers.

[1] Chen, J. (2017). [Flowchain: A Distributed Ledger Designed for Peer-to-Peer IoT Networks and Real-time Data Transactions.](https://sites.google.com/site/lddleswc17/program) In: 2nd International Workshop on Linked Data and Distributed Ledgers. Portoroz.

[2] Chen, J. (2017). [Devify: Decentralized Internet of Things Software Framework for a Peer-to-Peer and Interoperable IoT Device](https://sites.google.com/view/aiotas2017/program?authuser=0) In: Advances in IoT Architecture and Systems. Toronto, Canada.

## License

Copyright (C) 2016-present Jollen. The source code is licensed under the MIT license found in the [LICENSE](LICENSE) file.
