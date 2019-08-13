pragma solidity ^0.5.0;
contract publicDB{
    function getDetails(address addr) public view returns(string memory){}
}
contract authenticatedPoll {
    string public regex;
    uint8 public options;
    address dbAddr;
    publicDB db;
    mapping(uint8=>uint8) public result;
    mapping(address=>uint8) public voted;
    constructor(string memory _regex,uint8 _options,address database) public {
        regex = _regex;
        options = _options;
        dbAddr = database;
        db = publicDB(dbAddr);
    }
    event addVote(uint8 _choice,string name);
    function vote(uint8 _choice) public{
        string memory name = getData(msg.sender);
        require(bytes(name).length > 4,"Not Subscribed Voter");
        require(_choice > 0 && _choice <= options,"Invalid Choice");
        require(voted[msg.sender] == 0,"Already Voted");
        voted[msg.sender] = _choice;
        result[_choice]++;
        emit addVote(_choice,name);
    }
    function getData(address addr) public view returns(string memory){
        return db.getDetails(addr);
    }
    function changeDB(address addr) public{
        dbAddr = addr;
        db = publicDB(dbAddr);
    }
}