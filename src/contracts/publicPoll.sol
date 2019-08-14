pragma solidity ^0.5.0;

contract publicPoll {
    string public regex;
    uint8 public options;
    mapping(uint8=>uint8) public result;
    mapping(address=>uint8) public voted;
    address[] public votersVoted;
    uint8 public totalVoters;
    constructor(string memory _regex,uint8 _options) public {
        regex = _regex;
        options = _options;
        totalVoters = 0;
    }
    event addVote(uint8 _choice,address sender);
    function vote(uint8 _choice) public{
        require(_choice > 0 && _choice <= options,"Invalid Choice");
        require(voted[msg.sender] == 0,"Already Voted");
        voted[msg.sender] = _choice;
        result[_choice]++;
        votersVoted.push(msg.sender);
        totalVoters += 1;
        emit addVote(_choice,msg.sender);
    }
}