pragma solidity >=0.4.22 <0.6.0;

contract publicDB{
    address public owner;
    mapping (address => string) details ;
    constructor(string memory detail)
    public
    {
        owner = msg.sender;
        details[owner] = detail;
    }
    function getDetails(address addr) public view returns(string memory){
        return details[addr];
    }
    function addDetails(string memory detail) public{
        details[msg.sender] = detail;
    }
}