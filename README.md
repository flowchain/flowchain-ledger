![](https://flowchain.io/fb0/images/logo-text%40128.png)

[![Build Status](https://travis-ci.org/flowchain/flowchain-ledger.svg?branch=master)](https://travis-ci.org/flowchain/flowchain-ledger)

Flowchain-ledger is a distributed ledger technology (DLT) for the Internet of Things (IoT) devices (aka. IoT Blockchain). The Flowchain software framework is designed from the ground up to fit current IoT needs.

# Introduction

Flowchain is a software framework for the IoT blockchain to provide a distributed ledger programming framework for peer-to-peer IoT networks and real-time data transactions, and ```flowchain-ledger``` is the Node.js distribution for heterogeneous hardware devices, such as MediaTek LinkIt Smart 7688, Raspberry Pi, laptops, smart phones and etc.

This is a beta release, and it's now ready to be evaluated.

# Features

* Mining-based Proof-of-Stake (PoS)
* Run on every IoT node
* RPC over the Websocket protocol
* Distributed Hash Table (DHT) by the Chord protocol
* The device server in Web of Things (WoT) architecture

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

The boot node is now running at the address ```192.168.1.1:8000```. Please modify the IP address and listening port number to match your own environment. Subsequently, to start a peer node and join the boot node:

```
$ export HOST=192.168.1.2           ; Peer Node (My IP address)
$ export PORT=8001                  ; Peer Node (My listening port)
$ export PEER_ADDR=192.168.1.1      ; Boot Node (The node intend to join)
$ export PEER_PORT=8000             ; Boot Node (The node intend to join)
$ node peer.js                      ; Start the new peer node
```

The new peer node will run at the address ```192.168.1.2:8001```, and subsequently join the boot node at the address ```192.168.1.1:8000```. The peer node will intend to join the p2p network. Furthuremore, you can start another peer node and join the p2p network through the boot node or one of the peer nodes. For example, to start another peer node and join the peer node at ```192.168.1.2:8001```:

```
$ export HOST=192.168.1.2
$ export HOST=8002
$ export PEER_ADDR=192.168.1.2
$ export PEER_PORT=8001
$ node peer.js
```

## Developer Guide

* [How to send sensory data to the p2p network](https://github.com/flowchain/flowchain-ledger/wiki/Sending-Data-to-P2P-Network)
* [How to use the APIs](https://github.com/flowchain/flowchain-ledger/wiki/APIs)

## Use Cases

* [Chunk store IoT server that is abstract-chunk-store compliant built using memory as the storage backend.](https://github.com/jollen/devify-chunk-store)

## Publication

### Presentation

* [Flowchain: A Case Study on Building a Blockchain for the IoT in Node.js - Jollen Chen, Flowchain.co
](https://lc3china2017.sched.com/event/Aedw/flowchain-a-case-study-on-building-a-blockchain-for-the-iot-in-nodejs-ce-jollen-chen-flowchainco), LinuxCon + ContainerCon + CloudOpen (LC3), Beijing, China, June 19-20, 2017.


### Bibliography

This work is based on the research papers.

[1] Chen, J. (2017). [Flowchain: A Distributed Ledger Designed for Peer-to-Peer IoT Networks and Real-time Data Transactions.](https://sites.google.com/site/lddleswc17/program) In: 2nd International Workshop on Linked Data and Distributed Ledgers. Portoroz.

[2] Chen, J. (2017). [Devify: Decentralized Internet of Things Software Framework for a Peer-to-Peer and Interoperable IoT Device](https://sites.google.com/view/aiotas2017/program?authuser=0) In: Advances in IoT Architecture and Systems. Toronto, Canada.

## License

Copyright (C) 2016-present Jollen. The source code is licensed under the MIT license found in the [LICENSE](LICENSE) file.
