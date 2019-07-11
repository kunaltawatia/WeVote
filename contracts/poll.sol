pragma solidity ^0.5.0;

contract poll {
    string public regex;
    uint8 public options;
    mapping(uint8=>uint8) public result;
    mapping(address=>bool) public voted;
    constructor(string memory _regex,uint8 _options) public {
        regex = _regex;
        options = _options;
    }
    event addVote(uint8 _choice);
    function vote(uint8 _choice) public{
        require(voted[msg.sender] == false,"Already Voted");
        require(_choice > 0 && _choice <= options,"Invalid Choice");
        voted[msg.sender] = true;
        result[_choice]++;
        emit addVote(_choice);
    }
}