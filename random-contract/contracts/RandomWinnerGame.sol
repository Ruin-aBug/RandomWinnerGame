// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";

contract RandomWinnerGame is Ownable, VRFV2WrapperConsumerBase {
    // 请求时需要的LINK数量
    uint256 public fee;

    address public vrfWrapper;

    // 玩家地址列表
    address[] public players;

    // 玩家的最大数量
    uint256 maxPlayers;

    // 游戏开始
    bool public gameStarted;

    // 游戏入场费
    uint256 entryFee;

    // 当前游戏Id
    uint256 public gameId;

    event GameStarted(uint256 gameId, uint256 maxPlayers, uint256 entryFee);
    event PlayerJoined(uint256 gameId, address player);
    event GameEnded(uint256 gameId, address winner, uint256 requestId);

    constructor(
        address _link,
        address _vrfWrapper,
        uint256 vrfFee
    ) VRFV2WrapperConsumerBase(_link, _vrfWrapper) {
        vrfWrapper = _vrfWrapper;
        fee = vrfFee;
        gameStarted = false;
    }

    function startGame(
        uint256 _maxPlayer,
        uint256 _entrayFee
    ) public onlyOwner {
        require(!gameStarted, "Game is runing");
        delete players;
        maxPlayers = _maxPlayer;
        entryFee = _entrayFee;
        gameStarted = true;

        gameId += 1;
        emit GameStarted(gameId, maxPlayers, entryFee);
    }

    function joinGame() public payable {
        require(gameStarted, "Error:Game has not been started yet");
        require(msg.value == entryFee, "Value sent is not equal to entryFee");
        require(players.length <= maxPlayers, "Game is full");

        players.push(msg.sender);
        emit PlayerJoined(gameId, msg.sender);
        if (players.length == maxPlayers) {
            getRandomWinner();
        }
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal virtual override(VRFV2WrapperConsumerBase) {
        uint256 winnerIndex = _randomWords[0] % players.length;
        address winner = players[winnerIndex];

        (bool sent, ) = winner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
        emit GameEnded(gameId, winner, _requestId);
        gameStarted = false;
    }

    function getRandomWinner() private returns (uint256 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");

        return requestRandomness(100000, 3, 1);
    }

    receive() external payable {}

    fallback() external payable {}
}
