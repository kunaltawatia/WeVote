pragma solidity >=0.4.22 <0.6.0;

contract publicDB{
    address public owner;
    address[] public voters;
    mapping (address => string) public details ;
    mapping(address=>bool) public authorisation;
    mapping(address=>uint8) public reports;
    uint8 public voterCount;
    constructor(string memory detail)
    public
    {
        owner = msg.sender;
        details[owner] = detail;
        voters.push(msg.sender);
        authorisation[msg.sender] = true;
        voterCount = 1;
    }
    function getDetails(address addr) public view returns(bool result){
        return authorisation[addr];
    }
    event detailsAdded(address addr,string details);
    function addDetails(string memory detail) public{
        details[msg.sender] = detail;
        voters.push(msg.sender);
        authorisation[msg.sender] = false;
        voterCount = voterCount + 1;
        reports[msg.sender] = 0;
        emit detailsAdded(msg.sender,detail);
    }
    function authorise(address voterAddress) public{
        require(msg.sender == owner,"Only Owner Can Authorise");
        authorisation[voterAddress] = true;
    }
    function unAuthorise(address voterAddress) public{
        require(msg.sender == owner,"Only Owner Can Unauthorise");
        authorisation[voterAddress] = false;
    }
    function report(address voterAddress) public{
        require(authorisation[msg.sender] == true,"Only Authorised voter can report");
        reports[voterAddress] = reports[voterAddress] + 1;
    }
}