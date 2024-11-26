// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IMockRouter} from "./interfaces/IMockRouter.sol";

contract MockRouter is IMockRouter {
    uint256 internal _requestId;
    mapping(uint64 => mapping(address => bool)) internal _allowed;

    event RequestEvent(
        bytes32 indexed requestId,
        bytes data,
        uint64 indexed subscriptionId,
        bytes32 indexed donId,
        uint16 dataVersion,
        uint32 callbackGasLimit
    );

    event ConsumerEvent(address indexed consumer, uint64 indexed subscriptionId, bool indexed allowed);

    function sendRequest(
        uint64 subscriptionId,
        bytes calldata data,
        uint16 dataVersion,
        uint32 callbackGasLimit,
        bytes32 donId
    ) external returns (bytes32 requestId) {
        requestId = bytes32(_requestId++);

        emit RequestEvent(requestId, data, subscriptionId, donId, dataVersion, callbackGasLimit);
    }

    function getConsumer(address consumer, uint64 subscriptionId)
        external
        view
        override(IMockRouter)
        returns (Consumer memory)
    {
        return Consumer(_allowed[subscriptionId][consumer], 0, 0);
    }

    function addConsumer(uint64 subscriptionId, address consumer) external override(IMockRouter) {
        _allowed[subscriptionId][consumer] = true;

        emit ConsumerEvent(consumer, subscriptionId, true);
    }

    function removeConsumer(uint64 subscriptionId, address consumer) external override(IMockRouter) {
        _allowed[subscriptionId][consumer] = false;

        emit ConsumerEvent(consumer, subscriptionId, false);
    }
}
