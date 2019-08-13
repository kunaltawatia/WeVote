pragma solidity ^0.5.0;

contract publicPoll {
    string public regex;
    uint8 public options;
    mapping(uint8=>uint8) public result;
    mapping(address=>uint8) public voted;
    constructor(string memory _regex,uint8 _options) public {
        regex = _regex;
        options = _options;
    }
    event addVote(uint8 _choice);
    function vote(uint8 _choice) public{
        require(_choice > 0 && _choice <= options,"Invalid Choice");
        require(voted[msg.sender] == 0,"Already Voted");
        voted[msg.sender] = _choice;
        result[_choice]++;
        emit addVote(_choice);
    }
}